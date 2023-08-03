---
sidebar_position: 2
---

# Configure Cognito and IAM Authorization

While API Keys are great for testing public access, they are not a long-term solution.

Instead, apps should make use of IAM credentials from an AWS Cognito Identity Pool while also allowing signed in access to other parts of the app.

This section will outline how to do that.

## Schema

Let's assume you have the following schema:

```graphql
type Recipe @model {
	id: ID!
	owner: String! @auth(rules: [{ allow: owner, operations: [read] }])
	coverImage: String!
	title: String!
	description: String!
	servings: Int!
}
```

You want users to be able to view a `Recipe` without logging in, but you don't want to use an API key. In addition, creating a `Recipe` should only be done by signed in users.

Modify the schema as such:

```graphql
# public authorization with provider override
type Recipe
	@model
	@auth(
		rules: [
			{ allow: owner }
			{ allow: public, provider: iam, operations: [read] }
		]
	) {
	id: ID!
	owner: String! @auth(rules: [{ allow: owner, operations: [read] }])
	coverImage: String!
	title: String!
	description: String!
	servings: Int!
}
```

This tells AppSync that `read` operations are protected via IAM and Cognito, while mutations can only be done by logged in users.

It **does not** create the IAM roles or userpool itself. Let's do that by creating a Cognito userpool and a web client, and an identity pool

## Creating the Auth Constructs

Creating the Cognito resources is relatively straightforward, and once created and be applied to many different projects.

We'll take advantage of the `@aws-cdk/aws-cognito-identitypool-alpha` package since it's close to being merged into the main CDK repo and makes our lives easier.

```sh
npm i @aws-cdk/aws-cognito-identitypool-alpha
```

Now, create a `lib/cognito/auth.ts` file and add in the following imports and props:

```ts
//lib/cognito/auth.ts
import { Construct } from 'constructs'
import * as awsCognito from 'aws-cdk-lib/aws-cognito'
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'

type CreateRecipeAuth = {
	appName: string
}
```

From here, we'll create our Cognito userpool:

```ts
export function createRecipeAuth(scope: Construct, props: CreateRecipeAuth) {
	const userPool = new awsCognito.UserPool(scope, `${props.appName}-userpool`, {
		userPoolName: `${props.appName}-userpool`,
		selfSignUpEnabled: true,
		accountRecovery: awsCognito.AccountRecovery.PHONE_AND_EMAIL,
		userVerification: {
			emailStyle: awsCognito.VerificationEmailStyle.CODE,
		},
		autoVerify: {
			email: true,
		},
		standardAttributes: {
			email: {
				required: true,
				mutable: true,
			},
		},
	})

	//rest of code will go here...
}
```

    > 🗒️ Feel free to hover over each field to understand its purpose, though it's essentially allowing users to provide their email and username to signup and verify their email with a code.

Underneath our userpool, we'll create our webclient so that Cognito can be used in our frontend application:

```ts
const userPoolClient = new awsCognito.UserPoolClient(
	scope,
	`${props.appName}-userpoolClient`,
	{ userPool }
)
```

The final part for auth is to create our identity pool and our constructs from the function:

```ts
const identityPool = new IdentityPool(scope, `${props.appName}-identityPool`, {
	identityPoolName: `${props.appName}IdentityPool`,
	allowUnauthenticatedIdentities: true,
	authenticationProviders: {
		userPools: [
			new UserPoolAuthenticationProvider({
				userPool: userPool,
				userPoolClient: userPoolClient,
			}),
		],
	},
})

return { userPool, userPoolClient, identityPool }
```

## Creating the API

With Auth complete, we can create our AppSync API and data models through the use of the Amplify L3 construct. This will accept an `authenticated` and `unauthenticated` role (passed in from our Cognito Identity pool), with Cognito set as our default authorization mode.

```ts
//lib/api/appsync
import { Construct } from 'constructs'
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { AmplifyGraphqlApi } from '@aws-amplify/graphql-construct-alpha'

type AppSyncAPIProps = {
	appName: string
	authenticatedRole: IRole
	unauthenticatedRole: IRole
	userpool: UserPool
}

export function createAmplifyGraphqlApi(
	scope: Construct,
	props: AppSyncAPIProps
) {
	const api = new AmplifyGraphqlApi(scope, `${props.appName}-API`, {
		apiName: `${props.appName}-API`,

		schema: awsAppsync.SchemaFile.fromAsset(
			path.join(__dirname, './schema.graphql')
		),
		authorizationConfig: {
			defaultAuthMode: awsAppsync.AuthorizationType.USER_POOL,
			userPoolConfig: {
				userPool: props.userpool,
			},
			iamConfig: {
				unauthenticatedUserRole: props.unauthenticatedRole,
				authenticatedUserRole: props.authenticatedRole,
			},
		},
	})

	return api
}
```

## Calling the resources from our Stack

With our schema updated and resources created, the only thing left is to invoke the functions from within our stack:

```ts
const appName = 'my-recipe-app'
const cognito = createRecipeAuth(this, { appName })

const amplifyGraphQLAPI = createAmplifyGraphqlApi(this, {
	appName,
	userpool: cognito.userPool,
	authenticatedRole: cognito.identityPool.authenticatedRole,
	unauthenticatedRole: cognito.identityPool.unauthenticatedRole,
})
```

---
sidebar_position: 3
---

# Understanding Amplify Directives

This section outlines common Amplify-style directives and how they relate to CDK development. If coming from Amplify CLI, many of these concepts are familiar to you, however it may be a good refresher.

## `@model`

```graphql
type Todo @model {
	id: ID!
	name: String!
	completed: Boolean
}
```

This directive creates a DynamoDB database and the resolvers to interact with it. By specifying these 5 characters, all of the create, read, update, delete, and list operations will be created along with the subscriptions.

For more information, checkout the [data modeling](https://docs.amplify.aws/cli/graphql/data-modeling/) section of the Amplify docs.

## `@index` Configuring Global Secondary Indices

Because Amplify-style directives create the DynamoDB table automatically, the `@index` allows for flexible data modeling to still take place.

```graphql
type Customer @model @auth(rules: [{ allow: public }]) {
	id: ID!
	name: String!
		@index(
			name: "byNameAndPhoneNumber"
			sortKeyFields: ["phoneNumber"]
			queryField: "customerByNameAndPhone"
		)
	phoneNumber: String
	accountRepresentativeID: ID! @index
}
```

If your used to developing your DynamoDB tables with the L2 CDK construct and assinging GSIs yourself, the above code is equivalent to the following:

```ts
const customerTable = new Table(this, 'CustomerTable', {
	tableName: `CustomerTable`,
	billingMode: BillingMode.PAY_PER_REQUEST,
	partitionKey: {
		name: '__typename',
		type: AttributeType.STRING,
	},
	sortKey: { name: 'id', type: AttributeType.STRING },
})

customerTable.addGlobalSecondaryIndex({
	indexName: 'byNameAndPhoneNumber',
	partitionKey: {
		name: 'name',
		type: AttributeType.STRING,
	},
	sortKey: {
		name: 'phoneNumber',
		type: AttributeType.STRING,
	},
})
```

To learn more on how to assign and develop primary keys and GSI's, refer to the corresponding [Amplify documentation](https://docs.amplify.aws/cli/graphql/data-modeling/#configure-a-secondary-index)

## `@auth`

```graphql
type Todo @model @auth(rules: [{ allow: private }]) {
	id: ID!
	name: String!
	completed: Boolean
}
```

The `@auth` directive specifies the rules a user must follow when interacting with fields on an API.

`{allow: private}` means that the user must belong to a Cognito identity pool. This is similar to the `@aws_cognito_user_pools` directive from AppSync.

Note that there are many other combinations available. These rules will determine how the resolvers are generated so that the correct authorization patterns are applied.

For more details on the `@auth` directive, refer to the corresponding [Amplify documentation](https://docs.amplify.aws/cli/graphql/authorization-rules/).

> 🗒️ Auth rules can be applied at both a `type` and a `field` in your schema.

## Relationships Between Models

When building applications, it's common to have multiple models with relationships. Amplify-style directives offer several directives to achieve this.

### @hasOne

Create a one-directional one-to-one relationship between two models. For example, a Project "has one" Team. This allows you to query the team from the project record.

```graphql
type Project @model {
	id: ID!
	name: String
	team: Team @hasOne
}

type Team @model {
	id: ID!
	name: String!
}
```

### @hasMany

Create a one-directional one-to-many relationship between two models. For example, a Post has many comments. This allows you to query all the comments from the post record.

```graphql
type Post @model {
	id: ID!
	title: String!
	comments: [Comment] @hasMany
}

type Comment @model {
	id: ID!
	content: String!
}
```

### @belongsTo

Use a "belongs to" relationship to make a "has one" or "has many" relationship bi-directional. For example, a Project has one Team and a Team belongs to a Project. This allows you to query the team from the project record and vice versa.

#### bi-directional @hasOne

```graphql
type Project @model {
	id: ID!
	name: String
	team: Team @hasOne
}

type Team @model {
	id: ID!
	name: String!
	project: Project @belongsTo
}
```

#### bi-directional @hasMany

```graphql
type Post @model {
	id: ID!
	title: String!
	comments: [Comment] @hasMany
}

type Comment @model {
	id: ID!
	content: String!
	post: Post @belongsTo
}
```

For a deeper view into creating relations in your data model, refer to the [Amplify documentation](https://docs.amplify.aws/cli/graphql/data-modeling/#setup-relationships-between-models)

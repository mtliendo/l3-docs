---
sidebar_position: 1
---

# Introduction

The Amplify GraphQL L3 construct aims to bring the best parts of creating AppSync APIs with the Amplify CLI together with the flexibility of the AWS CDK.

Over the past years, customers of all sizes have been able to quickly get their ideas from design to implementation via the flexibility of the Amplify GraphQL transformer:

```graphql
# Create all CRUD+L operations for a Blog, along with the relevant inputs, filters, and Subscriptions
type Blog @model @auth(rules: [{ allow: owner }]) {
	id: ID!
	title: String!
	content: String
}
```

When compared to creating an API with a full schema of `Queries`, `Mutations`, and `Subscriptions`, along with resolvers and DynamoDB tables, **the _Amplify CLI way_ results in ~80% code reduction**.

This however comes with a set of tradeoffs:

1. Not being able to fine-tune configuration options on the AppSync API such as logging to Cloudwatch and Xray tracing.
2. Not being able to write custom resolvers using JS functions
3. HTTP datasources being limited to publicly available APIs (no SigV4 support)

While it's possible to bypass some of those tradeoff using [Amplify's extensibility options](https://docs.amplify.aws/cli/custom/cdk/) to drop down into the CDK, the experience is different from what CDK developers expect.

> 💡 What if we could give CDK developers the GraphQL Transformer from Amplify, while keeping them in a normal CDK project?

And thus, this L3 construct was born.

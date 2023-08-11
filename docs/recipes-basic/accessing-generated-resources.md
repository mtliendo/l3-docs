---
sidebar_position: 1
---

# Access the AppSync API and Generated Table

There are times when you may need to drop down a level to perform some operation that is either new or not directly supported within the L3 construct.

This section provides several ways of accessing the underlying L1 and L2 AppSync API and DynamoDB constructs.

## AppSync

```ts
// access the L2 construct
amplifyApi.resources.graphqlApi.addDynamoDbDataSource()
```

![l3 to l2 appsync api](../img/l3-to-l2-appsync.png)

```ts
// access the L1 construct
amplifyApi.resources.cfnGraphqlApi.xrayEnabled = true
```

## DynamoDB

```ts
// access the L2 construct
amplifyApi.resources.tables['RecipeTable'].tableArn
```

![l3 to l2 appsync dynamodb](../img/l3-to-l2-dynamodb.png)

```ts
// access the L1 construct
amplifyApi.resources.cfnTables['RecipeTable'].attrArn
```

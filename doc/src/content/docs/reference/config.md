---
title: Config
description: A reference for the Config file.
---

## ignore

- **Type:** `string[]`
- **Default:** `[]`

The `ignore` option allows you to ignore specific collections from being processed.

```ts
{
  ignore: ["users"],
}
```

## adminEmail

- **Type:** `string`
- **Default:** `undefined`

`adminEmail` represents the email of an admin user of your PocketBase instance.

```ts
{
  adminEmail: "admin@mydomain.com",
}
```

## adminPassword

- **Type:** `string`
- **Default:** `undefined`
  
`adminPassword` represents the password of the above admin user of your PocketBase instance.

```ts
{
  adminPassword: "mypassword",
}
```

## nameEnum

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => snakeCase(enumFieldName).toUpperCase()`

`nameEnum` is a function that takes an enum field name and returns the name of the generated enum.

## nameEnumField

- **Type:** `(collectionName: string, fieldName: string) => string`
- **Default:** `(collectionName, fieldName) => collectionName + pascalName(fieldName)`
  
`nameEnumField` is a function that takes a field name and its collection name and returns the name of the generated enum field.

## nameEnumSchema

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`

`nameEnumSchema` is a function that takes an enum field name and returns the name of the generated enum schema.

## nameEnumType

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`

`nameEnumType` is a function that takes an enum field name and returns the name of the generated enum type.

## nameEnumValues

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => enumFieldName + "Values"`

`nameEnumValues` is a function that takes an enum field name and returns the name of the generated enum values.

## nameRecordSchema

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`

`nameRecordSchema` is a function that takes a collection name and returns the name of the generated record schema.

## nameRecordType

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`

`nameRecordType` is a function that takes a collection name and returns the name of the generated record type.

## output

- **Type:** `string`
- **Default:** `./zod-pocketbase.ts`

`output` represents the path of the generated file.

```ts
{
  output: "./src/lib/pocketbase/schemas.ts",
}
```

:::caution
`output` must be a relative path.
:::

## url

- **Type:** `string`
- **Default:** `undefined`

`url` represents the url of your PocketBase instance.

```ts
{
  url: "https://myproject.pockethost.io",
}
```

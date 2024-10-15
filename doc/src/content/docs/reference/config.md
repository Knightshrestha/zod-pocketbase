---
title: Config
description: A reference for the Config file.
---

## ignore

- **Type:** `string[]`
- **Default:** `[]`

The `ignore` option allows you to ignore specific collections from being processed.

## adminEmail

- **Type:** `string`
- **Default:** `undefined`

## adminPassword

- **Type:** `string`
- **Default:** `undefined`

## nameEnum

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => snakeCase(enumFieldName).toUpperCase()`

## nameEnumField

- **Type:** `(collectionName: string, fieldName: string) => string`
- **Default:** `(collectionName, fieldName) => collectionName + pascalName(fieldName)`

## nameEnumSchema

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`

## nameEnumType

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`
  
## nameEnumValues

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => enumFieldName + "Values"`

## nameRecordSchema

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`

## nameRecordType

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`

## output

- **Type:** `string`
- **Default:** `./zod-pocketbase.ts`

## url

- **Type:** `string`
- **Default:** `undefined`

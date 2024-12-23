---
title: Methods
description: A reference for the methods.
---

## helpersFrom

```ts
import { helpersFrom } from "zod-pocketbase";

const helpers = helpersFrom({ fetch, pocketbase });
```

The `helpersFrom` method returns an object with two methods: `getRecord` and `getRecords` described below.

### fetch

- **Type:** `(url: RequestInfo | URL, config?: RequestInit) => Promise<Response>`

Optional custom fetch function to use for sending the request.

### pocketbase

- **Required**
- **Type:** `TypedPocketbase`

The `pocketbase` parameter is a mandatory parameter that specifies a PocketBase instance.

## getRecord

```ts
const { getRecord } = helpersFrom({ pocketbase });
const record = await getRecord(reference, { schema });
```

The `getRecord` method returns a single record from your PocketBase instance.

### reference

- **Required**
- **Type:** [`RecordRef`](/reference/types#recordref)

### schema

- **Required**
- **Type:** [`AnyZodRecord`](/reference/types#anyzodrecord)

## getRecords

```ts
const { getRecords } = helpersFrom({ pocketbase });
const recordsList = await getRecords(collection, { filter, page, perPage, schema, skipTotal, sort });
```

The `getRecords` method returns a records list from your PocketBase instance.

### collection

- **Required**
- **Type:** `string`

### filter

- **Type:** `string`

### page

- **Type:** `number`
- **Default:** `1`
  
### perPage

- **Type:** `number`
- **Default:** `200`

### schema

- **Required**
- **Type:** [`AnyZodRecord`](/reference/types#anyzodrecord)
  
### skipTotal

- **Type:** `boolean`
- **Default:** `true`
  
### sort

- **Type:** [`ZodRecordSort`](/reference/types#zodrecordsort)

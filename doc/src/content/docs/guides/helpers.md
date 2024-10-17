---
title: Helpers
description: Helpers are syntactic sugar to get records from your PocketBase instance.
---

Helpers are syntactic sugar to get records from your PocketBase instance. In addition to simplifying the process of fetching records, they also provide type safety, autocompletion and caching.

To access helpers, you have to, at least, provide an instance of PocketBase SDK to the `helpersFrom` function.

```ts
import { helpersFrom } from "zod-pocketbase";
import Pocketbase from "pocketbase";

const { getRecord, getRecords } = helpersFrom({ 
  pocketbase: new Pocketbase(import.meta.env.ZOD_POCKETBASE_URL),
  cache:  "1d",
});
```

## getRecord

`getRecord` is a helper to get a single record from your PocketBase instance. It takes a [RecordRef](/reference/types#recordref) as its first argument and an object with a schema as its second argument.

```ts
const myFirstPost = await getRecord({ collection: "posts", slug: "my-first-post" }, { schema: PostRecord });
const mySecondPost = await getRecord({ collection: "posts", id: "3vwc4g9d23orc1r" }, { schema: PostRecord });
```

:::tip[For more details]
See the [reference](/reference/methods#getrecord).
:::

## getRecords

`getRecords` is a helper to get multiple records from your PocketBase instance. It takes a collection name as its first argument and an object with some options (at least a record schema) as its second argument.

```ts
const myPosts = await getRecords("posts", { schema: PostRecord });
const someSpecificPosts = await getRecords("posts", { schema: PostRecord, sort: "-updated", page: 2, perPage: 10 });
```

:::caution
The provided schema is only for a record. The method automatically adds `.array()`.
:::

:::tip[For more details]
See the [reference](/reference/methods#getrecords).
:::

---
title: Methods
description: A reference for the methods.
---

## helpersFrom

```ts
import { helpersFrom } from "zod-pocketbase";

const helpers = helpersFrom({ 
  // your parameters here...
});
```

The `helpersFrom` method returns an object with two methods: `getRecord` and `getRecords` described below.

### parameters

#### cache

- **Type:** `string`
- **Default:** `0s`

After this amount of time has passed, getRecord and getRecords will fetch new data from your PocketBase instance.

The `cache` parameter supports the following values:

- `s` is seconds (e.g. `cache: "43s"`)
- `m` is minutes (e.g. `cache: "2m"`)
- `h` is hours (e.g. `cache: "99h"`)
- `d` is days (The default is `cache: "1d"`)
- `w` is weeks, or shorthand for 7 days (e.g. `cache: 2w` is 14 days)
- `y` is years, or shorthand for 365 days (not exactly one year) (e.g. `cache: 2y` is 730 days)

Here are a few more values you can use:

- `cache: "*"` will never fetch new data (after the first success).
- `cache: "0s"` will always fetch new data.

#### pocketbase

- **Required**
- **Type:** `TypedPocketbase`
- **Default:** `undefined`

The `pocketbase` parameter is a mandatory parameter that specifies a PocketBase instance.

### getRecord

```ts
const { getRecord } = helpersFrom({ pocketbase });
const record = await getRecord({ collection: "posts", id: "123" }, { schema: PostRecord });
```

:::note
Coming soon...
:::

### getRecords

```ts
const { getRecords } = helpersFrom({ pocketbase });
const records = await getRecords("posts", { schema: PostRecord });
```

:::note
Coming soon...
:::

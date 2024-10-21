---
title: Why this library?
description: A guide in my new Starlight docs site.
---

You want to get the last 10 updated posts from your PocketBase collection. So you start with...

## The PocketBase SDK

```ts
import PocketBase from "pocketbase";
import { z } from "zod";

const pocketbase = new PocketBase("https://my-pocketbase.com");

const options = {
  sort: "-updated"
};

const { items: firstPosts } = await pocketbase.collection("posts").getList(1, 10, options);
```

Oops, you forgot to expand the `author` field because you don't want the author id but the author name. So you...

## Expand

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";

const pocketbase = new PocketBase("https://my-pocketbase.com");

const options = {
  sort: "-updated", 
+  expand: ["author"],
};

const { items: firstPosts } = await pocketbase.collection("posts").getList(1, 10, options);
```

Great, but now you want to validate the data you get from PocketBase because the rule is that you should not trust anything for the outer world.
You also just include the fields that you really need for your app and remove the ugly `expand` properties. So you add...

## A Zod Schema

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";

const pocketbase = new PocketBase("https://my-pocketbase.com");

+ const Post = z
+   .object({
+     content: z.string(),
+     expand: z.object({
+       author: z.object({
+         name: z.string(),
+       }),
+     }),
+     title: z.string(),
+   })
+   .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));

const options = {
  sort: "-updated", 
  expand: ["author"],
};

const { items } = await pocketbase.collection("posts").getList(1, 10, options);
+ const firstPosts = Post.array().parse(items);
```

Better, but even if you get your validated structured data now, you could reduce the size of the response from the server by adding...

## Fields

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";

const pocketbase = new PocketBase("https://my-pocketbase.com");

const Post = z
  .object({
    content: z.string(),
    expand: z.object({
      author: z.object({
        name: z.string(),
      }),
    }),
    title: z.string(),
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));

const options = {
  sort: "-updated", 
  expand: ["author"],
+  fields: ["content", "expand.author.name", "title"],
};

const { items } = await pocketbase.collection("posts").getList(1, 10, options);
const firstPosts = Post.array().parse(items);
```

Cool! So what would you need Zod PocketBase for?

## Generated Schemas

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";
+ import { pick, select } from "zod-pocketbase";
+ import { AuthorRecord, PostRecord } from "./schemas";

const pocketbase = new PocketBase("https://my-pocketbase.com");

- const Post = z
-   .object({
-     content: z.string(),
-     expand: z.object({
-       author: z.object({
-         name: z.string(),
-       }),
-     }),
-     title: z.string(),
-   })
-   .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));

+ const Post = PostRecord.pick({content: true, title: true }).extend({
+   expand: z.object({
+     author: AuthorRecord.pick({ name: true })
+   }),
+ }).transform(({ expand, ...rest }) => ({ ...rest, ...expand }));

/* Or, for the syntactic sugar addicts */
+ const Post = select(PostRecord, ["content", "title"], {
+   author: select(AuthorRecord, ["name"])
+ });

const options = {
  sort: "-updated", 
  expand: ["author"],
  fields: ["content", "expand.author.name", "title"],
};

const { items } = await pocketbase.collection("posts").getList(1, 10, options);
const firstPosts = Post.array().parse(items);
```

## Type-safe expand and fields options

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";
import { select } from "zod-pocketbase";
+ import { expandFrom, fieldsFrom, listOptionsFrom } from "zod-pocketbase";
import { AuthorRecord, PostRecord } from "./schemas";

const pocketbase = new PocketBase("https://my-pocketbase.com");

const Post = select(PostRecord, ["content", "title"], {
  author: select(AuthorRecord, ["name"])
});

const options = {
  sort: "-updated", 
-  expand: ["author"],
+  expand: expandFrom(Post),
-  fields: ["content", "expand.author.name", "title"],
+  fields: fieldsFrom(Post),
};

/* Or, for the syntactic sugar addicts */
+ const options = listOptionsFrom(Post, { sort: "-updated" });

const { items } = await pocketbase.collection("posts").getList(1, 10, options);
const firstPosts = Post.array().parse(items);
```

## More sugar with helpers

```diff lang="ts"
import PocketBase from "pocketbase";
import { z } from "zod";
import { select } from "zod-pocketbase";
+ import { helpersFrom } from "zod-pocketbase";
import { AuthorRecord, PostRecord } from "./schemas";

const pocketbase = new PocketBase("https://my-pocketbase.com");
+ const { getRecords } = helpersFrom({ pocketbase });

const Post = select(PostRecord, ["content", "title"], {
  author: select(AuthorRecord, ["name"])
});

- const options = optionsFrom(Post, { sort: "-updated" });
+ const options = { perPage: 10, schema: Post, sort: "-updated" };

- const { items } = await pocketbase.collection("posts").getList(1, 10, options);
- const firstPosts = Post.array().parse(items);
+ const { items: firstPosts } = getRecords("posts", options);
```

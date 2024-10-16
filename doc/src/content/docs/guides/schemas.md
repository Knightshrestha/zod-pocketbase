---
title: Schemas
description: How to secure and simplify schemas for your PocketBase instance.
---

Here you can find how to secure and simplify schemas for your PocketBase instance:

1. with the CLI generated schemas
2. with the `expand` method
3. with the `pick` method  
4. with the `select` method

## 0 - A Zod schema for a Post collection

Here is the original schema for a `Post` collection:

```ts
const Post = z
  .object({
    content: z.string(),
    expand: z.object({
      author: z
        .object({
          name: z.string(),
          expand: z.object({
            image: z.object({
              alt: z.string(),
              src: z.string(),
            }),
          }),
        })
        .transform(({ expand, ...rest }) => ({ ...rest, ...expand })),
      image: z.object({
        alt: z.string(),
        src: z.string(),
      }),
    }),
    title: z.string(),
    updated: z.coerce.date(),
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));
```

## 1 - With CLI generated schema

All schemas are generated from your PocketBase.

```ts
import {AuthorRecord, ImageRecord, PostRecord} from "./schemas";

const Post = PostRecord.pick({ content: true, title: true, updated: true })
  .extend({
    expand: z.object({
      author: AuthorRecord.pick({ name: true })
        .extend({
          expand: z.object({
            image: ImageRecord.pick({ alt: true, src: true }),
          }),
        })
        .transform(({ expand, ...rest }) => ({ ...rest, ...expand })),
      image: ImageRecord.pick({ alt: true, src: true }),
    }),
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));
```

## 2 - With pick

`pick` is a syntactic sugar for native zod `pick`.

```ts
import { pick } from "zod-pocketbase";
import {AuthorRecord, ImageRecord, PostRecord} from "./schemas";

const Post = pick(PostRecord, ["content", "title", "updated"])
  .extend({
    expand: z.object({
      author: pick(AuthorRecord, ["name"])
        .extend({
          expand: z.object({
            image: pick(ImageRecord, ["alt", "src"]),
          }),
        })
        .transform(({ expand, ...rest }) => ({ ...rest, ...expand })),
      image: pick(ImageRecord, ["alt", "src"]),
    }),
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));
```

## 3 - With expand

`expand` is a syntactic sugar for native zod `extend` on the property `expand` coupled with `transform`.

```ts
import { expand, pick } from "zod-pocketbase";
import {AuthorRecord, ImageRecord, PostRecord} from "./schemas";

const Post = expand(pick(PostRecord, ["content", "title", "updated"]), {
  author: expand(pick(AuthorRecord, ["name"]), {
    image: pick(ImageRecord, ["alt", "src"])
  }),
  image: pick(ImageRecord, ["alt", "src"])
});
```

## 4 - With select

`select` is the union of `pick` and `expand`.

```ts
import { select } from "zod-pocketbase";
import {AuthorRecord, ImageRecord, PostRecord} from "./schemas";

const Post = select(PostRecord, ["content", "title", "updated"], {
  author: select(AuthorRecord, ["name"], {
    image: select(ImageRecord, ["alt", "src"])
  }),
  image: select(ImageRecord, ["alt", "src"])
});
```

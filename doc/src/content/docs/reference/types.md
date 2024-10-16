---
title: Types
description: A reference for the types.
---

## RecordIdRef

`RecordIdRef` represents a reference to a record in a collection by its `id` and its `collection` name.

```ts
type RecordIdRef<C extends string> = { collection: C; id: string };
```

## RecordSlugRef

`RecordSlugRef` represents a reference to a record in a collection by its `slug` and its `collection` name.

```ts
type RecordSlugRef<C extends string> = { collection: C; slug: string };
```

:::tip[What is slug?]
`slug` is not a default field of a collection but it can be used as another unique identifier for a record more readble than its `id`.
:::

## RecordRef

`RecordRef` represents either a `RecordIdRef` or a `RecordSlugRef`.

```ts
type RecordRef<C extends string> = RecordIdRef<C> | RecordSlugRef<C>;
```

## RecordFullListOpts

```ts
type RecordFullListOpts<S extends AnyZodRecord> = RecordListOpts<S> & { batch?: number };
```

## RecordListOpts

```ts
type RecordListOpts<S extends AnyZodRecord> = {
  filter?: string;
  page?: number;
  perPage?: number;
  skipTotal?: boolean;
  sort?: ZodRecordSort<S>;
};
```

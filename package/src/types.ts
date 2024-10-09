import type { AnyZodObject, ZodEffects, ZodOptional, ZodRawShape, ZodTypeAny } from "zod";

export type AnyZodRecord = AnyZodObject | ZodEffects<AnyZodObject>;

export type RecordFullListOpts<S extends AnyZodRecord> = RecordListOpts<S> & { batch?: number };

export type RecordListOpts<S extends AnyZodRecord> = {
  filter?: string;
  page?: number;
  perPage?: number;
  skipTotal?: boolean;
  sort?: ZodRecordSort<S>;
};

export type RecordIdRef<C extends string> = { collection: C; id: string };
export type RecordSlugRef<C extends string> = { collection: C; slug: string };
export type RecordRef<C extends string> = RecordIdRef<C> | RecordSlugRef<C>;

export type ZodRecordKeys<S extends AnyZodRecord> = Extract<keyof S["_input"], string>;

export type ZodRecordMainKeys<S extends AnyZodRecord> = Exclude<ZodRecordKeys<S>, "expand">;

export type ZodRecordSort<S extends AnyZodRecord> = `${"+" | "-"}${ZodRecordMainKeys<S>}` | "@random";

type RequiredKeysOf<S extends ZodRawShape> = Exclude<
  {
    [Key in keyof S]: S[Key] extends ZodOptional<ZodTypeAny> ? never : Key;
  }[keyof S],
  undefined
>;
export type HasRequiredKeys<S extends ZodRawShape> = RequiredKeysOf<S> extends never ? false : true;

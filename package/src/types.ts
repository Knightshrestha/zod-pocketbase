import type { AnyZodObject, ZodEffects } from "zod";

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

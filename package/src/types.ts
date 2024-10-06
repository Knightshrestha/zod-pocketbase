import type Pocketbase from "pocketbase";
import type { AnyZodObject, objectUtil, ZodEffects, ZodObject, ZodRawShape } from "zod";

export type AnyZodRecord = AnyZodObject | ZodEffects<AnyZodObject>;

export type GetHelpersOpts = { pocketbase: Pocketbase };

export type GetRecordOpts<S extends AnyZodRecord> = { schema: S };

export type GetRecordsOpts<S extends AnyZodRecord> = RecordFullListOpts<S> & { schema: S };

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

export type ZodObjectExpand<S extends AnyZodObject, E extends ZodRawShape> =
  S extends ZodObject<infer T, infer U, infer C>
    ? ZodEffects<
        ZodObject<objectUtil.extendShape<T, { expand: ZodObject<E> }>, U, C>,
        ZodObject<objectUtil.extendShape<T, E>, U, C>["_output"]
      >
    : never;

export type ZodObjectPick<S extends AnyZodObject, K extends ZodRecordKeys<S>[]> =
  S extends ZodObject<infer T, infer U, infer C> ? ZodObject<Pick<T, K[number]>, U, C> : never;

export type ZodRecordKeys<S extends AnyZodRecord> = Extract<keyof S["_input"], string>;

export type ZodRecordMainKeys<S extends AnyZodRecord> = Exclude<ZodRecordKeys<S>, "expand">;

export type ZodRecordSort<S extends AnyZodRecord> = `${"+" | "-"}${ZodRecordMainKeys<S>}` | "@random";

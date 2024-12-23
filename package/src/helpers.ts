import type { default as Pocketbase, SendOptions } from "pocketbase";
import { fullListOptionsFrom, optionsFrom } from "./options.js";
import type { AnyZodRecord, RecordFullListOpts, RecordIdRef, RecordRef, RecordSlugRef } from "./types.ts";
import { AnyRecordsList, type RecordsList } from "./schemas.ts";

export function helpersFrom({ fetch, pocketbase }: HelpersFromOpts) {
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordSlugRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordIdRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordRef<C>, opts: GetRecordOpts<S>) {
    const { schema } = opts;
    const sdkOpts = { ...optionsFrom(schema), ...(fetch ? { fetch } : {}) };
    const unsafeRecord = await ("id" in ref
      ? pocketbase.collection(ref.collection).getOne(ref.id, sdkOpts)
      : pocketbase.collection(ref.collection).getFirstListItem(`slug = "${ref.slug}"`, sdkOpts));
    return schema.parseAsync(unsafeRecord);
  }

  async function getRecords<C extends string, S extends AnyZodRecord>(collection: C, opts: GetRecordsOpts<S>): Promise<RecordsList<S>> {
    const { schema, ...otherOpts } = opts;
    const sdkOpts = { ...fullListOptionsFrom(schema, otherOpts), ...(fetch ? { fetch } : {}) };
    const recordsList = await pocketbase.collection(collection).getList(sdkOpts.page, sdkOpts.perPage, sdkOpts);
    return AnyRecordsList.extend({ items: schema.array() }).parseAsync(recordsList);
  }

  return { getRecord, getRecords };
}
export type GetRecordOpts<S extends AnyZodRecord> = { schema: S };
export type GetRecordsOpts<S extends AnyZodRecord> = RecordFullListOpts<S> & { schema: S };
export type HelpersFromOpts = { fetch?: SendOptions["fetch"]; pocketbase: Pocketbase };

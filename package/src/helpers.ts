import type Pocketbase from "pocketbase";
import { fullListOptionsFrom, optionsFrom } from "./options.js";
import type { AnyZodRecord, RecordFullListOpts, RecordIdRef, RecordRef, RecordSlugRef } from "./types.ts";

export function helpersFrom({ pocketbase }: HelpersFromOpts) {
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordSlugRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordIdRef<C>, opts: GetRecordOpts<S>): Promise<S["_output"]>;
  async function getRecord<C extends string, S extends AnyZodRecord>(ref: RecordRef<C>, opts: GetRecordOpts<S>) {
    const { schema } = opts;
    const record = await ("id" in ref
      ? pocketbase.collection(ref.collection).getOne(ref.id, optionsFrom(schema))
      : pocketbase.collection(ref.collection).getFirstListItem(`slug = "${ref.slug}"`, optionsFrom(schema)));
    return schema.parseAsync(record);
  }

  async function getRecords<C extends string, S extends AnyZodRecord>(collection: C, opts: GetRecordsOpts<S>): Promise<S["_output"][]> {
    const { schema, page = 1, perPage = 30, ...otherOpts } = opts;
    const records = await pocketbase.collection(collection).getFullList(fullListOptionsFrom(schema, otherOpts));
    return schema.array().parseAsync(records);
  }

  return { getRecord, getRecords };
}

export type GetRecordOpts<S extends AnyZodRecord> = { schema: S };

export type GetRecordsOpts<S extends AnyZodRecord> = RecordFullListOpts<S> & { schema: S };

export type HelpersFromOpts = { pocketbase: Pocketbase };

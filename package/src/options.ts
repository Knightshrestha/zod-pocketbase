import { z, type AnyZodObject, type ZodTypeAny } from "zod";
import type { AnyZodRecord, RecordFullListOpts, RecordListOpts } from "./types.ts";

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function expandFrom<S extends AnyZodRecord>(schema: S) {
  return expandFromRec(schema)
    .sort((k1, k2) => (k1 < k2 ? -1 : 1))
    .join(",");
}

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function fieldsFrom<S extends AnyZodRecord>(schema: S) {
  return fieldsFromRec(schema)
    .sort((k1, k2) => (k1 < k2 ? -1 : 1))
    .join(",");
}

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function optionsFrom<S extends AnyZodRecord>(schema: S) {
  return { expand: expandFrom(schema), fields: fieldsFrom(schema) };
}

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function listOptionsFrom<S extends AnyZodRecord>(schema: S, opts: RecordListOpts<S>) {
  return { ...optionsFrom(schema), ...opts };
}

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function fullListOptionsFrom<S extends AnyZodRecord>(schema: S, opts: RecordFullListOpts<S>) {
  return { ...optionsFrom(schema), ...opts };
}

function expandFromRec<S extends ZodTypeAny>(schema: S, prefix = "") {
  let expands: string[] = [];
  const shape = getObjectSchemaDescendant(schema)?.shape;
  if (!shape || !("expand" in shape)) return [];
  for (const [key, value] of Object.entries(getObjectSchemaDescendant(shape.expand)!.shape)) {
    expands = [...expands, `${prefix}${key}`];
    if (hasObjectSchemaDescendant(value)) expands = [...expands, ...expandFromRec(getObjectSchemaDescendant(value)!, `${prefix}${key}.`)];
  }
  return expands;
}

function fieldsFromRec<S extends z.ZodTypeAny>(schema: S, prefix = "") {
  let fields: string[] = [];
  const shape = getObjectSchemaDescendant(schema)?.shape;
  if (!shape) return [];
  for (const [key, value] of Object.entries(shape)) {
    fields = [
      ...fields,
      ...(hasObjectSchemaDescendant(value) ? fieldsFromRec(getObjectSchemaDescendant(value)!, `${prefix}${key}.`) : [`${prefix}${key}`]),
    ];
  }
  return fields.sort((k1, k2) => (k1 < k2 ? -1 : 1));
}

function hasObjectSchemaDescendant(value: unknown): value is z.ZodTypeAny {
  if (value instanceof z.ZodEffects) return hasObjectSchemaDescendant(value.innerType());
  if (value instanceof z.ZodArray) return hasObjectSchemaDescendant(value.element);
  if (value instanceof z.ZodOptional) return hasObjectSchemaDescendant(value.unwrap());
  return value instanceof z.ZodObject;
}

function getObjectSchemaDescendant<S extends z.ZodTypeAny>(schema: S): AnyZodObject | undefined {
  if (schema instanceof z.ZodEffects) return getObjectSchemaDescendant(schema.innerType());
  if (schema instanceof z.ZodArray) return getObjectSchemaDescendant(schema.element);
  if (schema instanceof z.ZodOptional) return getObjectSchemaDescendant(schema.unwrap());
  if (schema instanceof z.ZodObject) return schema;
  return;
}

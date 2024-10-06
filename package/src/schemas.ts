import { type AnyZodObject, z, type ZodRawShape } from "zod";
import type { ZodObjectExpand, ZodObjectPick, ZodRecordKeys } from "./types.ts";

/**
 * Extends the given schema with the given expansion.
 * @param schema - The original schema
 * @param shape - The shape of the expansion
 * @returns A new schema extended with the given expansion
 */
export function expand<S extends AnyZodObject, E extends ZodRawShape>(schema: S, shape: E) {
  return z
    .object({ ...schema.shape, expand: z.object(shape) })
    .transform(({ expand, ...rest }) => ({ ...rest, ...expand })) as ZodObjectExpand<S, E>;
}

/**
 * Picks the given keys from the given schema.
 * @param schema - The original schema
 * @param keys - The keys to keep
 * @returns A new schema with only the given keys
 */
export function pick<S extends AnyZodObject, K extends ZodRecordKeys<S>[]>(schema: S, keys: K) {
  return schema.pick(Object.fromEntries(keys.map((key) => [key, true]))) as ZodObjectPick<S, K>;
}

/**
 * Picks the given keys from the given schema and extends it with the given expansion.
 * @param schema - The original schema
 * @param keys - The keys to keep
 * @param shape - The shape of the expansion
 * @returns A new schema with only the given keys
 */
export function select<S extends AnyZodObject, K extends ZodRecordKeys<S>[], E extends ZodRawShape>(
  schema: S,
  keys: K,
  shape: E,
): ZodObjectExpand<ZodObjectPick<S, K>, E>;
export function select<S extends AnyZodObject, K extends ZodRecordKeys<S>[]>(schema: S, keys: K): ZodObjectPick<S, K>;
export function select<S extends AnyZodObject, K extends ZodRecordKeys<S>[], E extends ZodRawShape | undefined>(
  schema: S,
  keys: K,
  shape?: E,
) {
  return shape ? expand(pick(schema, keys), shape) : pick(schema, keys);
}

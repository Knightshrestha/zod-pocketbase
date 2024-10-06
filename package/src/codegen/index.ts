import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pascalCase, snakeCase, sortBy } from "es-toolkit";
import type { CollectionModel } from "pocketbase";
import { z } from "zod";
import { stringifyContent } from "./content.js";
import { getPocketbase } from "./sdk.js";

export async function generate(opts: GenerateOpts) {
  const collections = await fetchSortedCollections(opts);
  const stub = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../assets/stubs/index.ts"), "utf-8");
  const { collectionNames, enums, records, services } = stringifyContent(collections, opts);
  const content = stub
    .replace("@@_COLLECTION_NAMES_@@", collectionNames)
    .replace("@@_ENUMS_@@", enums)
    .replace("@@_RECORDS_@@", records)
    .replace("@@_SERVICES_@@", services);
  mkdirSync(dirname(opts.out), { recursive: true });
  writeFileSync(opts.out, content);
}

export const generateDefaultOpts = {
  ignore: [],
  nameEnum: (name: string) => snakeCase(name).toUpperCase(),
  nameEnumField: (collectionName: string, fieldName: string) => `${collectionName}${pascalCase(fieldName)}`,
  nameEnumSchema: (name: string) => pascalCase(name),
  nameEnumType: (name: string) => pascalCase(name),
  nameEnumValues: (name: string) => `${name}Values`,
  nameRecordSchema: (name: string) => `${pascalCase(name)}Record`,
  nameRecordType: (name: string) => `${pascalCase(name)}Record`,
  out: "zod-pocketbase.ts",
};

export const GenerateOpts = z.object({
  adminEmail: z.string().email(),
  adminPassword: z.string(),
  ignore: z.string().array().default(generateDefaultOpts.ignore),
  nameEnum: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameEnum),
  nameEnumField: z
    .function(z.tuple([z.string(), z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameEnumField),
  nameEnumSchema: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameEnumSchema),
  nameEnumType: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameEnumType),
  nameEnumValues: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameEnumValues),
  nameRecordSchema: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameRecordSchema),
  nameRecordType: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? generateDefaultOpts.nameRecordType),
  out: z.string().default(generateDefaultOpts.out),
  url: z.string().url(),
});
export type GenerateOpts = z.infer<typeof GenerateOpts>;

async function fetchSortedCollections(opts: GenerateOpts): Promise<CollectionModel[]> {
  const pocketbase = await getPocketbase(opts);
  const collections = await pocketbase.collections.getFullList();
  return sortBy(
    collections.filter(({ name }) => !opts.ignore.includes(name)),
    ["name"],
  );
}

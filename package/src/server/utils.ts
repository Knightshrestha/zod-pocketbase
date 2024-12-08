import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionModel } from "pocketbase";
import { stringifyContent } from "../content.js";
import type { ResolvedConfig } from "../config.ts";

export async function generate(collections: CollectionModel[], opts: GenerateOpts) {
  const stub = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../assets/stubs/index.ts"), "utf-8");
  const { collectionNames, enums, records, services } = stringifyContent(collections, opts);
  const content = stub
    .replace("@@_COLLECTION_NAMES_@@", collectionNames)
    .replace("@@_ENUMS_@@", enums)
    .replace("@@_RECORDS_@@", records)
    .replace("@@_SERVICES_@@", services);
  mkdirSync(dirname(opts.output), { recursive: true });
  writeFileSync(opts.output, content);
}
export type GenerateOpts = Omit<ResolvedConfig, "adminEmail" | "adminPassword" | "ignore" | "url">;

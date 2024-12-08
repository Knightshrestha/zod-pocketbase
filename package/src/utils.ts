import { sortBy } from "es-toolkit";
import type { CollectionModel } from "pocketbase";
import { getPocketbase } from "./sdk.js";
import type { Credentials } from "./config.ts";

export async function fetchCollections(credentials: Credentials): Promise<CollectionModel[]> {
  const pocketbase = await getPocketbase(credentials);
  const collections = await pocketbase.collections.getFullList();
  return sortBy(collections, ["name"]);
}

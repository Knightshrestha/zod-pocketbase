import Pocketbase from "pocketbase";
import type { GenerateOpts } from "./index.ts";

let pocketbase: Pocketbase;

export async function getPocketbase({ adminEmail, adminPassword, url }: Pick<GenerateOpts, "adminEmail" | "adminPassword" | "url">) {
  if (!pocketbase) {
    pocketbase = new Pocketbase(url);
    await pocketbase.admins.authWithPassword(adminEmail, adminPassword);
  }
  return pocketbase;
}

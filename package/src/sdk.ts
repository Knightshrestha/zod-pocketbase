import Pocketbase from "pocketbase";
import type { Credentials } from "./config.ts";

let adminPocketbase: Pocketbase;

export async function getPocketbase({ adminEmail, adminPassword, url }: Credentials) {
  if (!adminPocketbase) {
    const pocketbase = new Pocketbase(url);
    await pocketbase.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    adminPocketbase = pocketbase;
  }
  return adminPocketbase;
}

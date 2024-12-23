import type { helpersFrom } from "zod-pocketbase";

declare global {
  declare namespace App {
    interface Locals {
      getRecord: ReturnType<typeof helpersFrom>["getRecord"];
      getRecords: ReturnType<typeof helpersFrom>["getRecords"];
    }
  }
}

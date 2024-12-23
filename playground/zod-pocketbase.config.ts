import { pascalCase } from "es-toolkit";
import type { Config } from "zod-pocketbase";

export default {
  ignore: ["users"],
  nameRecordSchema: (name: string) => `z${pascalCase(name)}Record`,
  output: "./src/lib/pocketbase.ts",
} satisfies Config;

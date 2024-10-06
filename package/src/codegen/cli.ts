#!/usr/bin/env node

import { program } from "commander";
import { generate, GenerateOpts } from "./index.js";
import { version } from "../../package.json";
import "dotenv/config";

program
  .name("Zod Pocketbase")
  .version(version)
  .description("Generate Zod schemas for your pocketbase instance.")
  .option("-u, --url <char>", "URL to your hosted pocketbase instance.", process.env.ZOD_POCKETBASE_URL)
  .option("-e, --admin-email <char>", "email for an admin pocketbase user.", process.env.ZOD_POCKETBASE_ADMIN_EMAIL)
  .option("-p, --admin-password <char>", "password for an admin pocketbase user.", process.env.ZOD_POCKETBASE_ADMIN_PASSWORD)
  .option("-i, --ignore [value...]", "collections to ignore.", [])
  .option("-o, --out <char>", "path to save the typescript output file", "zod-pocketbase.ts");

program.parse();

const options = GenerateOpts.parse(program.opts());

generate(options);

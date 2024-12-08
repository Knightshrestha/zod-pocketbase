#!/usr/bin/env node

import { Config, type ResolvedConfig } from "../config.ts";
import pkg from "../../package.json" assert { type: "json" };
import { loadConfig } from "c12";
import { defineCommand, runMain } from "citty";
import { cancel, group, intro, log, outro, confirm, text, spinner, multiselect, isCancel } from "@clack/prompts";
import { fetchCollections } from "../utils.ts";
import { generate } from "./utils.ts";
import { existsSync } from "node:fs";

async function getConfig() {
  const { config } = await loadConfig({ name: "zod-pocketbase", rcFile: false, dotenv: true });
  const { ZOD_POCKETBASE_ADMIN_EMAIL: adminEmail, ZOD_POCKETBASE_ADMIN_PASSWORD: adminPassword, ZOD_POCKETBASE_URL: url } = process.env;
  const result = Config.safeParse({ ...config, adminEmail, adminPassword, url });
  if (!result.success) {
    log.error("Invalid fields in your config file.");
    onCancel();
  }
  return result.data!;
}

function onCancel() {
  cancel("Operation cancelled.");
  process.exit(0);
}

async function selectCollections(config: ResolvedConfig) {
  const credentialPrompts = {
    url: () => text({ message: "What is the url of your pocketbase instance?", initialValue: config.url ?? "" }),
    adminEmail: () => text({ message: "What is your admin's email?", initialValue: config.adminEmail ?? "" }),
    adminPassword: () => text({ message: "What is your admin's password?", initialValue: config.adminPassword ?? "" }),
  };
  const credentials = await group(credentialPrompts, { onCancel });
  const s = spinner();
  s.start("Fetching collections...");
  try {
    const allCollections = await fetchCollections(credentials);
    s.stop("Successfully fetched collections.");
    const collectionNames = await multiselect({
      message: "What collections do you want to generate schemas for?",
      options: allCollections.map(({ name: value }) => ({ value })),
      initialValues: allCollections.filter(({ name }) => !config.ignore.includes(name)).map(({ name }) => name),
    });
    if (isCancel(collectionNames)) onCancel();
    return allCollections.filter(({ name }) => (collectionNames as string[]).includes(name));
  } catch {
    s.stop("Failed to fetch collections.Please check your credentials and try again.");
    return selectCollections(config);
  }
}

async function setGeneratedFilePath(config: ResolvedConfig) {
  const output = await text({
    message: "What is the generated file path?",
    initialValue: config.output,
    validate: (value) => {
      if (!value) return "Please enter a path.";
      if (value[0] !== ".") return "Please enter a relative path.";
      return;
    },
  });
  if (isCancel(output)) onCancel();

  if (existsSync(output as string)) {
    const confirmed = await confirm({ message: "The file already exists, would you like to overwrite it?" });
    if (isCancel(confirmed)) onCancel();
    if (!confirmed) return setGeneratedFilePath(config);
  }

  return output as string;
}

const main = defineCommand({
  meta: { name: "zod-pocketbase", version: pkg.version, description: "Generate Zod schemas for your pocketbase instance." },
  run: async () => {
    intro(`ZOD POCKETBASE`);
    const config = await getConfig();
    const collections = await selectCollections(config);
    const output = await setGeneratedFilePath(config);

    const s = spinner();
    s.start("Generating your schemas...");
    await generate(collections, { ...config, output });
    s.stop("Schemas successfully generated.");

    outro("Operation completed.");
  },
});

runMain(main);

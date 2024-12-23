// @ts-check
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      ZOD_POCKETBASE_URL: envField.string({ context: "server", access: "public" }),
    },
  },
});

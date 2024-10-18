// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Zod PocketBase",
      social: {
        github: "https://github.com/gbouteiller/zod-pocketbase",
      },
      sidebar: [
        {
          label: "Start here",
          autogenerate: { directory: "start-here" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});

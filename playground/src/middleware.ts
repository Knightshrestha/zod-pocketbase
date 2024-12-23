// @ts-ignore
import Fetch from "@11ty/eleventy-fetch";
import { defineMiddleware } from "astro:middleware";
import { ZOD_POCKETBASE_URL } from "astro:env/server";
import Pocketbase from "pocketbase";
import { helpersFrom } from "zod-pocketbase";

export const onRequest = defineMiddleware((context, next) => {
  const { getRecord, getRecords } = helpersFrom({
    pocketbase: new Pocketbase(ZOD_POCKETBASE_URL),
    fetch: import.meta.env.DEV
      ? async (url, fetchOptions) => {
          const { body, ...init } = await Fetch(url, { fetchOptions, returnType: "response", type: "json" });
          return new Response(JSON.stringify(body), init);
        }
      : undefined,
  });
  context.locals.getRecord = getRecord;
  context.locals.getRecords = getRecords;
  return next();
});

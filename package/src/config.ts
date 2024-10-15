import { pascalCase, snakeCase } from "es-toolkit";
import { z } from "zod";

export const defaultConfig = {
  ignore: [],
  nameEnum: (name: string) => snakeCase(name).toUpperCase(),
  nameEnumField: (collectionName: string, fieldName: string) => `${collectionName}${pascalCase(fieldName)}`,
  nameEnumSchema: (name: string) => pascalCase(name),
  nameEnumType: (name: string) => pascalCase(name),
  nameEnumValues: (name: string) => `${name}Values`,
  nameRecordSchema: (name: string) => `${pascalCase(name)}Record`,
  nameRecordType: (name: string) => `${pascalCase(name)}Record`,
  output: "./zod-pocketbase.ts",
};

export const Credentials = z.object({
  adminEmail: z.string().email(),
  adminPassword: z.string(),
  url: z.string().url(),
});
export type Credentials = z.infer<typeof Credentials>;

export const Config = z.object({
  ...Credentials.partial().shape,
  ignore: z.string().array().default(defaultConfig.ignore),
  nameEnum: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameEnum),
  nameEnumField: z
    .function(z.tuple([z.string(), z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameEnumField),
  nameEnumSchema: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameEnumSchema),
  nameEnumType: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameEnumType),
  nameEnumValues: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameEnumValues),
  nameRecordSchema: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameRecordSchema),
  nameRecordType: z
    .function(z.tuple([z.string()]), z.string())
    .optional()
    .transform((f) => f ?? defaultConfig.nameRecordType),
  output: z.string().default(defaultConfig.output),
});
export type Config = z.input<typeof Config>;
export type ResolvedConfig = z.infer<typeof Config>;

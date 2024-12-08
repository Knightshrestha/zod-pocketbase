import { sortBy } from "es-toolkit";
import type { CollectionModel, SchemaField } from "pocketbase";
import type { GenerateOpts } from "./server/utils.ts";

export function stringifyContent(collections: CollectionModel[], opts: GenerateOpts) {
  function getCollectionSelectFields() {
    return collections.flatMap((collection) =>
      collection.schema
        .filter((field) => field.type === "select")
        .map((field) => ({ name: opts.nameEnumField(collection.name, field.name), values: (field.options.values ?? []) as string[] })),
    );
  }

  function stringifyEnum({ name, values }: SelectField) {
    const valuesName = opts.nameEnumValues(name);
    const schemaName = opts.nameEnumSchema(name);
    const enumName = opts.nameEnum(name);
    const typeName = opts.nameEnumType(name);
    return `export const ${valuesName} = [\n\t${values.map((value) => `"${value}"`).join(",\n\t")},\n] as const;\nexport const ${schemaName} = z.enum(${valuesName});\nexport type ${typeName} = z.infer<typeof ${schemaName}>;\nexport const ${enumName} = ${schemaName}.enum;`;
  }

  function stringifyRecord({ name, schema }: CollectionModel) {
    const schemaName = opts.nameRecordSchema(name);
    const typeName = opts.nameRecordType(name);
    const fields = sortBy(schema, ["name"]).map((field) => stringifyField(field, name));
    return `export const ${schemaName} = z.object({\n\t...RecordModel.omit({ expand: true }).shape,\n\tcollectionName: z.literal("${name}"),\n\t${fields.join(",\n\t")},\n});\nexport type ${typeName} = z.infer<typeof ${schemaName}>;`;
  }

  function stringifyField(field: SchemaField, collectionName: string) {
    let schema: string | undefined;
    if (field.type === "bool") schema = stringifyBoolField(field);
    else if (field.type === "date") schema = stringifyDateField(field);
    else if (field.type === "editor") schema = stringifyEditorField(field);
    else if (field.type === "email") schema = stringifyEmailField(field);
    else if (field.type === "file") schema = stringifyFileField(field);
    else if (field.type === "json") schema = stringifyJsonField(field);
    else if (field.type === "number") schema = stringifyNumberField(field);
    else if (field.type === "relation") schema = stringifyRelationField(field);
    else if (field.type === "select") schema = stringifySelectField(field, collectionName);
    else if (field.type === "text") schema = stringifyTextField(field);
    else if (field.type === "url") schema = stringifyUrlField(field);
    // TODO: manage unknown field type
    return `${field.name}: ${schema}${field.required ? "" : ".optional()"}`;
  }

  function stringifyBoolField(_: SchemaField) {
    return "z.boolean()";
  }

  function stringifyDateField(_field: SchemaField) {
    // TODO: implement min and max
    return "z.string().pipe(z.coerce.date())";
  }

  function stringifyEditorField(_field: SchemaField) {
    // TODO: implement convertUrls
    return "z.string()";
  }

  function stringifyEmailField(_field: SchemaField) {
    // TODO: implement exceptDomains and onlyDomains
    return "z.string().email()";
  }

  function stringifyFileField({ options: { maxSelect } }: SchemaField) {
    // TODO: implement maxSize, mimeTypes, protected, thumbs
    return `z.string()${maxSelect === 1 ? "" : `.array().max(${maxSelect})`}`;
  }

  function stringifyJsonField(_field: SchemaField) {
    // TODO: implement maxSize and json schema
    return "z.any()";
  }

  function stringifyNumberField({ options: { max, min, noDecimal } }: SchemaField) {
    return `z.number()${noDecimal ? ".int()" : ""}${min ? `.min(${min})` : ""}${max ? `.max(${max})` : ""}`;
  }

  function stringifyRelationField({ options, required }: SchemaField) {
    const { maxSelect, minSelect } = options;
    // TODO: implement cascadeDelete, displayFields
    const min = minSelect ? `.min(${minSelect})` : "";
    const max = maxSelect ? `.max(${maxSelect})` : "";
    const multiple = maxSelect === 1 ? "" : `.array()${min}${max}`;
    const isOptional = required || maxSelect !== 1 ? `` : `.transform((id) => id === "" ? undefined : id)`;
    return `z.string()${isOptional}${multiple}`;
  }

  function stringifySelectField({ name, options: { maxSelect } }: SchemaField, collectionName: string) {
    // TODO: implement values
    return `${opts.nameEnumSchema(opts.nameEnumField(collectionName, name))}${maxSelect === 1 ? "" : `.array().max(${maxSelect})`}`;
  }

  function stringifyTextField({ options: { max, min } }: SchemaField) {
    // TODO: implement pattern
    return `z.string()${min ? `.min(${min})` : ""}${max ? `.max(${max})` : ""}`;
  }

  function stringifyUrlField(_field: SchemaField) {
    // TODO: implement exceptDomains and onlyDomains
    return "z.string().url()";
  }

  function stringifySchemasEntry({ name }: CollectionModel) {
    return `["${name}", ${opts.nameRecordSchema(name)}]`;
  }

  function stringifyService({ name }: CollectionModel) {
    return `\t\tcollection(idOrName: "${name}"): RecordService<z.input<typeof ${opts.nameRecordSchema(name)}>>;`;
  }

  return {
    collectionNames: `[\n\t${collections.map(({ name }) => `"${name}"`).join(",\n\t")},\n]`,
    enums: getCollectionSelectFields().map(stringifyEnum).join("\n\n"),
    records: `${collections.map(stringifyRecord).join("\n\n")}\n\nexport const records = new Map<Collection, z.AnyZodObject>([\n\t${collections.map(stringifySchemasEntry).join(",\n\t")},\n]);`,
    services: collections.map(stringifyService).join("\n"),
  };
}

export type SelectField = { name: string; values: string[] };

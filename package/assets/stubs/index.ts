import type Pocketbase from "pocketbase";
import type { RecordService } from "pocketbase";
import { z } from "zod";

/******* ENUMS *******/
export const collectionValues = @@_COLLECTION_NAMES_@@ as const;
export const Collection = z.enum(collectionValues);
export type Collection = z.infer<typeof Collection>;
export const COLLECTION = Collection.enum;

@@_ENUMS_@@

/******* BASE *******/
export const BaseModel = z.object({
  created: z.string().pipe(z.coerce.date()),
  id: z.string(),
  updated: z.string().pipe(z.coerce.date()),
});
export type BaseModel = z.infer<typeof BaseModel>;

export const AdminModel = z.object({
  ...BaseModel.shape,
  avatar: z.string(),
  email: z.string().email(),
});
export type AdminModel = z.infer<typeof AdminModel>;

export const RecordModel = z.object({
  ...BaseModel.shape,
  collectionId: z.string(),
  collectionName: z.string(),
  expand: z.any().optional(),
});
export type RecordModel = z.infer<typeof RecordModel>;

/******* RECORDS *******/
@@_RECORDS_@@

/******* CLIENT *******/
export type TypedPocketbase = Pocketbase & {
@@_SERVICES_@@
};

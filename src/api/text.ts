import { AGE_RATING_ENUM } from "@/constants/age-rating";
import { ENDPOINTS } from "@/constants/endpoint";
import { BasePaginationResponse, BaseResponse } from "@/model/base-response";
import { TextResponse } from "@/model/text";
import { BACKEND_API } from "@/utilities/backend-api";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTextSchema = z.object({
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
  tag: z.array(z.string()),
  currentPage: z.number(),
  pageSize: z.number()
});
export type getTextSchemaType = z.infer<typeof getTextSchema>;
export const getText = createServerFn()
  .inputValidator(getTextSchema)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    const res = await client.get<BasePaginationResponse<TextResponse>>(
      ENDPOINTS.TEXT,
      {
        params: {
          ageRating: data.ageRating,
          tagAND: data.tag,
          currentPage: data.currentPage,
          pageSize: data.pageSize
        }
      }
    );
    return res.data;
  });

export const getTextByID = createServerFn()
  .inputValidator(z.uuidv7())
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    const res = await client.get<BaseResponse<TextResponse>>(`${ENDPOINTS.TEXT}/${data}`,);
    return res.data;
  });

export const insertTextSchema = z.object({
  title: z.string("Must be something")
    .min(1, "Give a name for better searching")
    .max(50, "Too long! Max 50 chars"),
  description: z.string("Must be something")
    .max(4000, "Too long! Max 4000 chars"),
  source: z.string("Must be something")
    .min(1, "Provide a source... unless it's yours :)")
    .max(4000, "Too long! Max 4000 chars"),
  content: z.string("Must be something")
    .min(1, "Please type something")
    .max(4000, "What on earth are you typing???"),
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
  tags: z.array(z.string())
    .min(1, "Add at least one tag so other stealer can quickly stumble upon it")
});
export type insertTextSchemaType = z.infer<typeof insertTextSchema>;
export const insertText = createServerFn({ method: 'POST' })
  .inputValidator(d => d as FormData)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.post<BaseResponse<{ id: string }>>(
      ENDPOINTS.TEXT,
      data
    );
  });

export const updateTextSchema = z.object({
  id: z.uuidv7(),
  title: z.string("Must be something")
    .min(1, "Give a name for better searching")
    .max(50, "Too long! Max 50 chars"),
  description: z.string("Must be something")
    .max(4000, "Too long! Max 4000 chars"),
  source: z.string("Must be something")
    .min(1, "Provide a source... unless it's yours :)")
    .max(4000, "Too long! Max 4000 chars"),
  content: z.string("Must be something")
    .min(1, "Please type something")
    .max(4000, "What on earth are you typing???"),
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
  tags: z.array(z.string())
    .min(1, "Add at least one tag so other stealer can quickly stumble upon it")
});
export type updateTextSchemaType = z.infer<typeof updateTextSchema>;
export const updateText = createServerFn({ method: 'POST' })
  .inputValidator(d => d as FormData)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.patch<BaseResponse<{ id: string }>>(
      ENDPOINTS.TEXT,
      data
    );
  });

export const deleteTextSchema = z.object({
  id: z.uuidv7()
});
export type deleteTextSchemaType = z.infer<typeof deleteTextSchema>;
export const deleteText = createServerFn({ method: 'POST' })
  .inputValidator(deleteTextSchema)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.delete<BaseResponse<{ id: string }>>(`${ENDPOINTS.TEXT}/${data.id}`);
  });
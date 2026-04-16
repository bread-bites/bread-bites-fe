import { AGE_RATING_ENUM } from "@/constants/age-rating";
import { ENDPOINTS } from "@/constants/endpoint";
import { BasePaginationResponse, BaseResponse } from "@/model/base-response";
import { TextResponse } from "@/model/text";
import { BACKEND_API } from "@/utilities/backend-api";
import { m } from "@paraglide/messages";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTextSchema = z.object({
  ageRating: z.enum(AGE_RATING_ENUM, m.text_validation_age_rating()),
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
    const res = await client.get<BaseResponse<TextResponse>>(ENDPOINTS.TEXT_ID(data),);
    return res.data;
  });

export const insertTextSchema = z.object({
  title: z.string(m.text_validation_title_required())
    .min(1, m.text_validation_title_min())
    .max(50, { error: (e) => m.text_validation_title_max({ max: e.maximum }) }),
  description: z.string(m.text_validation_description_required())
    .max(4000, { error: (e) => m.text_validation_description_max({ max: e.maximum }) }),
  source: z.string(m.text_validation_source_required())
    .min(1, m.text_validation_source_min())
    .max(4000, { error: (e) => m.text_validation_source_max({ max: e.maximum }) }),
  content: z.string(m.text_validation_content_required())
    .min(1, m.text_validation_content_min())
    .max(4000, { error: (e) => m.text_validation_content_max({ max: e.maximum }) }),
  ageRating: z.enum(AGE_RATING_ENUM, m.text_validation_age_rating()),
  tags: z.array(z.string())
    .min(1, m.text_validation_tags())
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
  title: z.string(m.text_validation_title_required())
    .min(1, m.text_validation_title_min())
    .max(50, { error: (e) => m.text_validation_title_max({ max: e.maximum }) }),
  description: z.string(m.text_validation_description_required())
    .max(4000, { error: (e) => m.text_validation_description_max({ max: e.maximum }) }),
  source: z.string(m.text_validation_source_required())
    .min(1, m.text_validation_source_min())
    .max(4000, { error: (e) => m.text_validation_source_max({ max: e.maximum }) }),
  content: z.string(m.text_validation_content_required())
    .min(1, m.text_validation_content_min())
    .max(4000, { error: (e) => m.text_validation_content_max({ max: e.maximum }) }),
  ageRating: z.enum(AGE_RATING_ENUM, m.text_validation_age_rating()),
  tags: z.array(z.string())
    .min(1, m.text_validation_tags())
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
    await client.delete<BaseResponse<{ id: string }>>(ENDPOINTS.TEXT_ID(data.id));
  });
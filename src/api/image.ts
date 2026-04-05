import { AGE_RATING_ENUM } from "@/constants/age-rating";
import { ENDPOINTS } from "@/constants/endpoint";
import { BasePaginationResponse, BaseResponse } from "@/model/base-response";
import { ImageResponse } from "@/model/image";
import { BACKEND_API } from "@/utilities/backend-api";
import { m } from "@paraglide/messages";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getImageSchema = z.object({
  ageRating: z.enum(AGE_RATING_ENUM, m.image_validation_age_rating()),
  tag: z.array(z.string()),
  currentPage: z.number(),
  pageSize: z.number()
});
export type getImageSchemaType = z.infer<typeof getImageSchema>;
export const getImage = createServerFn()
  .inputValidator(getImageSchema)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    const res = await client.get<BasePaginationResponse<ImageResponse>>(
      ENDPOINTS.IMAGE,
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

export const getImageByID = createServerFn()
  .inputValidator(z.uuidv7())
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    const res = await client.get<BaseResponse<ImageResponse>>(`${ENDPOINTS.IMAGE}/${data}`,);
    return res.data;
  });

export const insertImageSchema = z.object({
  name: z.string(m.image_validation_name_required())
    .min(1, m.image_validation_name_min())
    .max(50, { error: (e) => m.image_validation_name_max({ max: e.maximum }) }),
  description: z.string(m.image_validation_description_required())
    .max(4000, { error: (e) => m.image_validation_description_max({ max: e.maximum }) }),
  source: z.string(m.image_validation_source_required())
    .min(1, { error: (e) => m.image_validation_source_min({ min: e.minimum }) })
    .max(4000, { error: (e) => m.image_validation_source_max({ max: e.maximum }) }),
  image: z.file(m.image_validation_image_required())
    .mime(["image/jpeg", "image/png", "image/webp"], m.image_validation_image_type()),
  ageRating: z.enum(AGE_RATING_ENUM, m.image_validation_age_rating()),
  tags: z.array(z.string())
    .min(1, m.image_validation_tags())
});
export type insertImageSchemaType = z.infer<typeof insertImageSchema>;
export const insertImage = createServerFn({ method: 'POST' })
  .inputValidator(d => d as FormData)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.post<BaseResponse<{ id: string }>>(
      ENDPOINTS.IMAGE,
      data
    );
  });

export const updateImageSchema = z.object({
  id: z.uuidv7(),
  name: z.string(m.image_validation_name_required())
    .min(1, m.image_validation_name_min())
    .max(50, { error: (e) => m.image_validation_name_max({ max: e.maximum }) }),
  description: z.string(m.image_validation_description_required())
    .max(4000, { error: (e) => m.image_validation_description_max({ max: e.maximum }) }),
  source: z.string(m.image_validation_source_required())
    .min(1, { error: (e) => m.image_validation_source_min({ min: e.minimum }) })
    .max(4000, { error: (e) => m.image_validation_source_max({ max: e.maximum }) }),
  ageRating: z.enum(AGE_RATING_ENUM, m.image_validation_age_rating()),
  tags: z.array(z.string())
    .min(1, m.image_validation_tags())
});
export type updateImageSchemaType = z.infer<typeof updateImageSchema>;
export const updateImage = createServerFn({ method: 'POST' })
  .inputValidator(d => d as FormData)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.patch<BaseResponse<{ id: string }>>(
      ENDPOINTS.IMAGE,
      data
    );
  });

export const deleteImageSchema = z.object({
  id: z.uuidv7()
});
export type deleteImageSchemaType = z.infer<typeof deleteImageSchema>;
export const deleteImage = createServerFn({ method: 'POST' })
  .inputValidator(deleteImageSchema)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    await client.delete<BaseResponse<{ id: string }>>(`${ENDPOINTS.IMAGE}/${data.id}`);
  });
import { AGE_RATING_ENUM } from "@/constants/age-rating";
import { ENDPOINTS } from "@/constants/endpoint";
import { BasePaginationResponse, BaseResponse } from "@/model/base-response";
import { ImageResponse } from "@/model/image";
import { BACKEND_API } from "@/utilities/backend-api";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getImageSchema = z.object({
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
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
  name: z.string("Must be something")
    .min(1, "Give a name for better searching")
    .max(50, "Too long! Max 50 chars"),
  description: z.string("Must be something")
    .max(4000, "Too long! Max 4000 chars"),
  source: z.string("Must be something")
    .min(1, "Provide a source... unless it's yours :)")
    .max(4000, "Too long! Max 4000 chars"),
  image: z.file("Please upload something 😢")
    .mime(["image/jpeg", "image/png", "image/webp"], "Image only pls")
    .max(1024 * Number(import.meta.env.VITE_MAX_UPLOAD_SIZE_KB), "Too big! Max 50KB"),
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
  tags: z.array(z.string())
    .min(1, "Add at least one tag so other stealer can quickly stumble upon it")
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
  name: z.string("Must be something")
    .min(1, "Give a name for better searching")
    .max(50, "Too long! Max 50 chars"),
  description: z.string("Must be something")
    .max(4000, "Too long! Max 4000 chars"),
  source: z.string("Must be something")
    .min(1, "Provide a source... unless it's yours :)")
    .max(4000, "Too long! Max 4000 chars"),
  ageRating: z.enum(AGE_RATING_ENUM, "Select an age rating"),
  tags: z.array(z.string())
    .min(1, "Add at least one tag so other stealer can quickly stumble upon it")
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
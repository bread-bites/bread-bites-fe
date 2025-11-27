import { ENDPOINTS } from "@/constants/endpoint";
import { BasePaginationResponse } from "@/model/base-response";
import { BACKEND_API } from "@/utilities/backend-api";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTagSchema = z.object({
  name: z.string().min(1)
})
export const getTag = createServerFn()
  .inputValidator(getTagSchema)
  .handler(async ({ data }) => {
    const client = await BACKEND_API();
    const response = await client.get<BasePaginationResponse<{ id: string, name: string }>>(
      ENDPOINTS.TAG,
      { params: { name: data.name } }
    );
    return response.data.data;
  });
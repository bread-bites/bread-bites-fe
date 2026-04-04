import { ENDPOINTS } from "@/constants/endpoint";
import { BaseResponse } from "@/model/base-response";
import { BACKEND_API } from "@/utilities/backend-api";
import { createServerFn } from "@tanstack/react-start";

export const getConfig = createServerFn()
  .handler(async () => {
    const client = await BACKEND_API();
    const res = await client.get<BaseResponse<{ maxImageSize: number }>>(
      ENDPOINTS.CONFIG,
    );
    return res.data;
  });

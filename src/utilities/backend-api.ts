import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { createServerOnlyFn } from "@tanstack/react-start";
import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { serialize } from 'object-to-formdata'
import { BadRequestResponse } from "@/model/base-response";
import { AxiosCustomError } from "@/model/axios-error";

export const BACKEND_API = createServerOnlyFn(async () => {
  const { isAuthenticated, sessionId } = await auth();
  const client = axios.create({
    baseURL: process.env.API_URL,
    formSerializer: {
      visitor: function (this, value, key) {
        serialize(value, { indices: true, dotsForObjectNotation: true }, this as FormData, String(key));
        return false;
      },
    },
    paramsSerializer: (params) => qs.stringify(params, {
      allowDots: false,
      arrayFormat: 'repeat'
    })
  });

  client.interceptors.request.use(async x => {
    if (isAuthenticated) {
      const token = await clerkClient().sessions.getToken(sessionId);
      x.headers['Authorization'] = `Bearer ${token.jwt}`
    }

    if (x.headers["Content-Type"] === undefined && ['POST', 'PUT', 'PATCH'].includes(x.method?.toUpperCase() ?? "")) {
      x.headers["Content-Type"] = x.data instanceof FormData ?
        'multipart/form-data' : 'application/x-www-form-urlencoded'
    }

    if (!x.url?.startsWith(process.env.API_URL)) x.url = `${process.env.API_URL}${x.url}`;
    return x;
  });

  client.interceptors.response.use(res => res, async (err: AxiosError) => {
    if (err.status === 400 && err.response) {
      const d = err.response.data as BadRequestResponse;
      return Promise.reject({ code: 400, data: d.data } satisfies AxiosCustomError);
    }
    return Promise.reject({ code: 500, data: "Backend Error" } satisfies AxiosCustomError);
  });

  return client;
});

export const transformFormData = (a: object) =>
  qs.stringify(a, {
    allowDots: true,
    arrayFormat: 'indices',
  });
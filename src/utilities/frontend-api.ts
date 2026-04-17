import { LOCAL_STORAGE_KEY } from "@/constants/local-storage";
import { createIsomorphicFn } from "@tanstack/react-start";
import { serialize } from "object-to-formdata";

export const objectToFormData = (x: object) =>
  serialize(x, {
    dotsForObjectNotation: true,
    booleansAsIntegers: false,
    allowEmptyArrays: true,
    indices: true
  });

export const setLocalStorage = createIsomorphicFn()
  .server((_: LOCAL_STORAGE_KEY, __: string) => { })
  .client((key: LOCAL_STORAGE_KEY, value: string) => {
    localStorage.setItem(key, value);
  });

export const getLocalStorage = createIsomorphicFn()
  .server((_: LOCAL_STORAGE_KEY) => { })
  .client((key: LOCAL_STORAGE_KEY) => localStorage.getItem(key));

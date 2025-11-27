import { serialize } from "object-to-formdata";

export const objectToFormData = (x: object) =>
  serialize(x, {
    dotsForObjectNotation: true,
    booleansAsIntegers: false,
    allowEmptyArrays: true,
    indices: true
  });

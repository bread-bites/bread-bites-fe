export const AGE_RATING_ENUM = {
  GENERAL: 1,
  MATURE: 2,
  EXPLICIT: 3,
} as const;

export type AGE_RATING_ENUM_TYPE_VALUE = typeof AGE_RATING_ENUM[keyof typeof AGE_RATING_ENUM];

export const AGE_RATING_SELECT = Object.entries(AGE_RATING_ENUM).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase(),
  value: value as AGE_RATING_ENUM_TYPE_VALUE
}));
import { AGE_RATING_ENUM_TYPE_VALUE } from "@/constants/age-rating"

export type TextResponse = {
  id: string,
  title: string,
  content: string,
  source: string,
  description: string | null,
  uploadDate: string,
  ageRating: AGE_RATING_ENUM_TYPE_VALUE,
  tags: string[],
  myText: boolean
}
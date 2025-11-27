import { AGE_RATING_ENUM_TYPE_VALUE } from "@/constants/age-rating"

export type ImageResponse = {
  id: string,
  name: string,
  image: string,
  source: string,
  description: string | null,
  uploadDate: string,
  ageRating: AGE_RATING_ENUM_TYPE_VALUE,
  tags: string[],
  myImage: boolean
}
export type AxiosCustomError = {
  code: 400,
  data: Record<string, string[]>
} | {
  code: 500,
  data: string
}
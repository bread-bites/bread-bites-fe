export type BaseResponse<T> = {
  message: string,
  data: T,
  statusCode: number
}
export type BasePaginationResponse<T> = BaseResponse<T[]> & {
  pagination: {
    totalData: number,
    currentPage: number,
    pageSize: number,
    isLastPage: boolean
  }
}
export type BadRequestResponse = BaseResponse<Record<string, string[]>>;
export const ENDPOINTS = {
  TAG: '/tag',
  IMAGE: '/image',
  IMAGE_ID: (id: string) => `/image/${id}`,
  TEXT: '/text',
  TEXT_ID: (id: string) => `/text/${id}`,
  CONFIG: '/config'
}
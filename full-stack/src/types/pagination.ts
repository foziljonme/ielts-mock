// src/types/pagination.ts
export type Pagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  results: T[]
  pagination: Pagination
}

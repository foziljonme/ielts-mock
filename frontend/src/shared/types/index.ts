export interface IPagination<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  results: T[];
}

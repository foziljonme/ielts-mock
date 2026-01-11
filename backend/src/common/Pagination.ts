export class Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor({
    page,
    limit,
    total,
  }: {
    page: number;
    limit: number;
    total: number;
  }) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}

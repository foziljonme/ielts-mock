export class Utils {
  paginate({
    data,
    page,
    limit,
    total,
  }: {
    data: any[];
    page: number;
    limit: number;
    total: number;
  }) {
    return {
      results: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

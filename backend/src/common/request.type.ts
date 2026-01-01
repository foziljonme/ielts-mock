export type AuthRequest = Request & {
  user: {
    id: string;
    tenantId: string;
    permissions: string[];
  };
};

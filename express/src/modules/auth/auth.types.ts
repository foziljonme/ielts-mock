export type JwtBasePayload = {
  sub: string;
  tenantId: string;
  examId?: string;
  roles: string[];
};

export type AuthRequestContext = {
  user: JwtBasePayload;
};

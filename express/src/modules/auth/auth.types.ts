export type JwtBasePayload = {
  sub: string;
  tenantId: string;
  sessionId?: string;
  roles: string[];
};

export type AuthRequestContext = {
  user: JwtBasePayload;
};

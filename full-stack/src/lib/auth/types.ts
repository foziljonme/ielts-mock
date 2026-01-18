export type JwtBasePayload = {
  sub: string
  tenantId: string
  roles: string[]
}

export type AuthRequestContext = {
  user: JwtBasePayload
}

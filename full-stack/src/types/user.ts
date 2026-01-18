export interface IUser {
  id: string
  tenantId: string
  email: string
  password: string
  name: string
  roles: string[]
  isDeleted: boolean
  createdAt: string
}

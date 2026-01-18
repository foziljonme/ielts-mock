export interface ITenant {
  id: string
  name: string
  subdomain: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  seatQuota: number
  seatUsage: number
}

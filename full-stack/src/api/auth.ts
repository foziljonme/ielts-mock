import httpClient from '@/lib/httpClient'
import { IUser } from '@/types/user'

export const login = async (email: string, password: string) => {
  return await httpClient
    .post<IUser>('/auth/login', {
      email,
      password,
    })
    .then(res => {
      return res.data
    })
    .catch(err => {
      throw err
    })
}

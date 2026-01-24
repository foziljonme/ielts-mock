import axios, { AxiosInstance } from 'axios'
import { BASE_URL, TOKEN_KEY } from './constants'

// class HttpClient {
//   private async handleResponse<T>(res: Response) {
//     const json = await res.json()

//     if (!res.ok) {
//       throw new Error(json.error?.message || json.message)
//     }

//     return json as T
//   }

//   async get<T = any>(url: string) {
//     return fetch('/api' + url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }).then(async res => this.handleResponse<T>(res))
//   }

//   async post<T = any>(url: string, data: any) {
//     return fetch('/api' + url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     }).then(async res => this.handleResponse<T>(res))
//   }

//   async put<T = any>(url: string, data: any) {
//     return fetch('/api' + url, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     }).then(async res => this.handleResponse<T>(res))
//   }

//   async delete<T = any>(url: string) {
//     return fetch('/api' + url, {
//       method: 'DELETE',
//     }).then(async res => this.handleResponse<T>(res))
//   }
// }

// const httpClient = new HttpClient()
// const httpClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

class HttpClient {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async get<T = any>(url: string) {
    return this.axiosInstance.get<T>(url).then(res => res.data)
  }

  async post<T = any>(url: string, data: any) {
    return this.axiosInstance.post<T>(url, data).then(res => res.data)
  }

  async put<T = any>(url: string, data: any) {
    return this.axiosInstance.put<T>(url, data).then(res => res.data)
  }

  async delete<T = any>(url: string) {
    return this.axiosInstance.delete<T>(url).then(res => res.data)
  }
}
const httpClient = new HttpClient()

export default httpClient

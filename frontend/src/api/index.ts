import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vita-auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fallback = (value: any) => Promise.resolve(value)




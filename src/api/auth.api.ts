import api from './axios'
import { LoginResponse } from '../types'

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}
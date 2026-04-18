import api from './axios'
import { Estudiante } from '../types'
// modulo para manejar las peticiones relacionadas con estudiantes
export const getEstudiantesApi = async (): Promise<Estudiante[]> => {
  const { data } = await api.get('/estudiantes')
  return data
}

export const getEstudianteApi = async (id: string): Promise<Estudiante> => {
  const { data } = await api.get(`/estudiantes/${id}`)
  return data
}

export const getProgramasApi = async () => {
  const { data } = await api.get('/estudiantes/programas')
  return data
}

export const crearEstudianteApi = async (estudiante: Partial<Estudiante>): Promise<Estudiante> => {
  const { data } = await api.post('/estudiantes', estudiante)
  return data
}

export const actualizarEstudianteApi = async (id: string, estudiante: Partial<Estudiante>): Promise<Estudiante> => {
  const { data } = await api.put(`/estudiantes/${id}`, estudiante)
  return data
}

export const eliminarEstudianteApi = async (id: string): Promise<void> => {
  await api.delete(`/estudiantes/${id}`)
}
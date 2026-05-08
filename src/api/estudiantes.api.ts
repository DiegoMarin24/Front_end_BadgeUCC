import api from './axios'
import { Estudiante } from '../types'
import { useAuthStore } from '@/store/authStore'
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

export const exportarEstudiantesApi = async (): Promise<void> => {
  const token = useAuthStore.getState().token
  const response = await fetch('http://localhost:3000/api/estudiantes/exportar', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'estudiantes_movilidad_ucc.xlsx'
  a.click()
  window.URL.revokeObjectURL(url)
}

export const importarEstudiantesApi = async (archivo: File) => {
  const token = useAuthStore.getState().token
  const formData = new FormData()
  formData.append('archivo', archivo)
  const response = await fetch('http://localhost:3000/api/estudiantes/importar', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await response.json()
  return data
}
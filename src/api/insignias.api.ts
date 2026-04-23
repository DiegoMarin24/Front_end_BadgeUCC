import api from './axios'

export const getInsigniasApi = async () => {
  const { data } = await api.get('/insignias')
  return data
}

export const getInsigniasEstudianteApi = async (estudianteId: string) => {
  const { data } = await api.get(`/insignias/estudiante/${estudianteId}`)
  return data
}

export const getRequisitosEstudianteApi = async (estudianteId: string) => {
  const { data } = await api.get(`/insignias/requisitos/${estudianteId}`)
  return data
}

export const asignarInsigniaApi = async (payload: {
  estudianteId: string
  insigniaId: string
  otorgadaPor: string
}) => {
  const { data } = await api.post('/insignias', payload)
  return data
}

export const revocarInsigniaApi = async (estudianteId: string, insigniaId: string) => {
  await api.delete(`/insignias/${estudianteId}/${insigniaId}`)
}

export const marcarRequisitoApi = async (payload: {
  estudianteId: string
  requisitoId: string
  aprobado: boolean
  aprobadoPor: string
  observaciones?: string
}) => {
  const { data } = await api.post('/insignias/requisitos/marcar', payload)
  return data
}
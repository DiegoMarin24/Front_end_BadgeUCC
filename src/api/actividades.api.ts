import api from './axios'

export const getCatalogoApi = async () => {
  const { data } = await api.get('/actividades/catalogo')
  return data
}

export const getActividadesEstudianteApi = async (estudianteId: string) => {
  const { data } = await api.get(`/actividades/estudiante/${estudianteId}`)
  return data
}

export const registrarActividadApi = async (payload: {
  estudianteId: string
  actividadId: string
  puntosObtenidos: number
  registradoPor: string
  urlCertificado?: string
  observaciones?: string
}) => {
  const { data } = await api.post('/actividades', payload)
  return data
}

export const eliminarActividadApi = async (id: string) => {
  await api.delete(`/actividades/${id}`)
}
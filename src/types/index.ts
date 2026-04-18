export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'ADMIN' | 'COORDINADOR'
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export interface Estudiante {
  id: string
  programaAcademicoId: string
  nivelAcademico: string
  idEstudiante: string
  tipoDocumento: string
  nroDocumento: string
  lugarExpedicion: string
  primerApellido: string
  segundoApellido?: string
  primerNombre: string
  segundoNombre?: string
  genero: string
  nroTelefonico?: string
  correoInstitucional: string
  programa?: { id: string; nombre: string }
  insigniasObtenidas?: InsigniaEstudiante[]
  actividadesRealizadas?: ActividadRealizada[]
  cumplimientoRequisitos?: CumplimientoRequisito[]
}

export interface ActividadRealizada {
  id: string
  actividadId: string
  fechaRegistro: string
  registradoPor: string
  urlCertificado?: string
  puntosObtenidos: number
  observaciones?: string
  actividad: {
    id: string
    nombre: string
    puntos: number
  }
}

export interface CumplimientoRequisito {
  id: string
  requisitoId: string
  aprobado: boolean
  fechaAprobacion?: string
  aprobadoPor?: string
  observaciones?: string
  requisito: {
    id: string
    descripcion: string
    tipo: string
    esObligatorio: boolean
  }
}

export interface Insignia {
  id: string
  nombre: string
  descripcion?: string
  nivel: number
  imagenUrl?: string
}

export interface InsigniaEstudiante {
  id: string
  insigniaId: string
  fechaEmision: string
  otorgadaPor: string
  insignia: Insignia
}
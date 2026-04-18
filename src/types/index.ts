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
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProgramasApi,
  crearEstudianteApi,
  actualizarEstudianteApi,
  getEstudianteApi,
} from '../../api/estudiantes.api'

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'Pasaporte']
const NIVELES = ['Pregrado', 'Posgrado', 'Especialización', 'Maestría']
const GENEROS = ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir']

const camposVacios = {
  programaAcademicoId: '',
  nivelAcademico: '',
  idEstudiante: '',
  tipoDocumento: '',
  nroDocumento: '',
  lugarExpedicion: '',
  primerApellido: '',
  segundoApellido: '',
  primerNombre: '',
  segundoNombre: '',
  genero: '',
  nroTelefonico: '',
  correoInstitucional: '',
}

export default function EstudianteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState(camposVacios)
  const [error, setError] = useState('')

  const { data: programas = [] } = useQuery({
    queryKey: ['programas'],
    queryFn: getProgramasApi,
  })

  const { data: estudiante } = useQuery({
    queryKey: ['estudiante', id],
    queryFn: () => getEstudianteApi(id!),
    enabled: esEdicion,
  })

  useEffect(() => {
    if (estudiante) {
      setForm({
        programaAcademicoId: estudiante.programaAcademicoId,
        nivelAcademico: estudiante.nivelAcademico,
        idEstudiante: estudiante.idEstudiante,
        tipoDocumento: estudiante.tipoDocumento,
        nroDocumento: estudiante.nroDocumento,
        lugarExpedicion: estudiante.lugarExpedicion,
        primerApellido: estudiante.primerApellido,
        segundoApellido: estudiante.segundoApellido ?? '',
        primerNombre: estudiante.primerNombre,
        segundoNombre: estudiante.segundoNombre ?? '',
        genero: estudiante.genero,
        nroTelefonico: estudiante.nroTelefonico ?? '',
        correoInstitucional: estudiante.correoInstitucional,
      })
    }
  }, [estudiante])

  const mutation = useMutation({
    mutationFn: (data: typeof form) =>
      esEdicion ? actualizarEstudianteApi(id!, data) : crearEstudianteApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudiantes'] })
      navigate('/dashboard/estudiantes')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error ?? 'Ocurrió un error al guardar')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    mutation.mutate(form)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/dashboard/estudiantes')}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {esEdicion ? 'Editar estudiante' : 'Nuevo estudiante'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {esEdicion ? 'Actualiza los datos del estudiante' : 'Completa los datos para registrar un estudiante'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <h2 className="text-base font-medium text-slate-700 mb-5">Datos personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Primer nombre *</label>
              <input name="primerNombre" value={form.primerNombre} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Segundo nombre</label>
              <input name="segundoNombre" value={form.segundoNombre} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Primer apellido *</label>
              <input name="primerApellido" value={form.primerApellido} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Segundo apellido</label>
              <input name="segundoApellido" value={form.segundoApellido} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Género *</label>
              <select name="genero" value={form.genero} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="">Seleccionar...</option>
                {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Correo institucional *</label>
              <input name="correoInstitucional" value={form.correoInstitucional} onChange={handleChange} required type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Teléfono</label>
              <input name="nroTelefonico" value={form.nroTelefonico} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
          <h2 className="text-base font-medium text-slate-700 mb-5">Documento de identidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Tipo de documento *</label>
              <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="">Seleccionar...</option>
                {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Número de documento *</label>
              <input name="nroDocumento" value={form.nroDocumento} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Lugar de expedición *</label>
              <input name="lugarExpedicion" value={form.lugarExpedicion} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-medium text-slate-700 mb-5">Información académica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">ID estudiante *</label>
              <input name="idEstudiante" value={form.idEstudiante} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Programa académico *</label>
              <select name="programaAcademicoId" value={form.programaAcademicoId} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="">Seleccionar...</option>
                {programas.map((p: any) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nivel académico *</label>
              <select name="nivelAcademico" value={form.nivelAcademico} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                <option value="">Seleccionar...</option>
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100 mb-4">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/estudiantes')}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition"
          >
            {mutation.isPending ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Registrar estudiante'}
          </button>
        </div>
      </form>
    </div>
  )
}
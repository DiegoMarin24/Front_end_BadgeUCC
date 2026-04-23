import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCatalogoApi, registrarActividadApi, eliminarActividadApi, getActividadesEstudianteApi } from '../../api/actividades.api'
import { useAuthStore } from '../../store/authStore'
import BuscadorEstudiantes from '../../components/ui/BuscadorEstudiantes'

export default function ActividadesList() {
  const queryClient = useQueryClient()
  const usuario = useAuthStore((s) => s.usuario)

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null)
  const [actividadSeleccionada, setActividadSeleccionada] = useState('')
  const [urlCertificado, setUrlCertificado] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const estudianteId = estudianteSeleccionado?.id ?? ''

  const { data: catalogo = [] } = useQuery({
    queryKey: ['catalogo'],
    queryFn: getCatalogoApi,
  })

  const { data: actividades = [] } = useQuery({
    queryKey: ['actividades-estudiante', estudianteId],
    queryFn: () => getActividadesEstudianteApi(estudianteId),
    enabled: Boolean(estudianteId),
  })

  const actividadElegida = catalogo.find((a: any) => a.id === actividadSeleccionada)

  const registrarMutation = useMutation({
    mutationFn: registrarActividadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actividades-estudiante', estudianteId] })
      queryClient.invalidateQueries({ queryKey: ['estudiantes'] })
      setActividadSeleccionada('')
      setUrlCertificado('')
      setObservaciones('')
      setMostrarFormulario(false)
      setError('')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error ?? 'Error al registrar la actividad')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarActividadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actividades-estudiante', estudianteId] })
      queryClient.invalidateQueries({ queryKey: ['estudiantes'] })
    },
  })

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!estudianteId || !actividadSeleccionada) {
      setError('Selecciona un estudiante y una actividad')
      return
    }
    registrarMutation.mutate({
      estudianteId,
      actividadId: actividadSeleccionada,
      puntosObtenidos: actividadElegida?.puntos ?? 0,
      registradoPor: usuario?.nombre ?? 'Coordinador',
      urlCertificado: urlCertificado || undefined,
      observaciones: observaciones || undefined,
    })
  }

  const totalPuntos = actividades.reduce((acc: number, a: any) => acc + a.puntosObtenidos, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Actividades</h1>
          <p className="text-slate-500 mt-1 text-sm">Registro de actividades de la Ruta Global</p>
        </div>
        {estudianteId && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar actividad
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Buscar estudiante
        </label>
        <BuscadorEstudiantes
          onSeleccionar={setEstudianteSeleccionado}
          estudianteSeleccionado={estudianteSeleccionado}
        />
      </div>

      {estudianteId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs text-slate-400 mb-1">Estudiante</p>
              <p className="text-sm font-semibold text-slate-800">
                {estudianteSeleccionado?.primerNombre} {estudianteSeleccionado?.primerApellido}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{estudianteSeleccionado?.programa?.nombre}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs text-slate-400 mb-1">Actividades registradas</p>
              <p className="text-3xl font-semibold text-slate-800">{actividades.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-xs text-slate-400 mb-1">Total puntos acumulados</p>
              <p className="text-3xl font-semibold text-slate-800">{totalPuntos}</p>
              <p className="text-xs text-slate-400 mt-0.5">Meta: 70 puntos</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-medium text-slate-700">Actividades registradas</h2>
            </div>
            {actividades.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">Sin actividades registradas</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {actividades.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{act.actividad.nombre}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Registrado por {act.registradoPor} · {new Date(act.fechaRegistro).toLocaleDateString('es-CO')}
                      </p>
                      {act.observaciones && (
                        <p className="text-xs text-slate-500 mt-1 italic">{act.observaciones}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {act.urlCertificado
                        ? <a href={act.urlCertificado} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Ver certificado</a>
                        : null
                      }
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
                        +{act.puntosObtenidos} pts
                      </span>
                      <button
                        onClick={() => eliminarMutation.mutate(act.id)}
                        className="text-slate-300 hover:text-red-500 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!estudianteId && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Busca un estudiante para registrar sus actividades</p>
        </div>
      )}

      {mostrarFormulario && (
        <div style={{ minHeight: '400px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="fixed inset-0 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">Registrar actividad</h2>
              <button onClick={() => { setMostrarFormulario(false); setError('') }}
                className="text-slate-400 hover:text-slate-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegistrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Actividad *</label>
                <select
                  value={actividadSeleccionada}
                  onChange={(e) => setActividadSeleccionada(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Seleccionar actividad...</option>
                  {catalogo.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.puntos} pts)
                    </option>
                  ))}
                </select>
              </div>

              {actividadElegida && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                  <p className="text-xs text-blue-600 font-medium">Puntaje a otorgar</p>
                  <p className="text-2xl font-semibold text-blue-700">{actividadElegida.puntos} pts</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  URL certificado <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={urlCertificado}
                  onChange={(e) => setUrlCertificado(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Observaciones <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Notas adicionales..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setMostrarFormulario(false); setError('') }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registrarMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition"
                >
                  {registrarMutation.isPending ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
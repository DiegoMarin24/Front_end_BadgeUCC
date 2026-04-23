import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getEstudiantesApi, eliminarEstudianteApi } from '../../api/estudiantes.api'

export default function EstudiantesList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [busqueda, setBusqueda] = useState('')

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ['estudiantes'],
    queryFn: getEstudiantesApi,
  })

  const eliminarMutation = useMutation({
    mutationFn: eliminarEstudianteApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['estudiantes'] }),
  })

  const handleEliminar = (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      eliminarMutation.mutate(id)
    }
  }

 const estudiantesFiltrados = estudiantes.filter((e) => {
  const texto = busqueda.toLowerCase()
  return (
    e.primerNombre.toLowerCase().includes(texto) ||
    e.primerApellido.toLowerCase().includes(texto) ||
    e.idEstudiante.toLowerCase().includes(texto) ||
    e.correoInstitucional.toLowerCase().includes(texto) ||
    e.nroDocumento.toLowerCase().includes(texto) ||
    (e.segundoNombre ?? '').toLowerCase().includes(texto) ||
    (e.segundoApellido ?? '').toLowerCase().includes(texto)
  )
})


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Estudiantes</h1>
          <p className="text-slate-500 mt-1 text-sm">Gestión de estudiantes registrados</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/estudiantes/nuevo')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo estudiante
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <input
            type="text"
            placeholder="Buscar por nombre, documento, ID o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : estudiantesFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-slate-400 text-sm">
              {busqueda ? 'No se encontraron resultados' : 'No hay estudiantes registrados'}
            </p>
            {!busqueda && (
              <button
                onClick={() => navigate('/dashboard/estudiantes/nuevo')}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Registrar primer estudiante
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-6 py-3">Estudiante</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-6 py-3">ID</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-6 py-3">Programa</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-6 py-3">Insignias</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {estudiantesFiltrados.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {e.primerNombre} {e.segundoNombre} {e.primerApellido} {e.segundoApellido}
                        </p>
                        <p className="text-xs text-slate-400">{e.correoInstitucional}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{e.idEstudiante}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{e.programa?.nombre ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {e.insigniasObtenidas && e.insigniasObtenidas.length > 0 ? (
                          e.insigniasObtenidas.map((i) => (
                            <span
                              key={i.id}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold
                                ${i.insignia.nivel === 1 ? 'bg-blue-500' : i.insignia.nivel === 2 ? 'bg-amber-500' : 'bg-green-500'}`}
                              title={i.insignia.nombre}
                            >
                              {i.insignia.nivel}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Sin insignias</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/estudiantes/${e.id}`)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Ver
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => navigate(`/dashboard/estudiantes/${e.id}/editar`)}
                          className="text-xs text-slate-600 hover:underline"
                        >
                          Editar
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => handleEliminar(e.id, `${e.primerNombre} ${e.primerApellido}`)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
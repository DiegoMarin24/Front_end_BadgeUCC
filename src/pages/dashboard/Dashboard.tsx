import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { getEstudiantesApi } from '../../api/estudiantes.api'
import { getInsigniasApi } from '../../api/insignias.api'
import { getCatalogoApi } from '../../api/actividades.api'

export default function Dashboard() {
  const usuario = useAuthStore((s) => s.usuario)

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes'],
    queryFn: getEstudiantesApi,
  })

  const { data: insignias = [] } = useQuery({
    queryKey: ['insignias'],
    queryFn: getInsigniasApi,
  })

  const { data: catalogo = [] } = useQuery({
    queryKey: ['catalogo'],
    queryFn: getCatalogoApi,
  })

  const totalInsigniasEmitidas = estudiantes.reduce(
    (acc: number, e: any) => acc + (e.insigniasObtenidas?.length ?? 0), 0
  )

  const totalActividades = estudiantes.reduce(
    (acc: number, e: any) => acc + (e.actividadesRealizadas?.length ?? 0), 0
  )

  const estudiantesPorPrograma = estudiantes.reduce((acc: Record<string, number>, e: any) => {
    const programa = e.programa?.nombre ?? 'Sin programa'
    acc[programa] = (acc[programa] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Panel de gestión de movilidad e internacionalización
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total estudiantes</p>
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-800">{estudiantes.length}</p>
          <p className="text-xs text-slate-400 mt-1">Registrados en el sistema</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Insignias emitidas</p>
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-800">{totalInsigniasEmitidas}</p>
          <p className="text-xs text-slate-400 mt-1">En todos los programas</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Actividades registradas</p>
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-800">{totalActividades}</p>
          <p className="text-xs text-slate-400 mt-1">Certificadas y validadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-medium text-slate-700 mb-4">Estudiantes por programa</h2>
          {Object.keys(estudiantesPorPrograma).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(estudiantesPorPrograma).map(([programa, cantidad]) => (
                <div key={programa}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 truncate">{programa}</span>
                    <span className="text-slate-800 font-medium ml-2">{cantidad as number}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${((cantidad as number) / estudiantes.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-base font-medium text-slate-700 mb-4">Insignias disponibles</h2>
          <div className="space-y-3">
            {insignias.map((insignia: any) => {
              const emitidas = estudiantes.filter((e: any) =>
                e.insigniasObtenidas?.some((i: any) => i.insigniaId === insignia.id)
              ).length

              return (
                <div key={insignia.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0
                    ${insignia.nivel === 1 ? 'bg-blue-500' : insignia.nivel === 2 ? 'bg-amber-500' : 'bg-green-500'}`}>
                    {insignia.nivel}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{insignia.nombre}</p>
                    <p className="text-xs text-slate-400">{insignia.requisitos?.length ?? 0} requisitos</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-semibold text-slate-800">{emitidas}</p>
                    <p className="text-xs text-slate-400">emitidas</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-medium text-slate-700 mb-4">
          Catálogo de actividades — {catalogo.length} actividades disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {catalogo.map((act: any) => (
            <div key={act.id} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-600 truncate pr-4">{act.nombre}</p>
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full flex-shrink-0">
                {act.puntos} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
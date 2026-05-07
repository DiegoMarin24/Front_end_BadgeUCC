import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getInsigniasApi,
  getInsigniasEstudianteApi,
  getRequisitosEstudianteApi,
  asignarInsigniaApi,
  revocarInsigniaApi,
  marcarRequisitoApi,
} from '../../api/insignias.api'
import { useAuthStore } from '../../store/authStore'
import BuscadorEstudiantes from '../../components/ui/BuscadorEstudiantes'
import CargaArchivo from '../../components/ui/CargaArchivo'

const nivelBg: Record<number, string> = {
  1: 'bg-blue-50 border-blue-100',
  2: 'bg-amber-50 border-amber-100',
  3: 'bg-green-50 border-green-100',
}

const nivelText: Record<number, string> = {
  1: 'text-blue-700',
  2: 'text-amber-700',
  3: 'text-green-700',
}

const imagenMap: Record<number, string> = {
  1: '/insignias/pasajero-internacional.png',
  2: '/insignias/estudiante-global.png',
  3: '/insignias/ciudadano-mundial.png',
}

export default function InsigniasList() {
  const queryClient = useQueryClient()
  const usuario = useAuthStore((s) => s.usuario)
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null)
  const [urlDocumento, setUrlDocumento] = useState<Record<string, string>>({})
  const [insigniaConDocumento, setInsigniaConDocumento] = useState<string | null>(null)

  const estudianteId = estudianteSeleccionado?.id ?? ''

  const { data: insignias = [] } = useQuery({
    queryKey: ['insignias'],
    queryFn: getInsigniasApi,
  })

  const { data: insigniasEstudiante = [] } = useQuery({
    queryKey: ['insignias-estudiante', estudianteId],
    queryFn: () => getInsigniasEstudianteApi(estudianteId),
    enabled: Boolean(estudianteId),
  })

  const { data: requisitos = [] } = useQuery({
    queryKey: ['requisitos-estudiante', estudianteId],
    queryFn: () => getRequisitosEstudianteApi(estudianteId),
    enabled: Boolean(estudianteId),
  })

  const asignarMutation = useMutation({
    mutationFn: asignarInsigniaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insignias-estudiante', estudianteId] })
      queryClient.invalidateQueries({ queryKey: ['estudiantes'] })
      setInsigniaConDocumento(null)
    },
  })

  const revocarMutation = useMutation({
    mutationFn: ({ estudianteId, insigniaId }: { estudianteId: string; insigniaId: string }) =>
      revocarInsigniaApi(estudianteId, insigniaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insignias-estudiante', estudianteId] })
      queryClient.invalidateQueries({ queryKey: ['estudiantes'] })
    },
  })

  const marcarMutation = useMutation({
    mutationFn: marcarRequisitoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitos-estudiante', estudianteId] })
    },
  })

  const tieneInsignia = (insigniaId: string) =>
    insigniasEstudiante.some((i: any) => i.insigniaId === insigniaId)

  const getCumplimiento = (requisitoId: string) =>
    requisitos.find((r: any) => r.requisitoId === requisitoId)

  const getInsigniaObtenida = (insigniaId: string) =>
    insigniasEstudiante.find((i: any) => i.insigniaId === insigniaId)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Insignias</h1>
        <p className="text-slate-500 mt-1 text-sm">Gestión de insignias y requisitos por estudiante</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-2">Buscar estudiante</label>
        <BuscadorEstudiantes
          onSeleccionar={setEstudianteSeleccionado}
          estudianteSeleccionado={estudianteSeleccionado}
        />
      </div>

      {estudianteId && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
              {estudianteSeleccionado?.primerNombre[0]}{estudianteSeleccionado?.primerApellido[0]}
            </div>
            <div>
              <p className="font-medium text-slate-800">
                {estudianteSeleccionado?.primerNombre} {estudianteSeleccionado?.primerApellido}
              </p>
              <p className="text-sm text-slate-400">
                {estudianteSeleccionado?.programa?.nombre} · {estudianteSeleccionado?.idEstudiante}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              {insigniasEstudiante.map((i: any) => (
                <img
                  key={i.id}
                  src={imagenMap[i.insignia.nivel]}
                  alt={i.insignia.nombre}
                  title={i.insignia.nombre}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {insignias.map((insignia: any) => {
              const obtenida = tieneInsignia(insignia.id)
              const insigniaObtenida = getInsigniaObtenida(insignia.id)
              const requisitosInsignia = insignia.requisitos ?? []
              const totalRequisitos = requisitosInsignia.length
              const requisitosAprobados = requisitosInsignia.filter((r: any) => {
                const cumplimiento = getCumplimiento(r.id)
                return cumplimiento?.aprobado
              }).length
              const mostrandoDocumento = insigniaConDocumento === insignia.id

              return (
                <div key={insignia.id} className={`bg-white rounded-2xl border p-6 ${obtenida ? nivelBg[insignia.nivel] : 'border-slate-200'}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={imagenMap[insignia.nivel]}
                        alt={insignia.nombre}
                        className={`w-12 h-12 rounded-full object-cover flex-shrink-0 ${obtenida ? '' : 'opacity-40 grayscale'}`}
                      />
                      <div>
                        <h2 className={`text-base font-semibold ${obtenida ? nivelText[insignia.nivel] : 'text-slate-800'}`}>
                          {insignia.nombre}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">{insignia.descripcion}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {requisitosAprobados}/{totalRequisitos} requisitos
                      </span>

                      {obtenida ? (
                        <div className="flex items-center gap-2">
                          {insigniaObtenida?.urlDocumento && (
                            <a
                              href={insigniaObtenida.urlDocumento}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Ver soporte
                            </a>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`¿Revocar la insignia "${insignia.nombre}"?`)) {
                                revocarMutation.mutate({ estudianteId, insigniaId: insignia.id })
                              }
                            }}
                            className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            Revocar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setInsigniaConDocumento(mostrandoDocumento ? null : insignia.id)}
                          className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                        >
                          Asignar insignia
                        </button>
                      )}
                    </div>
                  </div>

                  {mostrandoDocumento && !obtenida && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                      <p className="text-xs font-medium text-slate-600">Documento de soporte para asignar la insignia</p>
                      <CargaArchivo
                        label="Adjuntar soporte"
                        urlActual={urlDocumento[insignia.id]}
                        onArchivoSubido={(url) => setUrlDocumento(prev => ({ ...prev, [insignia.id]: url }))}
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setInsigniaConDocumento(null)}
                          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            asignarMutation.mutate({
                              estudianteId,
                              insigniaId: insignia.id,
                              otorgadaPor: usuario?.nombre ?? 'Coordinador',
                              urlDocumento: urlDocumento[insignia.id] || undefined,
                            })
                          }}
                          disabled={asignarMutation.isPending}
                          className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition"
                        >
                          {asignarMutation.isPending ? 'Asignando...' : 'Confirmar asignación'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {requisitosInsignia.map((req: any) => {
                      const cumplimiento = getCumplimiento(req.id)
                      const aprobado = cumplimiento?.aprobado ?? false

                      return (
                        <div key={req.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                marcarMutation.mutate({
                                  estudianteId,
                                  requisitoId: req.id,
                                  aprobado: !aprobado,
                                  aprobadoPor: usuario?.nombre ?? 'Coordinador',
                                })
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                                aprobado ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-400'
                              }`}
                            >
                              {aprobado && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            <div>
                              <p className={`text-sm ${aprobado ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                                {req.descripcion}
                              </p>
                              {cumplimiento?.aprobadoPor && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Aprobado por {cumplimiento.aprobadoPor}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${
                            req.esObligatorio
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                            {req.esObligatorio ? 'Obligatorio' : 'Opcional'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {!estudianteId && (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Busca un estudiante para gestionar sus insignias</p>
        </div>
      )}
    </div>
  )
}
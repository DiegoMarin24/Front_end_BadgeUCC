import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEstudianteApi } from '../../api/estudiantes.api'

const nivelColor: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-amber-500',
  3: 'bg-green-500',
}

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

export default function EstudianteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: estudiante, isLoading } = useQuery({
    queryKey: ['estudiante', id],
    queryFn: () => getEstudianteApi(id!),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!estudiante) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Estudiante no encontrado</p>
      </div>
    )
  }

  const nombreCompleto = [
    estudiante.primerNombre,
    estudiante.segundoNombre,
    estudiante.primerApellido,
    estudiante.segundoApellido,
  ].filter(Boolean).join(' ')

  const iniciales = `${estudiante.primerNombre[0]}${estudiante.primerApellido[0]}`

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
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-800">{nombreCompleto}</h1>
          <p className="text-slate-500 text-sm mt-1">{estudiante.programa?.nombre}</p>
        </div>
        <button
          onClick={() => navigate(`/dashboard/estudiantes/${id}/editar`)}
          className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold">
                {iniciales}
              </div>
              <div>
                <p className="font-medium text-slate-800">{nombreCompleto}</p>
                <p className="text-sm text-slate-400">{estudiante.correoInstitucional}</p>
              </div>
            </div>

            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Datos personales</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ID Estudiante', value: estudiante.idEstudiante },
                { label: 'Nivel académico', value: estudiante.nivelAcademico },
                { label: 'Tipo documento', value: estudiante.tipoDocumento },
                { label: 'Nro. documento', value: estudiante.nroDocumento },
                { label: 'Lugar expedición', value: estudiante.lugarExpedicion },
                { label: 'Género', value: estudiante.genero },
                { label: 'Teléfono', value: estudiante.nroTelefonico ?? '—' },
                { label: 'Programa', value: estudiante.programa?.nombre ?? '—' },
              ].map((campo) => (
                <div key={campo.label}>
                  <p className="text-xs text-slate-400 mb-0.5">{campo.label}</p>
                  <p className="text-sm text-slate-700 font-medium">{campo.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
              Actividades registradas
            </h2>
            {estudiante.actividadesRealizadas && estudiante.actividadesRealizadas.length > 0 ? (
              <div className="space-y-3">
                {estudiante.actividadesRealizadas.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{act.actividad.nombre}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Registrado por {act.registradoPor} · {new Date(act.fechaRegistro).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {act.urlCertificado
                        ? <a href={act.urlCertificado} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Ver certificado</a>
                        : null
                      }    
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
                        +{act.puntosObtenidos} pts
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Total: {estudiante.actividadesRealizadas.reduce((acc: number, a: any) => acc + a.puntosObtenidos, 0)} puntos
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">Sin actividades registradas</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Insignias obtenidas</h2>
            {estudiante.insigniasObtenidas && estudiante.insigniasObtenidas.length > 0 ? (
              <div className="space-y-3">
                {estudiante.insigniasObtenidas.map((i: any) => (
                  <div key={i.id} className={`p-4 rounded-xl border ${nivelBg[i.insignia.nivel]}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${nivelColor[i.insignia.nivel]}`}>
                        {i.insignia.nivel}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${nivelText[i.insignia.nivel]}`}>{i.insignia.nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(i.fechaEmision).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400">Sin insignias aún</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Requisitos</h2>
            {estudiante.cumplimientoRequisitos && estudiante.cumplimientoRequisitos.length > 0 ? (
              <div className="space-y-2">
                {estudiante.cumplimientoRequisitos.map((r: any) => (
                  <div key={r.id} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${r.aprobado ? 'bg-green-500' : 'bg-slate-200'}`}>
                      {r.aprobado && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{r.requisito.descripcion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Sin requisitos registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
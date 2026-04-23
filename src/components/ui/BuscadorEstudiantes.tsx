import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getEstudiantesApi } from '../../api/estudiantes.api'

interface Props {
  onSeleccionar: (estudiante: any) => void
  estudianteSeleccionado?: any
}

export default function BuscadorEstudiantes({ onSeleccionar, estudianteSeleccionado }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['estudiantes'],
    queryFn: getEstudiantesApi,
  })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const resultados = busqueda.length >= 2
    ? estudiantes.filter((e: any) => {
        const texto = busqueda.toLowerCase()
        return (
          e.primerNombre.toLowerCase().includes(texto) ||
          e.primerApellido.toLowerCase().includes(texto) ||
          e.nroDocumento.toLowerCase().includes(texto) ||
          e.idEstudiante.toLowerCase().includes(texto) ||
          e.correoInstitucional.toLowerCase().includes(texto)
        )
      }).slice(0, 8)
    : []
    
  const handleSeleccionar = (estudiante: any) => {
    onSeleccionar(estudiante)
    setBusqueda('')
    setAbierto(false)
  }

  const handleLimpiar = () => {
    onSeleccionar(null)
    setBusqueda('')
  }

  if (estudianteSeleccionado) {
    return (
      <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0">
          {estudianteSeleccionado.primerNombre[0]}{estudianteSeleccionado.primerApellido[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-800">
            {estudianteSeleccionado.primerNombre} {estudianteSeleccionado.segundoNombre} {estudianteSeleccionado.primerApellido} {estudianteSeleccionado.segundoApellido}
          </p>
          <p className="text-xs text-blue-500 mt-0.5">
            {estudianteSeleccionado.tipoDocumento} {estudianteSeleccionado.nroDocumento} · {estudianteSeleccionado.programa?.nombre}
          </p>
        </div>
        <button
          onClick={handleLimpiar}
          className="text-blue-400 hover:text-blue-600 transition flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setAbierto(true) }}
          onFocus={() => setAbierto(true)}
          placeholder="Buscar por nombre, documento o ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {abierto && busqueda.length >= 2 && (
        <div className="absolute z-10 w-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {resultados.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">
              Sin resultados para "{busqueda}"
            </div>
          ) : (
            resultados.map((e: any) => (
              <button
                key={e.id}
                onClick={() => handleSeleccionar(e)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-semibold flex-shrink-0">
                  {e.primerNombre[0]}{e.primerApellido[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {e.primerNombre} {e.primerApellido}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {e.tipoDocumento} {e.nroDocumento} · {e.idEstudiante}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 truncate max-w-24">
                  {e.programa?.nombre}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {abierto && busqueda.length > 0 && busqueda.length < 2 && (
        <div className="absolute z-10 w-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg px-4 py-3">
          <p className="text-xs text-slate-400 text-center">Escribe al menos 2 caracteres para buscar</p>
        </div>
      )}
    </div>
  )
}
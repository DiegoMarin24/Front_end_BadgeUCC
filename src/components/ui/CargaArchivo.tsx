//  carga de archivos en el frontend
import { useState, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'

interface Props {
  onArchivoSubido: (url: string, nombre: string) => void
  urlActual?: string
  label?: string
}

export default function CargaArchivo({ onArchivoSubido, urlActual, label = 'Adjuntar documento' }: Props) {
  const token = useAuthStore((s) => s.token)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [nombreArchivo, setNombreArchivo] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setError('')
    setSubiendo(true)

    try {
      const formData = new FormData()
      formData.append('archivo', archivo)

      const response = await fetch('http://localhost:3000/api/archivos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Error al subir el archivo')
      }

      const data = await response.json()
      setNombreArchivo(data.nombre)
      onArchivoSubido(data.url, data.nombre)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubiendo(false)
    }
  }

  const urlFinal = urlActual

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">
        {label} <span className="text-slate-400 font-normal">(opcional)</span>
      </label>

      {urlFinal ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">
              {nombreArchivo || 'Archivo adjunto'}
            </p>
            <a
              href={urlFinal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:underline"
            >
              Ver documento
            </a>
          </div>
          <button
            type="button"
            onClick={() => {
              setNombreArchivo('')
              onArchivoSubido('', '')
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="text-green-400 hover:text-green-600 transition flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition
            ${subiendo ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
        >
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {subiendo ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {subiendo ? 'Subiendo archivo...' : 'Haz clic para seleccionar'}
            </p>
            <p className="text-xs text-slate-400">PDF, JPG o PNG — máx. 10MB</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleArchivo}
        className="hidden"
      />
    </div>
  )
}
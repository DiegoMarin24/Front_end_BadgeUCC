import { useAuthStore } from '../../store/authStore'

export default function Dashboard() {
  const usuario = useAuthStore((s) => s.usuario)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-slate-500 mt-1">
          Panel de gestión de movilidad e internacionalización
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Total estudiantes</p>
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-800">0</p>
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
          <p className="text-3xl font-semibold text-slate-800">0</p>
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
          <p className="text-3xl font-semibold text-slate-800">0</p>
          <p className="text-xs text-slate-400 mt-1">Certificadas y validadas</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-medium text-slate-700 mb-4">Insignias disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { nombre: 'Pasajero Internacional', nivel: 1, color: 'blue', desc: '2 semestres + Inglés 1' },
            { nombre: 'Estudiante Global', nivel: 2, color: 'amber', desc: 'Humanidades + Institucionales' },
            { nombre: 'Ciudadano Mundial', nivel: 3, color: 'green', desc: '60% créditos + 70 puntos' },
          ].map((insignia) => (
            <div key={insignia.nivel} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm
                ${insignia.color === 'blue' ? 'bg-blue-500' : insignia.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`}>
                {insignia.nivel}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{insignia.nombre}</p>
                <p className="text-xs text-slate-400">{insignia.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
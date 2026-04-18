import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Layout from './components/layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import EstudiantesList from './pages/estudiantes/EstudiantesList'
import EstudianteForm from './pages/estudiantes/EstudianteForm'
import EstudianteDetail from './pages/estudiantes/EstudianteDetail'
import ActividadesList from './pages/actividades/ActividadesList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/estudiantes" element={<EstudiantesList />} />
          <Route path="/dashboard/estudiantes/nuevo" element={<EstudianteForm />} />
          <Route path="/dashboard/estudiantes/:id" element={<EstudianteDetail />} />
          <Route path="/dashboard/estudiantes/:id/editar" element={<EstudianteForm />} />
          <Route path="/dashboard/actividades" element={<ActividadesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Layout from './components/layout/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import EstudiantesList from './pages/estudiantes/EstudiantesList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/estudiantes" element={<EstudiantesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
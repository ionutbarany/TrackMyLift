import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import ExploreRoutines from './pages/ExploreRoutines'
import LogSession from './pages/LogSession'
import MyRoutines from './pages/MyRoutines'
import NotFound from './pages/NotFound'
import Progress from './pages/Progress'
import RoutineDetail from './pages/RoutineDetail'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/routines" element={<MyRoutines />} />
          <Route path="/routines/:id" element={<RoutineDetail />} />
          <Route path="/session" element={<LogSession />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/explore" element={<ExploreRoutines />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  )
}

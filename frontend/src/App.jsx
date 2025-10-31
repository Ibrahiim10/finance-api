import { useQuery } from "@tanstack/react-query"
import { Navigate, Route, Routes } from "react-router"
import RegisterPage from "./pages/auth/RegisterPage"
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/dashboard/DashboardPage"

const App = () => {


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* TODO: Add protected routes */}
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="/" element={<Navigate to='/login' replace />} />
    </Routes>
  )
}

export default App

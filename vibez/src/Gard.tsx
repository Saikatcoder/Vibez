import { useContext, useEffect } from "react"
import HttpInterceptor from "./lib/Htttpinterceptor"
import Context from "./Context"
import { Navigate, Outlet } from "react-router-dom"

const Guard = () => {
  const { session, setsession } = useContext(Context)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await HttpInterceptor.get("/auth/session")
        setsession(data) // user object OR false
      } catch {
        setsession(false)
      }
    }

    getSession()
  }, [])

  if (session === null) {
    return <div>Checking session...</div>
  }

  if (session === false) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default Guard
import { useContext, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import HttpInterceptor from "../lib/Htttpinterceptor"
import Context from "../Context"
import { Skeleton } from "antd"

const AuthGuard = () => {
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
    return <Skeleton active/>
  }

  if (session === false) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AuthGuard
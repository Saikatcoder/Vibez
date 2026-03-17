import { useContext, useEffect } from "react"
import Context from "../Context"
import HttpInterceptor from "../lib/Htttpinterceptor"
import { Navigate, Outlet } from "react-router-dom"
import { Skeleton } from "antd"

const RedirectGuard = () => {
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
    return <Outlet />
  }

  return <Navigate to = '/app' replace />
}

export default RedirectGuard

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState, startTransition } from "react"
import Avatar from "../shared/Avatar"
import Context from "../../Context"
import HttpInterceptor from "../../lib/Htttpinterceptor"
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/fetcher"
import { toast } from "react-toastify"
import CatchError from "../../lib/CatchError"
import { v4 as uuid } from "uuid"

import FriendsOnline from "./friends/FriendsOnline"
import FriendSuggestion from "./friends/FriendSuggestion"
import FriendRequest from "./friends/FriendRequest"

const EightMinutes = 8 * 60 * 1000

const Layout = () => {
  const [mobilePanel, setMobilePanel] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { session, setsession } = useContext(Context)

  
  useEffect(() => {
    startTransition(() => {
      setMobilePanel(false)
    })
  }, [pathname])

  const logout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout")
      navigate("/login")
      toast.success("Logged out")
    } catch (err) {
      CatchError(err)
    }
  }

  const { error } = useSWR("/auth/refresh-token", Fetcher, {
    refreshInterval: EightMinutes,
    shouldRetryOnError: false,
  })

  useEffect(() => {
    if (error) logout()
  }, [error])

  // 🔥 PROFILE IMAGE UPLOAD
  const uploadImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.click()

    input.onchange = async () => {
      if (!input.files) return

      const file = input.files[0]
      const path = `profile-pictures/${uuid()}.${file.name.split(".").pop()}`

      try {
        const { data } = await HttpInterceptor.post("/storage/upload", {
          path,
          type: file.type,
          status: "public-read",
        })

        await HttpInterceptor.put(data.url, file, {
          headers: { "Content-Type": file.type },
        })

        const { data: user } = await HttpInterceptor.put(
          "/auth/profile-picture",
          { path }
        )

        setsession({ ...session, image: user.image })
        mutate("/auth/refresh-token")

        toast.success("Profile updated")
      } catch (err) {
        CatchError(err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">

      
      <div className="w-full max-w-325 mx-auto flex gap-6 px-3">

    
        <aside className="hidden lg:flex w-57.5 flex-col gap-4 sticky top-6 h-fit">

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a] flex items-center gap-3">
            <Avatar
              image={session?.image || "/image/avtar.png"}
              size="md"
              onClick={uploadImage}
            />
            <div>
              <p className="font-medium">{session?.fullname}</p>
              <span className="text-xs text-gray-400">{session?.email}</span>
            </div>
          </div>

          {[
            { href: "/app", label: "Dashboard", icon: "ri-home-5-line" },
            { href: "/app/my-post", label: "Posts", icon: "ri-image-line" },
            { href: "/app/friends", label: "Friends", icon: "ri-user-3-line" },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${
                pathname === item.href
                  ? "bg-[#9acd32] text-black"
                  : "text-gray-400 hover:bg-[#1f1f1f]"
              }`}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          ))}

          <button onClick={logout} className="text-red-400 mt-auto">
            Logout
          </button>
        </aside>

        
        <main className="flex-1 max-w-155 mx-auto p-4 w-full pb-28">
          <Outlet />
        </main>

        <aside className="hidden lg:flex w-75 flex-col gap-5 sticky top-6 h-fit">

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-sm text-gray-400 mb-2">Online</h3>
            <FriendsOnline />
          </div>

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-sm text-gray-400 mb-2">Requests</h3>
            <FriendRequest />
          </div>

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-sm text-gray-400 mb-2">Suggestions</h3>
            <FriendSuggestion />
          </div>
        </aside>
      </div>

      
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#161616] px-4 py-3 flex items-center justify-between border-b border-[#2a2a2a]">

        <div className="flex items-center gap-3">
          <Avatar
            image={session?.image || "/image/avtar.png"}
            size="md"
            onClick={uploadImage}
          />
          <p className="capitalize">{session?.fullname}</p>
        </div>

        <button onClick={logout} className="text-red-400 text-sm flex gap-1">
          Logout <i className="ri-logout-box-r-line"></i>
        </button>
      </div>

      
      <button
        onClick={() => setMobilePanel((prev) => !prev)}
        className="lg:hidden fixed bottom-24 right-4 z-50 
        bg-[#9acd32] text-black p-4 rounded-full shadow-lg"
      >
        <i className="ri-group-line text-xl"></i>
      </button>

     
      {mobilePanel && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobilePanel(false)}
        />
      )}

    
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 lg:hidden
        bg-[#161616] rounded-t-2xl border-t border-[#2a2a2a]
        transition-transform duration-300
        ${mobilePanel ? "translate-y-0" : "translate-y-[90%]"}`}
      >
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-500 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center px-4 pb-2">
          <h2 className="text-sm">Friends</h2>
          <button onClick={() => setMobilePanel(false)}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto space-y-4">
          <FriendsOnline />
          <FriendRequest />
          <FriendSuggestion />
        </div>
      </div>

      {/* 🔥 BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#161616] flex justify-around py-2 border-t border-[#2a2a2a] lg:hidden">

        <Link to="/app" className="flex flex-col items-center text-xs">
          <i className="ri-home-5-line text-xl"></i>
          Home
        </Link>

        <Link to="/app/my-post" className="flex flex-col items-center text-xs">
          <i className="ri-image-line text-xl"></i>
          Posts
        </Link>

        <Link to="/app/friends" className="flex flex-col items-center text-xs">
          <i className="ri-user-3-line text-xl"></i>
          Friends
        </Link>
      </div>
    </div>
  )
}

export default Layout

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

  // ✅ optional stats
  const { data: stats } = useSWR(`/friend/stats`, Fetcher)

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
      CatchError(err, "top-center")
    }
  }

  const { error } = useSWR("/auth/refresh-token", Fetcher, {
    refreshInterval: EightMinutes,
    shouldRetryOnError: false,
  })

  useEffect(() => {
    if (error) logout()
  }, [error])

  // 🔥 upload profile image
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
        CatchError(err, "top-center")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">

      <div className="w-full max-w-7xl mx-auto flex gap-6 px-3">

        {/* 🔥 LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-65 flex-col gap-4 sticky top-6 h-fit">

          {/* PROFILE */}
          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <Avatar
                image={session?.image || "/image/avtar.png"}
                size="lg"
                onClick={uploadImage}
              />
              <div>
                <p className="font-semibold">{session?.fullname}</p>
                <span className="text-xs text-gray-400">{session?.email}</span>
              </div>
            </div>

            {/* STATS */}
            <div className="flex justify-between mt-4 text-center">
              <div>
                <p className="font-bold">{stats?.posts || 0}</p>
                <span className="text-xs text-gray-400">Posts</span>
              </div>
              <div>
                <p className="font-bold">{stats?.friends || 0}</p>
                <span className="text-xs text-gray-400">Friends</span>
              </div>
              <div>
                <p className="font-bold">{stats?.requests || 0}</p>
                <span className="text-xs text-gray-400">Requests</span>
              </div>
            </div>
          </div>

          {/* NAV */}
          {[
            { href: "/app", label: "Dashboard", icon: "ri-home-5-line" },
            { href: "/app/my-post", label: "Posts", icon: "ri-image-line" },
            { href: "/app/friends", label: "Friends", icon: "ri-user-3-line" },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
              ${
                pathname === item.href
                  ? "bg-[#9acd32] text-black"
                  : "text-gray-400 hover:bg-[#1f1f1f]"
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              {item.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="mt-auto py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </aside>

        {/*  MAIN */}
        <main className="flex-1 max-w-[700px] mx-auto p-4 w-full pb-28">
          <Outlet />
        </main>

        {/*  RIGHT SIDEBAR */}
        <aside className="hidden lg:flex w-[300px] flex-col gap-5 sticky top-6 h-fit">

          <div className="bg-[#161616] p-4 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-sm text-gray-400 mb-2">Online</h3>
           <FriendsOnline/>
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

      {/* 🔥 MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#161616] px-4 py-3 flex justify-between border-b border-[#2a2a2a]">
        <p className="font-semibold">Vibez</p>
        <button onClick={logout} className="text-red-400">
          <i className="ri-logout-box-r-line"></i>
        </button>
      </div>

      {/* 🔥 FLOAT BUTTON */}
      <button
        onClick={() => setMobilePanel((prev) => !prev)}
        className="lg:hidden fixed bottom-24 right-4 z-50 
        bg-[#9acd32] text-black p-4 rounded-full shadow-lg"
      >
        <i className="ri-group-line text-xl"></i>
      </button>

      {/* BACKDROP */}
      {mobilePanel && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobilePanel(false)}
        />
      )}

      {/* MOBILE PANEL */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 lg:hidden
        bg-[#161616] rounded-t-3xl border-t border-[#2a2a2a]
        transition-transform duration-300
        ${mobilePanel ? "translate-y-0" : "translate-y-[92%]"}`}
      >
        <div className="flex justify-center py-2">
          <div className="w-12 h-1.5 bg-gray-500 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center px-4 pb-2">
          <h2 className="text-sm font-semibold">Friends Panel</h2>
          <button onClick={() => setMobilePanel(false)}>
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="px-4 pb-4 max-h-[65vh] overflow-y-auto space-y-6">

          <div>
            <h3 className="text-xs text-gray-400 mb-2">Online</h3>
            <FriendsOnline />
          </div>

          <div>
            <h3 className="text-xs text-gray-400 mb-2">Requests</h3>
            <FriendRequest />
          </div>

          <div>
            <h3 className="text-xs text-gray-400 mb-2">Suggestions</h3>
            <FriendSuggestion />
          </div>

        </div>
      </div>

      {/* 🔥 BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#161616] flex justify-around py-2 border-t border-[#2a2a2a] lg:hidden">
        <Link to="/app"><i className="ri-home-5-line text-xl"></i></Link>
        <Link to="/app/my-post"><i className="ri-image-line text-xl"></i></Link>
        <Link to="/app/friends"><i className="ri-user-3-line text-xl"></i></Link>
      </div>
    </div>
  )
}

export default Layout
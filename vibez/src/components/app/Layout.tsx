import { Link, Outlet, useLocation } from "react-router-dom"
import { useState } from "react"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"

const Layout = () => {
  const leftAsideSize = 350
  const rightAsideSize = 350

  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)

  const menu = [
    { href: "/app", label: "Dashboard", icon: "ri-home-line" },
    { href: "/app/my-post", label: "My Posts", icon: "ri-chat-smile-3-line" },
    { href: "/app/friends", label: "Friends", icon: "ri-user-line" },
  ]

  const { pathname } = useLocation()
  const getPathname = (path: string) =>
    path.split("/").pop()?.replace("-", " ").toUpperCase() || "DASHBOARD"

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {(leftOpen || rightOpen) && (
        <div
          onClick={() => {
            setLeftOpen(false)
            setRightOpen(false)
          }}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-white p-6 overflow-auto transition-transform
        ${leftOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        style={{ width: leftAsideSize ,transition:'0.6s'}}
      >
        <div className="h-full rounded-3xl bg-linear-to-t from-[#fbc2eb] to-[#a6c1ee] overflow-hidden">

          {/* AVATAR HEADER */}
          <div
            className="relative flex justify-center py-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/background.jpg')" }}
          >
            <Avatar
              title="Saikat Dutta"
              subtitle="Photographer"
              image="/image/avtar.png"
              titleColor="white"
              subtitleColor="#000"
            />
          </div>

          {/* MENU */}
          <div className="p-6 space-y-2">
            {menu.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setLeftOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/40 hover:text-black"
              >
                <i className={`${item.icon} text-lg`} />
                {item.label}
              </Link>
            ))}

            <button className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/40 hover:text-black">
              <i className="ri-logout-box-r-line text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER SECTION */}
      <section className="min-h-screen p-4 lg:p-8 lg:ml-87.5 lg:mr-87.5">

        {/* MOBILE HEADER */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setLeftOpen(true)}
            className="rounded-full bg-white p-2 shadow"
          >
            <i className="ri-menu-line text-xl" />
          </button>

          <h1 className="text-lg font-bold">{getPathname(pathname)}</h1>

          <button
            onClick={() => setRightOpen(true)}
            className="rounded-full bg-white p-2 shadow"
          >
            <i className="ri-user-line text-xl" />
          </button>
        </div>

        <Card
          title={
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-gray-100 p-2 hover:bg-purple-400">
                <i className="ri-arrow-left-line text-lg" />
              </button>
              <h1 className="text-xl font-bold">
                {getPathname(pathname)}
              </h1>
            </div>
          }
          divider
        >
          <Outlet />
        </Card>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 z-40 h-full bg-white p-5 overflow-auto border-l transition-transform
        ${rightOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0`}
        style={{ width: rightAsideSize, transition:'0.6s' }}
      >
        <Card title="My Friends">
          <div className="mt-4 space-y-3">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-2xl bg-gray-50 p-3 transition-all hover:-translate-y-px hover:bg-white hover:shadow-md"
                >
                  <Avatar
                    size="md"
                    title="Saikat Dutta"
                    image="/image/avtar.png"
                    subtitle={
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    }
                  />

                  <div className="flex gap-2 opacity-80 group-hover:opacity-100">
                  <Link to="/app/chat" className="rounded-full bg-purple-100 p-2 text-green-600 hover:bg-green-500 hover:text-white">
                   <i className="ri-chat-3-line text-sm" />
                  </Link>
                   <Link to="/app/audio-chat" className="rounded-full bg-purple-100 p-2 text-green-600 hover:bg-green-500 hover:text-white">
                      <i className="ri-phone-line text-sm" />
                    </Link>
                    <Link to="/app/video-chat" className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-500 hover:text-white">
                      <i className="ri-video-on-line text-sm" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}

export default Layout

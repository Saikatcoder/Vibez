import { Link } from "react-router-dom"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"

const Layout = () => {
  const leftAsideSize = 350
  const rightAsideSize = 350

  const sectionStyle: React.CSSProperties = {
    width: `calc(100% - ${leftAsideSize + rightAsideSize}px)`,
    marginLeft: leftAsideSize,
  }

  const menu = [
    { href: "/app", label: "Dashboard", icon: "ri-home-line" },
    { href: "/post", label: "My Posts", icon: "ri-chat-smile-3-line" },
    { href: "/friends", label: "Friends", icon: "ri-user-line" },
  ]

  const friends = [
    { name: "Amit Roy", status: "Online", image: "/image/avtar.png" },
    { name: "Rohit Das", status: "Offline", image: "/image/avtar.png" },
    { name: "Sneha Paul", status: "Online", image: "/image/avtar.png" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside
        className="fixed left-0 top-0 h-full bg-white p-6 overflow-auto"
        style={{ width: leftAsideSize }}
      >
        <div className="h-full rounded-2xl bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] overflow-hidden">

          {/* AVATAR SECTION (SAME LOGIC) */}
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
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/30 hover:text-black"
              >
                <i className={`${item.icon} text-lg`} />
                {item.label}
              </Link>
            ))}

            <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/30 hover:text-black">
              <i className="ri-logout-box-r-line text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER SECTION */}
      <section className="p-8 min-h-screen" style={sectionStyle}>
        <Card />
      </section>

      {/* RIGHT SIDEBAR - MY FRIENDS */}
      <aside
        className="fixed right-0 top-0 h-full bg-white p-6 overflow-auto"
        style={{ width: rightAsideSize }}
      >
        <Card title="My Friends">
          <div className="space-y-4">
            {friends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 hover:bg-gray-100"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-800">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.status}</p>
                </div>

                <span
                  className={`h-2 w-2 rounded-full ${
                    friend.status === "Online"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}

export default Layout

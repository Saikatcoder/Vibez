import socket from "../../../lib/socket"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Context from "../../../Context"
import Avatar from "../../shared/Avatar"

const FriendsOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const { session } = useContext(Context)

  const onlineHandler = (users: any[]) => setOnlineUsers(users)

  useEffect(() => {
    socket.on("online", onlineHandler)
     socket.emit("get-online")
    return () => {
      socket.off("online", onlineHandler)
    }
  }, [])

  const users = onlineUsers.filter((u: any) => session && u.id !== session.id)

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-300 font-semibold">Online</h3>
        <span className="text-xs text-gray-500">{users.length}</span>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {users.length === 0 && (
          <p className="text-xs text-gray-500">No one online</p>
        )}

        {users.map((item: any) => (
          <div
            key={item.id}
            className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#1f1f1f] transition"
          >
            {/* LEFT */}
            <Link to={`/app/chat/${item.id}`} className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <Avatar image={item.image || "/image/avtar.png"} size="sm" />
                {/* ONLINE DOT */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ff6a] rounded-full border-2 border-[#161616]" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate capitalize">{item.fullname}</p>
                <p className="text-[11px] text-[#00ff6a]">online</p>
              </div>
            </Link>

            {/* ACTIONS */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <Link
                to={`/app/chat/${item.id}`}
                className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-300 hover:text-[#9acd32]"
                title="Chat"
              >
                <i className="ri-chat-3-line text-sm" />
              </Link>

              <Link
                to="/app/audio-chat"
                className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-300 hover:text-[#9acd32]"
                title="Audio"
              >
                <i className="ri-phone-line text-sm" />
              </Link>

              <Link
                to={`/app/video-chat/${item.id}`}
                className="p-2 rounded-full hover:bg-[#2a2a2a] text-gray-300 hover:text-[#9acd32]"
                title="Video"
              >
                <i className="ri-video-on-line text-sm" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsOnline
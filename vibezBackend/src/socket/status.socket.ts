import { Server } from "socket.io"
import * as cookie from "cookie"
import jwt, { JwtPayload } from "jsonwebtoken"

const onlineUser = new Map()

const StatusSocket = (io: Server) => {
  io.on("connection", (socket) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || ""
      const cookies = cookie.parse(rawCookie)
      const accessToken = cookies.accessToken

      if (!accessToken) throw new Error("AccessToken denied!")

      const userInfo = jwt.verify(
        accessToken,
        process.env.JWT_SECRET_KEY!
      ) as JwtPayload

      // ✅ store user
      onlineUser.set(socket.id, userInfo)

      socket.join(userInfo.id)

      // ✅ SEND CURRENT USERS IMMEDIATELY (IMPORTANT FIX)
      socket.emit("online", Array.from(onlineUser.values()))

      // ✅ BROADCAST TO ALL
      io.emit("online", Array.from(onlineUser.values()))

      // ✅ HANDLE MANUAL REQUEST
      socket.on("get-online", () => {
        socket.emit("online", Array.from(onlineUser.values()))
      })

      socket.on("disconnect", () => {
        onlineUser.delete(socket.id)
        io.emit("online", Array.from(onlineUser.values()))
      })

    } catch (error) {
      socket.disconnect()
    }
  })
}

export default StatusSocket
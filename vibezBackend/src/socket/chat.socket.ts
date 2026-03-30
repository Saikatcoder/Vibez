import { Server } from "socket.io"// 👈 apna user model
import AuthModel from "../model/auth.model"
import { createChat } from "../controller/chat.controller"

const ChatSocket = (io: Server) => {
  io.on("connection", (socket) => {

    socket.on("message",  (payload) => {
      
       createChat({
         ...payload,
        from: payload.from
       })
        // const user = AuthModel.findById(payload.from).select("fullname image")

        io.to(payload.to).emit("message", {
          from: payload.from,
          message: payload.message
        })
    })

  })
}

export default ChatSocket
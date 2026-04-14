import { Server } from "socket.io";

const VideoSocket = (io: Server) => {
 io.on('connection', (socket) => {

   // OFFER
   socket.on("webrtc_offer", ({offer, to})=>{
       io.to(to).emit("webrtc_offer", {
         offer,
         from: socket.id
       })
   })

   // ANSWER
   socket.on("webrtc_answer", ({answer, to})=>{
       io.to(to).emit("webrtc_answer", {
         answer,
         from: socket.id
       })
   })

   // ICE CANDIDATE (NEW 🔥)
   socket.on("ice_candidate", ({candidate, to})=>{
       io.to(to).emit("ice_candidate", {
         candidate,
         from: socket.id
       })
   })

 })
}

export default VideoSocket



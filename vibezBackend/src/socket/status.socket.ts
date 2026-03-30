import { Server } from "socket.io"
import * as cookie from 'cookie'
import jwt, { JwtPayload } from 'jsonwebtoken'
const onlineUser = new Map()

const StatusSocket = (io:Server)=>{
 io.on('connection',(socket)=>{
   try {
    const rawCookie = socket.handshake.headers.cookie || ""
    const cookies = cookie.parse(rawCookie)
    const accessToken = cookies.accessToken
    
    if(!accessToken)
      throw new Error("AccessToekn denied!")
    const userInfo = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as JwtPayload
    onlineUser.set(socket.id ,userInfo)
   socket.join(userInfo.id)
   
   io.emit('online',Array.from(onlineUser.values()))
   socket.on("get-online",()=>{
    
   })
   socket.on('disconnect',()=>{
    onlineUser.delete(socket.id)
    io.emit('online',Array.from(onlineUser.values()))
   })
   
   } catch (error) {
    if(error instanceof Error){
      socket.disconnect()
    }
   }
 })
}

export default StatusSocket


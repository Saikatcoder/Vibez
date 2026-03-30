import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Context from "../../../Context"

const FriendsOnline = () => {
    const [onlineUsers, setOnlineUsers] = useState([])
    const {session} = useContext(Context)
    console.log(onlineUsers)
    const onlineHandler = (users: any)=>{
        setOnlineUsers(users)
    }

    useEffect(()=>{
        socket.on("online", onlineHandler)

        // socket.emit("get-online")
        
        return ()=>{
            socket.off("online", onlineHandler)
        }
    }, [])

    return (
        <Card title="Online friends" divider>
            <div className="space-y-6">
                {
                    session && onlineUsers.filter((item: any)=>item.id !== session.id).map((item: any, index)=>(
                        <div key={index} className="flex">
                            <div className="flex gap-3">
                                <img src="/images/avt.avif" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <h1 className="font-medium mb-1 capitalize">{item.fullname}</h1>
                                    <div className="flex items-center gap-3">
                                        <label className={`capitalize-first text-[10px]${item.status === 'online' ? "text-green-400" : "text-gray-300"} font-medium`}>{item.status}</label>
                                        <Link to={`/app/chat/${item.id}`}>
                                            <i className="ri-chat-ai-line text-rose-400"></i>
                                        </Link>

                                        <Link to="/app/chat">
                                            <i className="ri-phone-line text-amber-400"></i>
                                        </Link>

                                        <Link to="/app/chat">
                                            <i className="ri-video-on-ai-line text-green-400"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Card>
    )
}
export default FriendsOnline


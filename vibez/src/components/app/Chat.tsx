import Avatar from '../shared/Avatar'
import Input from '../shared/Input'
import Button from '../shared/Button'
import { useContext, useEffect, useRef, useState, type ChangeEvent, type FC } from 'react'
import Form from '../shared/Form'
import socket from '../../lib/socket'
import Context from '../../Context'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import CatchError from '../../lib/CatchError'
import {v4 as uuid} from 'uuid'
import Card from '../shared/Card'
import moment from 'moment'
import Fetcher from '../../lib/fetcher'
import HttpInterceptor from '../../lib/Htttpinterceptor'
import SmallButton from '../shared/Smallbutton'

interface MessageRecievedInterface {
    from: string
    message: string
}

interface AttachmentUiInterface {
    file: {
        path: string
        type: string
    }
}

const AttachmentUi: FC<AttachmentUiInterface> = ({file})=>{
    if(file.type.startsWith("video/"))
        return (
            <video className='w-full' controls src={file.path}></video>
        )

    if(file.type.startsWith("image/"))
        return (
            <img className='w-full' src={file.path} />
        )
    
    return (
        <Card>
            <i className="ri-file-line text-5xl"></i>
        </Card>
    )
}

const Chat = () => {
    const chatContainer = useRef<HTMLDivElement | null>(null)
    const [chats, setChats] = useState<any>([])
    const {session} = useContext(Context)
    const {id} = useParams()
    const {data} = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null)
    
    const messageHandler = (messageRecieved: MessageRecievedInterface)=>{
        setChats((prev: any)=>[...prev, messageRecieved])
    }

    const attachmentHandler = (messageRecieved: any)=>{
        setChats((prev: any)=>[...prev, messageRecieved])
    }

    // Listening all sockets event
    useEffect(()=>{
        socket.on("message", messageHandler)
        socket.on("attachment", attachmentHandler)

        return ()=>{
            socket.off("message", messageHandler)
            socket.off("attachment", attachmentHandler)
        }
    }, [])

    // Setting old chats
    useEffect(()=>{
        if(data)
        {
            setChats(data)
        }
    }, [data])

    // Setup scrollbar position
    useEffect(()=>{
        const chatDiv = chatContainer.current
        if(chatDiv)
        {
            chatDiv.scrollTop = chatDiv.scrollHeight
        }
    }, [chats])

    const sendMessage = (values: any)=>{
        const payload = {
            from: session,
            to: id,
            message: values.message
        }
        setChats((prev: any)=>[...prev, payload])
        socket.emit("message", payload)
    }

    const fileSharing = async (e: ChangeEvent<HTMLInputElement>)=>{   
        try {
            const input = e.target
    
            if(!input.files)
                return
    
            const file = input.files[0]
            const ext = file.name.split(".").pop()
            const filename = `${uuid()}.${ext}`
            const path = `chats/${filename}`

            const payload = {
                path,
                type: file.type,
                status: "private"
            }

            const options = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const {data} = await HttpInterceptor.post("/storage/upload", payload)
            await HttpInterceptor.put(data.url, file, options)
            socket.emit("attachment", {
                from: session,
                to: id,
                message: filename,
                file: {
                    path,
                    type: file.type
                }
            })
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const download = async (path: string)=>{
        try {
            const filename: any = path.split("/").pop()
            const {data} = await HttpInterceptor.post("/storage/download", {path})
            const a = document.createElement("a")
            a.href = data.url
            a.download = filename
            a.click()
            a.remove()
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    return (
        <div>
            <div className='h-[450px] overflow-auto space-y-12 pr-6 relative' ref={chatContainer}>
                {
                    chats.map((item: any, index: number)=>(
                        <div className='space-y-12' key={index}>
                            {
                                (item.from.id === session.id || item.from._id === session.id) ?
                                <div className='flex gap-4 items-start'>
                                    <Avatar 
                                        image={session.image || '/images/avt.avif' }
                                        size='md' 
                                    />
                                    <div className='gap-3 flex flex-col relative bg-rose-50 px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100'>
                                        <h1 className='font-medium text-black capitalize'>You</h1>
                                        { item.file && <AttachmentUi file={item.file} /> }
                                        <label>{item.message}</label>
                                        { 
                                            item.file && 
                                            <div>
                                                <SmallButton onClick={()=>download(item.file.path)} type='success' icon='download-line'>Download</SmallButton>
                                            </div>
                                        }
                                        <div className='text-gray-500 text-right text-xs'>
                                            {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                        </div>
                                        <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-50"></i>
                                    </div>
                                </div>
                                :
                                <div className='flex gap-4 items-start'>
                                    <div className='relative bg-violet-50 px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100'>
                                        <h1 className='font-medium text-black capitalize'>{item.from.fullname}</h1>
                                        { item.file && <AttachmentUi file={item.file} /> }
                                        <label>{item.message}</label>
                                        <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-50"></i>
                                        { 
                                            item.file && 
                                            <div>
                                                <SmallButton onClick={()=>download(item.file.path)} type='danger' icon='download-line'>Download</SmallButton>
                                            </div>
                                        }
                                        <div className='text-gray-500 text-right text-xs'>
                                            {moment().format('MMM DD, YYYY hh:mm:ss A')}
                                        </div>
                                    </div>
                                    <Avatar 
                                        image={item.from.image || '/images/avt.avif'} 
                                        size='md' 
                                    />
                                </div>
                            }

                        </div>
                    ))
                }
            </div>
            <div className='p-3'>
                <div className='flex items-center gap-4'>
                    <Form className='flex gap-4 flex-1' onValue={sendMessage} reset>
                        <Input name="message" placeholder='Type your message here' />
                        <Button type="secondary" icon="send-plane-fill" loading={false}>Send</Button>
                    </Form>
                    <button className='relative w-12 h-12 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-400 hover:text-white'>
                        <i className="ri-attachment-2"></i>
                        <input onChange={fileSharing} type="file" className='opacity-0 w-full h-full absolute top-0 left-0 rounded-full' />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Chat

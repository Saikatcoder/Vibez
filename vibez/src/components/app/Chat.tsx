import Avatar from '../shared/Avatar'
import Input from '../shared/Input'
import { useContext, useEffect, useRef, useState, type ChangeEvent, type FC } from 'react'
import Form from '../shared/Form'
import socket from '../../lib/socket'
import Context from '../../Context'
import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'
import CatchError from '../../lib/CatchError'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import Fetcher from '../../lib/fetcher'
import HttpInterceptor from '../../lib/Htttpinterceptor'
import SmallButton from '../shared/Smallbutton'

interface AttachmentUiInterface {
  file: {
    path: string
    type: string
  }
}

const AttachmentUi: FC<AttachmentUiInterface> = ({ file }) => {
  if (!file?.path) return null

  if (file.type.startsWith('video/')) {
    return (
      <video
        className='w-full rounded-lg mt-2'
        controls
        src={file.path}
      />
    )
  }

  if (file.type.startsWith('image/')) {
    return (
      <img
        className='w-full rounded-lg mt-2'
        src={file.path}
      />
    )
  }

  return (
    <div className='bg-[#1f1f1f] p-6 rounded-lg flex justify-center mt-2'>
      <i className='ri-file-line text-4xl text-gray-400'></i>
    </div>
  )
}

const Chat = () => {
  const chatContainer = useRef<HTMLDivElement | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const { session } = useContext(Context)
  const { id } = useParams()
  const { data } = useSWR(id ? `/chat/${id}` : null, id ? Fetcher : null)

  const S3_URL = "https://vibez-network.s3.ap-southeast-1.amazonaws.com"

  
  const messageHandler = (msg: any) => {
    setChats((prev) => [...prev, msg])
  }

  const attachmentHandler = (msg: any) => {
    setChats((prev) => [...prev, msg])
  }

  useEffect(() => {
    socket.on('message', messageHandler)
    socket.on('attachment', attachmentHandler)

    return () => {
      socket.off('message', messageHandler)
      socket.off('attachment', attachmentHandler)
    }
  }, [])

 
  useEffect(() => {
    if (data) setChats(data)
  }, [data])

 
  useEffect(() => {
    const chatDiv = chatContainer.current
    if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight
  }, [chats])

  
  const sendMessage = (values: any) => {
    const payload = {
      from: session,
      to: id,
      message: values.message,
    }

    setChats((prev) => [...prev, payload])
    socket.emit('message', payload)
  }

  const fileSharing = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return

      const file = e.target.files[0]
      const ext = file.name.split('.').pop()
      const filename = `${uuid()}.${ext}`
      const path = `chats/${filename}`

      const { data } = await HttpInterceptor.post('/storage/upload', {
        path,
        type: file.type,
        status: 'public-read',
      })

      await HttpInterceptor.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      const fullUrl = `${S3_URL}/${path}`

      const payload = {
        from: session,
        to: id,
        message: filename,
        file: {
          path: fullUrl,
          type: file.type,
        },
      }

      
      setChats((prev) => [...prev, payload])

      socket.emit('attachment', payload)

    } catch (err) {
      CatchError(err)
    }
  }

  return (
    <div className='flex flex-col h-[75vh] bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl overflow-hidden'>

      {/* HEADER */}
      <div className='flex items-center justify-between p-4 border-b border-[#2a2a2a] bg-[#161616]'>
        <div className='flex items-center gap-3'>
          <Avatar image='/image/avtar.png' size='sm' />
          <div>
            <p className='text-sm font-semibold'>Chat User</p>
            <span className='text-xs text-[#9acd32]'>online</span>
          </div>
        </div>

        <div className='flex gap-3 text-gray-400'>
          <Link to="/app/audio-chat">
            <i className="ri-phone-line"></i>
          </Link>
          <Link to="/app/video-chat">
            <i className="ri-video-on-line"></i>
          </Link>
        </div>
      </div>

      {/* CHAT BODY */}
      <div ref={chatContainer} className='flex-1 overflow-y-auto p-4 space-y-4'>
        {chats.map((item: any, index: number) => {
          const isMe =
            item.from?.id === session.id ||
            item.from?._id === session.id

          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-[#9acd32] text-black'
                    : 'bg-[#1f1f1f] text-white'
                }`}
              >
                {!isMe && (
                  <p className='text-xs text-gray-400 mb-1'>
                    {item.from?.fullname}
                  </p>
                )}

                {item.file && <AttachmentUi file={item.file} />}

                {!item.file && (
                  <p className='text-white'>{item.message}</p>
                )}

                <div className='text-[10px] text-right mt-1 text-gray-400'>
                  {moment().format('hh:mm A')}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* INPUT */}
      <div className='p-3 border-t border-[#2a2a2a] bg-[#161616] flex items-center gap-3'>
        <Form className='flex gap-3 flex-1' onValue={sendMessage} reset>
          <Input name='message' placeholder='Type a message...' />
          <SmallButton type='secondary' icon='send-plane-fill'>
            Send
          </SmallButton>
        </Form>

        <label className='relative w-10 h-10 flex items-center justify-center bg-[#1f1f1f] rounded-full cursor-pointer hover:bg-[#9acd32] hover:text-black'>
          <i className='ri-attachment-2'></i>
          <input
            onChange={fileSharing}
            type='file'
            className='absolute inset-0 opacity-0 cursor-pointer'
          />
        </label>
      </div>
    </div>
  )
}

export default Chat
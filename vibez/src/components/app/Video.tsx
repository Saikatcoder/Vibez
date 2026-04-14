import { useContext, useEffect, useRef, useState } from "react"
import CatchError from "../../lib/CatchError"
import Context from "../../Context"
import Avatar from "../shared/Avatar"
import { toast } from "react-toastify"
import socket from "../../lib/socket"
import { useParams } from "react-router-dom"
import { notification } from "antd"


const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
}


interface onOfferIneterface {
  offer : RTCSessionDescriptionInit,
  from : string
}

interface onAnswerInterface {
  answer : RTCSessionDescriptionInit,
  from : string
}
interface OnCandidateInterface {
  candidate : RTCIceCandidateInit,
  from : string
}

type CallType = 'pending' | 'calling' | 'incoming' | 'talking' | 'end'

const Video = () => {
  const {session} = useContext(Context)
  const {id} = useParams()
  const [notify , notifyUi] = notification.useNotification()


  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const webRtcRef = useRef<RTCPeerConnection | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const [isVideoShareing, setIsVideoSharing] = useState(false)
  const [isScreenShareing, setIsScreenShareing] = useState(false)
  const [isAudioShareing, setIsAudioShareing] = useState(false)
  const [callState, setCallState] = useState<CallType>('pending')

 const toggleScreen = async ()=>{
        try {
            const localVideo = localVideoRef.current

            if(!localVideo)
                return

            if(!isScreenShareing)
            {
                const stream = await navigator.mediaDevices.getDisplayMedia({video: true})

                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsScreenShareing(true)
            }
            else {
                const localStream = localStreamRef.current
                if(!localStream)
                    return

                localStream.getTracks().forEach((track)=>{
                    track.stop()
                })

                localVideo.srcObject = null
                localStreamRef.current = null
                setIsScreenShareing(false)
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }
  
   const toggleAudio = () => {
  try {
    const localStream = localStreamRef.current
    if (!localStream) return

    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio")

    if (!audioTrack) return

   
    audioTrack.enabled = !audioTrack.enabled

   
    setIsAudioShareing(audioTrack.enabled)

    toast.info(
      audioTrack.enabled ? "Microphone ON" : "Microphone OFF",
      { position: "top-center", autoClose: 2000 }
    )

  } catch (error) {
    CatchError(error)
  }
}

  const toggleVideo = async ()=>{
        try {
            const localVideo = localVideoRef.current

            if(!localVideo)
                return

            if(!isVideoShareing)
            {
                const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    
                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsVideoSharing(true)
                setIsAudioShareing(true)
            }
            else {
                const localStream = localStreamRef.current
                if(!localStream)
                    return

                localStream.getTracks().forEach((track)=>{
                    track.stop()
                })

                localVideo.srcObject = null
                localStreamRef.current = null
                setIsVideoSharing(false)
                setIsAudioShareing(false)
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }

const toggleFullScreen = (type : 'local' | 'remote') => {
  try {
    if(!isVideoShareing && !isScreenShareing) 
      return toast.warning(`plese start your video first `, {position: "top-center", autoClose: 2000})

      const videoContainer = (type === 'local' ? localVideoContainerRef.current : remoteVideoContainerRef.current)
    if(!videoContainer) return

    if(!document.fullscreenElement){
       videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
  } catch (error) {
    CatchError(error)
  }
}

const webRtcConnection = ()=>{ 
 webRtcRef.current = new RTCPeerConnection(config)

 const localStream = localStreamRef.current
 
 if(!localStream) return
 
 localStream.getTracks().forEach((track)=> {
  webRtcRef.current?.addTrack(track, localStream)
 });

 const rtc = webRtcRef.current
 rtc.onicecandidate = (event)=>{
   console.log("conected candidate ", event.candidate)
 }
  rtc.onconnectionstatechange = ()=>{
    console.log("connection state ", webRtcRef.current?.connectionState)
  }

  rtc.ontrack =(event)=>{
    // when we get stream from other peer then set that stream to remote video
    const remortSterm = event.streams[0]
    const remortVideo = remoteVideoRef.current
    if(!remortSterm || !remortVideo) return

    remortVideo.srcObject = remortSterm
  }
 
}



const endCall = async() => {
 alert("call ended")
}

const startCall = async() => {
  try {
    if(!isVideoShareing && !isScreenShareing)
      return toast.warning(`plese start your video first `, {position: "top-center", autoClose: 2000})
   
    webRtcConnection()
    
    if(!webRtcRef.current) return
     
    const offer = await webRtcRef.current?.createOffer()
    await webRtcRef.current?.setLocalDescription(offer!)
    setCallState('calling')
    notify.open({
      message : 'saikat',
      description : 'Calling...',
      placement : "top",
      duration : 20,
      actions : [
       <div key ='calls' className="space-x-2">
         <button  onClick={endCall} className="bg-red-500 text-white px-3 py-1 rounded-full">
          End Call
        </button>
       </div>
      ]
    })
  //  sending call request to other user
    socket.emit("webrtc_offer", {offer, to:id})
  } catch (error) {
    CatchError(error)
  }
}


const onOffer = async (payload: onOfferIneterface) => {
  setCallState('incoming')

  notify.open({
    message: "Incoming Call",
    description: `${payload.from} is calling you`,
    duration: 20,
    placement: "top",
    actions: [
      <div key="call-actions" className="space-x-2">
        <button
        onClick={()=>accept(payload)}
          className="bg-green-500 text-white px-3 py-1 rounded-full"
        >
          Accept
        </button>

        <button
          onClick={endCall}
          className="bg-red-500 text-white px-3 py-1 rounded-full"
        >
          Reject
        </button>
      </div>
    ]
  })
}

const accept = async (payload : onOfferIneterface) => {
  try {

    webRtcConnection()

    if(!webRtcRef.current) return

    const offer = new RTCSessionDescription(payload.offer)
    await webRtcRef.current.setRemoteDescription(offer)

    const answer = await webRtcRef.current.createAnswer()
    await webRtcRef.current.setLocalDescription(answer)

    socket.emit("webrtc_answer", {
      answer,
      to: payload.from
    })

    setCallState('talking')
    notify.destroy()

  } catch (error) {
    CatchError(error)
  }
}

const onConnect = async(payload: OnCandidateInterface)=>{
 try {
   if(!webRtcRef.current) return

 const Candidate = new RTCIceCandidate(payload.candidate)
  await webRtcRef.current.addIceCandidate(Candidate)

  
 } catch (error) {
  CatchError(error)
 }
}

const onAnswer = async(payload: onAnswerInterface)=>{
  try {
    if(!webRtcRef.current) return
   
   const answer = new RTCSessionDescription(payload.answer)

    await webRtcRef.current.setRemoteDescription(answer)
    setCallState('talking')
    notify.destroy()
  } catch (error) {
    CatchError(error)
  }
}
useEffect(()=>{
  toggleVideo()
  socket.on("webrtc_answer", onConnect)
  socket.on("webrtc_offer", onOffer)
  socket.on("answer",onAnswer)
  return()=>{
    socket.off("webrtc_offer", onOffer)
    socket.off("webrtc_answer", onConnect)
    socket.off("answer",onAnswer)
  }
},[])

useEffect(()=>{
if(callState=== 'pending')
  return
 
if(!audio.current)
{
  audio.current = new Audio()
}
if(callState === 'calling' || callState === 'incoming')
{
  audio.current.pause()
  audio.current.src = '/ringtone.mp3'
  audio.current.currentTime = 0
  audio.current.load()
  audio.current.play()
}

if(callState === 'talking')
{
  audio.current.pause()
  audio.current.currentTime = 0
}

return()=>{
  audio.current?.pause()
  audio.current!.currentTime = 0
  audio.current = null
}
},[callState])

 return (
   <div className="h-screen w-full bg-black flex flex-col">
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain" 
        />

        <div className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-full">
          <p className="text-white text-sm">Rahul Kumar</p>
        </div>

        
        <button
          onClick={() => toggleFullScreen('remote')}
          className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-full text-white"
        >
          <i className="ri-fullscreen-line"></i>
        </button>

  
        <div className="absolute bottom-24 right-3 w-28 sm:w-36 md:w-44 aspect-video bg-black rounded-xl overflow-hidden border border-[#2a2a2a]">

          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="bg-gray-800 absolute bottom-1 left-1 flex items-center gap-1 px-2 py-1 rounded-full">
            <Avatar image={session?.image || "/image/avtar.png"} size="sm" />
            <span className="text-xs text-white capitalize ">{session?.fullname}</span>
          </div>

          <button
            onClick={() => toggleFullScreen('local')}
            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white"
          >
            <i className="ri-fullscreen-line text-xs"></i>
          </button>
        </div>
      </div>

  
      <div className="bg-[#111] px-4 py-3 flex gap-3 overflow-x-auto">
        <div className="w-28 aspect-video flex items-center justify-center bg-[#161616] border border-[#2a2a2a] rounded-lg">
          <button className="text-gray-400 hover:text-white text-2xl">
            <i className="ri-user-add-line"></i>
          </button>
        </div>
      </div>

      <div className="bg-[#111] py-3 flex justify-center gap-6">

        <button
          onClick={toggleVideo}
          className={`${isVideoShareing ? 'bg-green-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
        >
          {
            isVideoShareing ? 
            <i className="ri-video-on-line"></i> :
            <i className="ri-video-off-line text-white"></i>
          }
        </button>

       <button
  onClick={toggleAudio}
  className={`${isAudioShareing ? 'bg-green-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
>
  {
    isAudioShareing ?
    <i className="ri-mic-line"></i> :
    <i className="ri-mic-off-line text-white"></i>
  }
</button>
        <button
          onClick={toggleScreen}
          className={`${isScreenShareing ? 'bg-blue-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
        >
         {
          isScreenShareing ? 
           <i className="ri-tv-2-line"></i> : 
            <i className="ri-chat-off-line text-white"></i>
         }
        </button>

        {/* <button onClick={endCall} className="bg-red-500 w-12 h-12 rounded-full flex flex-col items-center justify-center text-white text-sm">
         End <i className="ri-phone-fill rotate-180"></i>
        </button> */}
        <button onClick={startCall} className="bg-green-500  w-12 h-12 rounded-full flex flex-col items-center justify-center text-white text-sm">
          Call <i className="ri-phone-fill rotate-12"></i>
        </button>
      </div>
      {notifyUi}
    </div>
  )
}

export default Video


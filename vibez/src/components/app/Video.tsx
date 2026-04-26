import { useContext, useEffect, useRef, useState } from "react"
import CatchError from "../../lib/CatchError"
import Context from "../../Context"
import Avatar from "../shared/Avatar"
import { toast } from "react-toastify"
import socket from "../../lib/socket"
import { Link, useNavigate, useParams } from "react-router-dom"
import {  Modal, notification } from "antd"
import Button from "../shared/Button"


const config = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
}

interface OnOfferInterface {
    offer: RTCSessionDescriptionInit
    from: string
}

interface OnAnswerInterface {
    answer: RTCSessionDescriptionInit
    from: string
}


interface OnCandidateInterface {
    candidate: RTCIceCandidateInit
    from: string
}

type CallType = "pending" | "calling" | "incomming" | "talking" | "end"
type AudioSrcType = "/sound/ring.mp3" | "/sound/reject.mp3" | "/sound/busy.mp3"
function getCallTiming(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hrs}:${mins}:${secs}`;
}

const Video = () => {
    const navigate = useNavigate()
   const [open, setOpen] = useState(false)
   const {session, liveActiveSession} = useContext(Context)
   const {id} = useParams()
   const [notify, notifyUi] = notification.useNotification()

    const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const rtc = useRef<RTCPeerConnection | null>(null)
    const audio = useRef<HTMLAudioElement | null>(null)

    const [isVideoSharing, setIsVideoSharing] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isMic, setIsMic] = useState(false)
    const [status, setStatus] = useState<CallType>("pending")
    const [timer, setTimer] = useState(0)

    const stopAudio = ()=>{
        if(!audio.current)
            return

        const player = audio.current
        player.pause()
        player.currentTime = 0
    }

    const playAudio = (src : AudioSrcType, loop: boolean= false)=>{
        stopAudio()
        if(!audio.current)
         audio.current = new Audio()

        const player = audio.current
        player.src = src
        player.loop = loop
        player.load()
        player.play()   
    }

    const toggleScreen = async ()=>{
        try {
            const localVideo = localVideoRef.current

            if(!localVideo)
                return

            if(!isScreenSharing)
            {
                const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
    
                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsScreenSharing(true)
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
                setIsScreenSharing(false)
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const toggleVideo = async ()=>{
        try {
            const localVideo = localVideoRef.current

            if(!localVideo)
                return

            if(!isVideoSharing)
            {
                const stream = await navigator.mediaDevices.getUserMedia({video: true})
    
                localVideo.srcObject = stream
                localStreamRef.current = stream
                setIsVideoSharing(true)
                setIsMic(true)
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
                setIsMic(false)
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const toggleMic = ()=>{
        try {
            const localStream = localStreamRef.current
            if(!localStream)
                return

            const audioTrack = localStream.getTracks().find((tracks)=>tracks.kind === "audio")
            if(audioTrack)
            {
                audioTrack.enabled = !audioTrack.enabled
                setIsMic(audioTrack.enabled)
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const toggleFullScreen = (type: 'local' | 'remote')=>{
        try {
            if(!isVideoSharing && !isScreenSharing)
                return toast.warn("Please start your video first", {position: 'top-center'})

            const videoContainer = (type === "local" ? localVideoContainerRef.current : remoteVideoContainerRef.current)
            if(!videoContainer)
                return

            if(!document.fullscreenElement)
            {
                videoContainer.requestFullscreen()
            }
            else {
                document.exitFullscreen()
            }
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const webRtcConnection = ()=>{
        rtc.current = new RTCPeerConnection(config)
        const localStream = localStreamRef.current
        
        if(!localStream)
            return
        
        localStream.getTracks().forEach((track)=>{
            rtc.current?.addTrack(track, localStream)
        })

        rtc.current.onicecandidate = (e)=>{
            if(e.candidate)
            {
                socket.emit("candidate", {candidate: e.candidate, to: id})
            }
        }

        rtc.current.onconnectionstatechange = ()=>{
            if(!rtc.current)
                return
        }

        rtc.current.ontrack = (e)=>{
            const remoteStream = e.streams[0]
            const remoteVideo = remoteVideoRef.current

            if(!remoteStream || !remoteVideo)
                return

            remoteVideo.srcObject = remoteStream

            const videoTracks = remoteStream.getVideoTracks()[0]
            if(videoTracks)
            {
                videoTracks.onmute = ()=>{
                    console.log("video off")
                    remoteVideo.style.display = "none"
                }

                videoTracks.onunmute = ()=>{
                    remoteVideo.style.display = "block"
                }

                videoTracks.onended = ()=>{
                    remoteVideo.srcObject = null
                    remoteVideo.style.display = "none"
                }
            }
        }
    }

    const startCall = async ()=>{
        try {
            if(!isVideoSharing && !isScreenSharing)
                return toast("Start your video first", {position: 'top-center'})

            webRtcConnection()

            if(!rtc.current)
                return

            const offer = await rtc.current.createOffer()
            await rtc.current.setLocalDescription(offer)
            setStatus("calling")
            playAudio("/sound/ring.mp3", true)
            notify.open({
                message: liveActiveSession.fullname,
                description: "Calling...",
                duration: 30,
                placement: "bottomRight",
                onClose : stopAudio,
                actions: [
                   <button key="end" className='bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500' onClick={endCallFromLocal}>End call</button>
                ]
            })
            socket.emit("offer", {offer, to: id})
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const accept = async (payload: OnOfferInterface)=>{
        try {
            webRtcConnection()

            if(!rtc.current)
                return

            const offer = new RTCSessionDescription(payload.offer)
            await rtc.current.setRemoteDescription(offer)

            const answer = await rtc.current.createAnswer()
            await rtc.current.setLocalDescription(answer)

            notify.destroy()
            setStatus("talking")
            stopAudio()
            socket.emit("answer", {answer, to: id})
        }
        catch(err)
        {
            CatchError(err)
        }
    }
    

    const redirectOnCallEnd = ()=>{
        setOpen(false)
       navigate("/app")
    }

    const endStreaming = ()=>{
        localStreamRef.current?.getTracks().forEach((track)=>{
            track.stop()
        })
        if(localVideoRef.current)
        {
            localVideoRef.current.srcObject = null
        }
        if(remoteVideoRef.current)        {
            remoteVideoRef.current.srcObject = null
        }
        rtc.current?.close()
        rtc.current = null
    }

    // too end call on local computer
    const endCallFromLocal = ()=>{
        setStatus("end")
        playAudio("/sound/reject.mp3")
        notify.destroy()
        socket.emit("end", {to: id})
        endStreaming()
        setOpen(true)
    }

    // too end call on remote computer
    const onEndCallRemote = ()=>{
        setStatus("end")
        playAudio("/sound/reject.mp3")
        notify.destroy()
        endStreaming()
        setOpen(true)
    }

    // Event listerners
    const onOffer = (payload: OnOfferInterface)=>{  
        setStatus("incomming")
        notify.open({
            message: liveActiveSession.fullname,
            description: "Incomming call...",
            duration: 30,
            placement: "bottomRight",
            actions: [
                <div key="calls" className='space-x-4'>
                    <button className='bg-green-400 px-3 py-1 rounded text-white hover:bg-green-500' onClick={()=>accept(payload)}>Accept</button>
                    <button className='bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500' onClick={endCallFromLocal}>Reject</button>
                </div>
            ]
        })
    }

    // Connect both user via webrtc
    const onCandidate = async (payload: OnCandidateInterface)=>{
        try {
            if(!rtc.current)
                return

            const candidate = new RTCIceCandidate(payload.candidate)
            await rtc.current.addIceCandidate(candidate)
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    const onAnswer = async (payload: OnAnswerInterface)=>{
        try {
            if(!rtc.current)
                return

            const answer = new RTCSessionDescription(payload.answer)
            await rtc.current.setRemoteDescription(answer)

            setStatus("talking")
            stopAudio()
            notify.destroy()
        }
        catch(err)
        {
            CatchError(err)
        }
    }

    useEffect(()=>{
        toggleVideo()
        socket.on("offer", onOffer)
        socket.on("candidate", onCandidate)
        socket.on("answer", onAnswer)
        socket.on("end", onEndCallRemote)
        
        return ()=>{
            socket.off("offer", onOffer)
            socket.off("candidate", onCandidate)
            socket.off("answer", onAnswer)
            socket.off("end", onEndCallRemote)
        }
    }, [])

    useEffect(()=>{
    let interval : ReturnType<typeof setInterval> | undefined

    if(status === 'talking')
    {
        interval = setInterval (()=>{
          setTimer((prev)=> prev+1)
        },1000)
    }
    return ()=> {
        if(interval)
            clearInterval(interval)
    } 
        
    },[status])
   
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
              <p className="text-white text-sm">{session?.fullname}</p>
              {status === "talking" && <p className="text-white text-xs">{getCallTiming(timer)}</p>}
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
          className={`${isVideoSharing ? 'bg-green-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
        >
          {
            isVideoSharing ? 
            <i className="ri-video-on-line"></i> :
            <i className="ri-video-off-line text-white"></i>
          }
        </button>

       <button
  onClick={toggleMic}
  className={`${isMic ? 'bg-green-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
>
  {
    isMic ?
    <i className="ri-mic-line"></i> :
    <i className="ri-mic-off-line text-white"></i>
  }
</button>
        <button
          onClick={toggleScreen}
          className={`${isScreenSharing ? 'bg-blue-500' : 'bg-red-700'} w-12 h-12 rounded-full flex items-center justify-center text-white`}
        >
         {
          isScreenSharing ? 
           <i className="ri-tv-2-line"></i> : 
            <i className="ri-chat-off-line text-white"></i>
         }
        </button>
          {
                        status === "talking" &&
                        <label>{getCallTiming(timer)}</label>
                    }
                    {
                        (status === "pending" || status === "end") &&
                        <button onClick={startCall} className="bg-green-500  w-12 h-12 rounded-full flex flex-col items-center justify-center text-white text-sm">
          Call <i className="ri-phone-fill rotate-12"></i>
        </button>
                    }

                    {
                        status === "talking" &&
                        <button onClick={endCallFromLocal} className="bg-green-500  w-12 h-12 rounded-full flex flex-col items-center justify-center text-white text-sm">
                          end <i className="ri-phone-fill rotate-12"></i>
                    </button>
                    }
      </div>
      <Modal open={open} footer={null} centered maskClosable onCancel={redirectOnCallEnd}>
           <div className="text-center space-y-4">
             <h1 className="text-2xl font-semibold">Call Disconnect</h1>
            <Button onClick={redirectOnCallEnd} icon="ri-arrow-left-line" type="danger" loading={false}>
             Thank You !
            </Button>
           </div>
      </Modal>
      {notifyUi}
    </div>
  )
}

export default Video


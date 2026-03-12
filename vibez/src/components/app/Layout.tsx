import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import Context from "../../Context"
import HttpInterceptor from "../../lib/Htttpinterceptor"
import { v4 as uuid } from "uuid"
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/fetcher"
import { toast } from "react-toastify"
import CatchError from "../../lib/CatchError"

const EightMinutes = 8*60*1000

const Layout = () => {
  const leftAsideSize = 350
  const rightAsideSize = 350

  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  const Navigate = useNavigate()

  const menu = [
    { href: "/app", label: "Dashboard", icon: "ri-home-line" },
    { href: "/app/my-post", label: "My Posts", icon: "ri-chat-smile-3-line" },
    { href: "/app/friends", label: "Friends", icon: "ri-user-line" },
  ]

  const { pathname } = useLocation()
  const getPathname = (path: string) =>
        path.split("/").pop()?.replace("-", " ").toUpperCase() || "DASHBOARD"

  const { session, setsession } = useContext(Context)

  const logout = async ()=>{
    try {
      await HttpInterceptor.post('/auth/logout')
      Navigate("/login")
      toast.success("Logged out successfully")
    } catch (error) {
      CatchError(error)
      toast.error("Failed to logout")
    }
  }

  const {error } = useSWR('/auth/refresh-token',  Fetcher, {
    refreshInterval: EightMinutes ,
    shouldRetryOnError: false
  })
  
  useEffect(()=>{
    if(error)
    {
      logout()
    }
  },[error])

 const uploadImage = () => {

 const input = document.createElement("input")
 input.type = "file"
 input.accept = "image/*"
 input.click()

 input.onchange = async () => {

   if(!input.files) return

   const file = input.files[0]

   if(!file.type.startsWith("image/")){
      alert("Only image allowed")
      return
   }

   const extension = file.type.split("/")[1]
   const path = `profile-picture/${uuid()}.${extension}`

   const payload = {
      path,
      type:file.type
   }

   try{

      const options = {
        headers : {
          "Content-Type" : file.type
        }
      }

      const {data} = await HttpInterceptor.post('/storage/upload', payload)

      await HttpInterceptor.put(data.url, file, options)

      const {data:user} = await HttpInterceptor.put('/auth/profile-picture',{path})

      setsession((prev:any)=>({
        ...prev,
        image:user.image
      }))

      mutate("/auth/refresh-token")      
      toast.success("Profile picture updated successfully")
   }catch(err){
      console.log(err)
      toast.error("Failed to update profile picture")
   }
 }
}


  return (
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {(leftOpen || rightOpen) && (
        <div
          onClick={() => {
            setLeftOpen(false)
            setRightOpen(false)
          }}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-white p-6 overflow-auto transition-transform
        ${leftOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        style={{ width: leftAsideSize ,transition:'0.6s'}}
      >
        <div className="h-full rounded-3xl bg-linear-to-t from-[#fbc2eb] to-[#a6c1ee] overflow-hidden">

          {/* AVATAR HEADER */}
          <div
            className="relative flex justify-center py-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/background.jpg')" }}
          > 
          {session && (
            <Avatar
                title={session.fullname}   
                subtitle={session.email}
                image={session.image || "/image/avtar.png"}
                titleColor="white"
                subtitleColor="#000"
                onClick={uploadImage}
            />
          )}
           
          </div>

          {/* MENU */}
          <div className="p-6 space-y-2">
            {menu.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setLeftOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/40 hover:text-black"
              >
                <i className={`${item.icon} text-lg`} />
                {item.label}
              </Link>
            ))}

            <button onClick={logout} className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-white/40 hover:text-black">
              <i className="ri-logout-box-r-line text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER SECTION */}
      <section className="min-h-screen p-4 lg:p-8 lg:ml-87.5 lg:mr-87.5">

        {/* MOBILE HEADER */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setLeftOpen(true)}
            className="rounded-full bg-white p-2 shadow"
          >
            <i className="ri-menu-line text-xl" />
          </button>

          <h1 className="text-lg font-bold">{getPathname(pathname)}</h1>

          <button
            onClick={() => setRightOpen(true)}
            className="rounded-full bg-white p-2 shadow"
          >
            <i className="ri-user-line text-xl" />
          </button>
        </div>

        <Card
          title={
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-gray-100 p-2 hover:bg-purple-400">
                <i className="ri-arrow-left-line text-lg" />
              </button>
              <h1 className="text-xl font-bold">
                {getPathname(pathname)}
              </h1>
            </div>
          }
          divider
        >
          <Outlet />
        </Card>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 z-40 h-full bg-white p-5 overflow-auto border-l transition-transform space-y-8
        ${rightOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0`}
        style={{ width: rightAsideSize, transition:'0.6s' }}
      >
        <div className="w-100 overflow-auto h-60 ">
          <Card title="Suggestion" divider={false}>
            <div className="space-y-3 " >
               {
                Array(20).fill(0).map((_,index)=>(
                  <div key={index} className=" flex gap-4">
                    <img src="/image/avtar.png" alt="Suggested User Avatar" className="w-16 h-16 rounded object-cover"/>
                    <div className="">
                      <h1 className="text-black font-medium">Saikat Dutta</h1>
                      <button className="space-y bg-green-500 py-2 px-9 text-white rounded">Follow
                      <i className="ri-user-add-line ml-2"></i>
                      </button>
                    </div>
                  </div>
                ))
               }
            </div>
          </Card>
        </div>
        <Card title="My Friends">
          <div className="mt-4 space-y-3 " >
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-2xl bg-gray-50 p-3 transition-all hover:-translate-y-px hover:bg-white hover:shadow-md"
                >
                  <Avatar
                    size="md"
                    title="Saikat Dutta"
                    image="/image/avtar.png"
                    subtitle={
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    }
                  />

                  <div className="flex gap-2 opacity-80 group-hover:opacity-100">
                  <Link to="/app/chat" className="rounded-full bg-purple-100 p-2 text-green-600 hover:bg-green-500 hover:text-white">
                   <i className="ri-chat-3-line text-sm" />
                  </Link>
                   <Link to="/app/audio-chat" className="rounded-full bg-purple-100 p-2 text-green-600 hover:bg-green-500 hover:text-white">
                      <i className="ri-phone-line text-sm" />
                    </Link>
                    <Link to="/app/video-chat" className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-500 hover:text-white">
                      <i className="ri-video-on-line text-sm" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}



export default Layout



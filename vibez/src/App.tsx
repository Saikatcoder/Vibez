import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'
import 'font-awesome/css/font-awesome.min.css'
import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Post from "./components/app/Post"
import Video from "./components/app/Video"
import Audio from "./components/app/Audio"
import Chat from "./components/app/Chat"
import Notfound from "./components/Notfound"
import Context from "./Context"
import { useState } from "react"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AuthGuard from "./guard/AuthGuard"
import RedirectGuard from "./guard/RedirectGuard"
import FriendList from "./components/app/friends/FriendList"


const App = () => {
  const [session, setsession] = useState(null)

  return (
    <Context.Provider value={{ session, setsession }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectGuard/>}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<AuthGuard/>}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-post" element={<Post />} />
            <Route path="friends" element={<FriendList />} />
            <Route path="video-chat/:id" element={<Video />} />
            <Route path="audio-chat/:id" element={<Audio />} />
            <Route path="chat/:id" element={<Chat />} />
          </Route>
          </Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App
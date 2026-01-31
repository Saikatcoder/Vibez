import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'
import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Post from "./components/app/Post"
import Friends from "./components/app/Friends"
import Video from "./components/app/Video"
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-post" element={<Post />} />
            <Route path="friends" element={<Friends />} />
            <Route path="video-chat" element={<Video />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

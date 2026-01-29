import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'
import Signup from "./components/Signup"
import Login from "./components/Login"
import Home from "./components/Home"
import Layout from "./components/app/Layout"
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

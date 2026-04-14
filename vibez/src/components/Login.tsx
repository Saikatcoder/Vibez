import { Link, useNavigate } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"
import HttpInterceptor from "../lib/Htttpinterceptor"
import { toast } from "react-toastify"
import CatchError from "../lib/CatchError"
import type { FormDataType } from "./shared/Form"
import Form from "./shared/Form"

const Login = () => {
  const navigate = useNavigate()

  const login = async (value: FormDataType) => {
    try {
      await HttpInterceptor.post("/auth/login", value)
      navigate("/app")
      toast.success("Login successful")
    } catch (err: unknown) {
      CatchError(err)
      toast.error("Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl h-[550px] rounded-3xl overflow-hidden flex shadow-2xl">

        {/* LEFT SIDE */}
        <div className="flex-1 bg-[#f5f5f5] flex items-center justify-center p-8">
          <div className="w-full max-w-sm ">

            <h1 className="text-2xl font-semibold mb-6 text-center text-black">
              Sign In to <span className="italic font-bold">VIBEZ</span>
            </h1>

            <Form className="space-y-4" onValue={login} reset={false}>
              
              <Input
                name="email"
                placeholder="Enter Username"
              />

              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                />
                <i className="ri-eye-line absolute right-4 top-3 text-gray-500 cursor-pointer"></i>
              </div>

              <p className="text-sm text-gray-600 cursor-pointer hover:underline">
                Forgot Password
              </p>

              <Button loading={false}>
                Login
              </Button>
            </Form>

            <p className="text-sm text-gray-600 text-center mt-6">
              Want To Create A New Account?{" "}
              <Link to="/signup" className="underline font-medium">
                Sign Up
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex flex-1 bg-black items-center justify-center relative">

          <div className="text-center text-white z-10">
            <h1 className="text-6xl font-extrabold tracking-widest italic">
              Vibez
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Not Just A Platform, It's A VYBE
            </p>
          </div>

          {/* Glow effect */}
          <div className="absolute w-[300px] h-[300px] bg-white opacity-10 blur-3xl rounded-full"></div>
        </div>

      </div>
    </div>
  )
}

export default Login
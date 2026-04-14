import { Link, useNavigate } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/Htttpinterceptor"
import CatchError from "../lib/CatchError"
import { toast } from "react-toastify"

const Signup = () => {
  const navigate = useNavigate()

  const signup = async (values: FormDataType) => {
    try {
      await HttpInterceptor.post("/auth/signup", values)
      toast.success("Account created successfully")
      navigate("/login")
    } catch (error) {
      CatchError(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl h-[600px] rounded-3xl overflow-hidden flex shadow-2xl">

        {/* LEFT SIDE (FORM) */}
        <div className="flex-1 bg-[#f5f5f5] flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            <h1 className="text-2xl font-semibold mb-2 text-center text-black">
              Create Account
            </h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              Join VYBE and start your journey
            </p>

            <Form reset className="space-y-4" onValue={signup}>

              <Input
                type="text"
                name="fullname"
                placeholder="Full name"
              />

              <Input
                type="email"
                name="email"
                placeholder="Email address"
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
              />

              <Input
                type="text"
                name="mobile"
                placeholder="Mobile number"
              />

              <Button loading={false}>
                Sign Up
              </Button>
            </Form>

            <p className="text-sm text-gray-600 text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="underline font-medium">
                Login
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE (BRANDING) */}
        <div className="hidden md:flex flex-1 bg-black items-center justify-center relative">

          <div className="text-center text-white z-10">
            <h1 className="text-6xl font-extrabold tracking-widest italic">
              VYBE
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Not Just A Platform, It's A VYBE
            </p>
          </div>

          {/* Glow Effect */}
          <div className="absolute w-[300px] h-[300px] bg-white opacity-10 blur-3xl rounded-full"></div>
        </div>

      </div>
    </div>
  )
}
export default Signup
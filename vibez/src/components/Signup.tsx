import { Link } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/Htttpinterceptor"

const Signup = () => {
  const signup = async (values:FormDataType)=>{
    try {
    const {data}= await HttpInterceptor.post("/auth/signup", values)
    console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-green-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-green-600">
          Create Account 
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Join us and get started
        </p>

        {/* FORM */}
        <Form className="mt-6 space-y-4" onValue={signup}>
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
          type= "text"
            name="mobile"
            placeholder="Mobile number"
          />

          <Button
            type="success"
          >
            Sign Up
          </Button>
        </Form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup

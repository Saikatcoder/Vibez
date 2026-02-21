import { Link } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/Htttpinterceptor"
import { toast } from "react-toastify"
import axios from "axios"

const Login = () => {
 const login = async (value: FormDataType) => {
  try {
    const { data } = await HttpInterceptor.post("/auth/login", value);
    console.log("LOGIN SUCCESS", data);
    toast.success("Login successful");
  } catch (err: unknown) {
    if(axios.isAxiosError(err)){
      return toast.error(err.response?.data?.message || "Login failed");
    }
    if (err instanceof Error) {
      toast.error(err.message || "Login failed");
    } else {
      toast.error("network error");
    }
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-2xl font-bold text-center text-green-600">
          Welcome Back 
        </h1>
        <Form className="mt-6 space-y-4" onValue={login}>
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

          <Button>Login</Button>
        </Form>
         
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
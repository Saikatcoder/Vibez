import { Link,  useNavigate } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"
import Form, { type FormDataType } from "./shared/Form"
import HttpInterceptor from "../lib/Htttpinterceptor"
import { toast } from "react-toastify"
import CatchError from "../lib/CatchError"

const Login = () => {
  const navigate = useNavigate()
 const login = async (value: FormDataType) => {
  try {
    await HttpInterceptor.post("/auth/login", value);
    navigate("/app");
    toast.success("Login successful");
  } catch (err: unknown) {
    CatchError(err);
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
        <span className="text-blue-500 text-sm ">Forgot Password?</span>

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
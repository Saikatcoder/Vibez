
import { Link } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-green-600">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Login to continue
        </p>

        {/* FORM */}
        <form className="mt-6 space-y-4">
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

          <Button
            type="success"
          >
            Login
          </Button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login


import { Link } from "react-router-dom"
import Input from "./shared/Input"
import Button from "./shared/Button"

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-green-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-green-600">
          Create Account 🚀
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Join us and get started
        </p>

        {/* FORM */}
        <form className="mt-6 space-y-4">
          <Input
            type="text"
            name="name"
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

          <Button
            type="success"
          >
            Sign Up
          </Button>
        </form>

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

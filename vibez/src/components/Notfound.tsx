import { Link } from "react-router-dom"

const Notfound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-pink-100 px-4">

      <div className="text-center max-w-md animate-fadeIn">

        {/* 404 TEXT */}
        <h1 className="text-[120px] font-extrabold text-gray-800 leading-none
          animate-bounceSlow">
          404
        </h1>

        {/* MESSAGE */}
        <h2 className="mt-2 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-500">
          Sorry bhai 😅 jo page tum dhoondh rahe ho  
          wo ya to move ho chuka hai ya exist nahi karta.
        </p>

        {/* BUTTON */}
        <Link
          to="/"
          className="
            inline-block mt-6 px-6 py-3 rounded-xl
            bg-indigo-600 text-white font-medium
            hover:bg-indigo-700 transition
            shadow-lg
          "
        >
          Go Back Home
        </Link>

        {/* DECORATIVE ICON */}
        <div className="mt-8 text-5xl animate-float">
          🚀
        </div>

      </div>
    </div>
  )
}

export default Notfound

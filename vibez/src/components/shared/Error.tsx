import type { FC } from "react"

interface ErrorInterface {
  message: string
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <div className="animate__animated animate__fadeIn w-full flex justify-center mt-4">
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm max-w-md w-full">

        <div className="text-xl">
          <i className="ri-error-warning-line"></i>
        </div>

        <div className="text-sm font-medium">
          {message}
        </div>

      </div>
    </div>
  )
}

export default Error
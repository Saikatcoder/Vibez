import type { FC } from "react"
import "remixicon/fonts/remixicon.css"

const ButtonModel = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-blue-500 hover:bg-blue-600 text-white",
  danger: "bg-rose-500 hover:bg-rose-600 text-white",
  warning: "bg-amber-500 hover:bg-amber-600 text-white",
  dark: "bg-zinc-800 hover:bg-zinc-900 text-white",
  success: "bg-green-400 hover:bg-green-500 text-white",
  info: "bg-cyan-500 hover:bg-cyan-600 text-white",
}

interface SmallButtonInterface {
  children?: string
  type?: "primary" | "secondary" | "danger" | "warning" | "dark" | "success" | "info"
  onClick?: () => void
  icon?: string
  loading?: boolean
}

const SmallButton: FC<SmallButtonInterface> = ({
  children = "Submit",
  type = "primary",
  onClick,
  icon,
  loading = false,
}) => {

  if (loading)
    return (
      <button
        disabled
        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 text-xs rounded opacity-80 cursor-not-allowed"
      >
        <i className="ri-loader-4-line animate-spin"></i>
        Loading
      </button>
    )

  return (
    <button
      className={`flex items-center gap-1 px-3 py-1 text-xs rounded ${ButtonModel[type]}`}
      onClick={onClick}
    >
      {icon && <i className={`ri-${icon}`}></i>}
      {children}
    </button>
  )
}

export default SmallButton
import type { FC } from "react"

interface InputInterface {
  name: string
  type?: string
  placeholder?: string
}

const Input: FC<InputInterface> = ({ name, placeholder, type = "text" }) => {
  return (
    <input
      className="
        w-full px-4 py-2 rounded-xl 
        bg-[#1f1f1f] 
        border border-[#2a2a2a] 
        text-white 
        placeholder:text-gray-400 
        focus:outline-none 
        focus:ring-2 focus:ring-[#9acd32] 
        transition
      "
      placeholder={placeholder}
      name={name}
      type={type}
    />
  )
}

export default Input
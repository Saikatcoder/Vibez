import type { FC } from "react"


interface InputInterface {
  name: string
  type?: string
  placeholder?: string
}

const Input: FC<InputInterface> = ({name, placeholder, type="text"}) => {
  return (
    <input 
        className='border border-gray-300 rounded-xl px-3 py-2 w-full text-black'
        placeholder={placeholder}
        name={name}
        type={type}
    />
  )
}

export default Input
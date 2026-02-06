import type { FC, ReactElement } from "react"


interface CardInterface {
  children?: ReactElement
  title?: string ,
  footer?: ReactElement,
  divider?: boolean,
  bgColor?: string
}

const Card: FC<CardInterface> = ({children, title, footer, divider=false, bgColor="bg-white"}) => {
  return (
    <div className={`${bgColor} shadow-lg px-5 py-4 rounded-lg border border-gray-100 space-y-2`}>
      {
        title &&
        <h1 className='text-lg font-semibold'>{title}</h1>
      }
      {
        divider &&
        <div className='border-b border-b-gray-100 -mx-5 my-4' />
      }
      {
        children &&
        <div className='text-gray-500'>{children}</div>
      }
      {
          footer &&
          <div className='mt-4'>
              {footer}
          </div>
      }
    </div>
  )
}

export default Card
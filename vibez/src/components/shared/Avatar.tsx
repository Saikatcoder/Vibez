import type { FC } from "react"

interface AvatarInterface{
    title?: string
    subtitle?: string
    image?: string
    titleColor ? : string
    subtitleColor?: string
}
const Avatar :FC<AvatarInterface> = ({title, subtitle="subtitle is missing", image, titleColor="#000000", subtitleColor="#000000"}) => {
  return (
 <div className="flex gap-3 items-center flex-col">
             {image && 
              <img src={image} alt="avatar" className="w-30 h-30 bg-gray-400 border-white border-2 rounded-full object-cover "/>
             }
             {
               (title  &&  subtitle ) && 
                <div className="flex flex-col">
              <h1 className="font-medium" style={{color:titleColor}}>{title}</h1>
               <label htmlFor="" style={{color:subtitleColor}}>{subtitle}</label>
               </div>
             }
      </div>
  )
}

export default Avatar

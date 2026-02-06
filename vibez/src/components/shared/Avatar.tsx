import type { FC, ReactNode } from "react"

interface AvatarInterface {
  title?: string
  subtitle?: ReactNode
  image?: string
  titleColor?: string
  subtitleColor?: string
  size?: "sm" | "md" | "lg"
  key?: string | number 
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-24 h-24",
}

const Avatar: FC<AvatarInterface> = ({
  size = "lg",
  title,
  subtitle ,
  image,
  titleColor = "#000",
  subtitleColor = "#666",
  key=0,
}) => {
  return (
    <div className="flex items-center gap-3" key={key}>
      {image && (
        <img
          src={image}
          alt="avatar"
          className={`${sizeMap[size]} rounded-full border-2 border-white object-cover`}
        />
      )}

      {(title || subtitle) && (
        <div className="flex flex-col">
          {title && (
            <h1
              className={`${size === "lg" ? "text-lg" : "text-sm"} font-medium`}
              style={{ color: titleColor }}
            >
              {title}
            </h1>
          )}

          {subtitle && (
            <div className="text-xs" style={{ color: subtitleColor }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Avatar

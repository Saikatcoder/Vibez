import Avatar from "../shared/Avatar"
import Button from "../shared/Button"

const Audio = () => {
  return (
    <div className="group relative flex h-[calc(100vh-120px)] w-full items-center justify-center rounded-2xl bg-linear-to-br from-indigo-900 to-purple-900">

      <div className="absolute top-6 text-center text-white z-10">
        <p className="text-sm opacity-80">Audio Call</p>
        <h2 className="mt-1 text-lg font-semibold">Saikat Dutta</h2>
      </div>

      <div className="flex flex-col items-center gap-4 z-10">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
          <Avatar image="/image/avtar.png" size="lg" />
        </div>
        <p className="text-white/80 text-sm">Speaking...</p>
      </div>

      <div
        className="
          absolute inset-0
          flex items-end justify-center
          opacity-0
          transition-all duration-300
          group-hover:opacity-100
          z-20
        "
      >
        <div className="mb-4 flex justify-evenly w-full py-3 backdrop-blur-md bg-white/10">
          <button className="video-btn text-purple-500 hover:bg-purple-500 hover:text-white rounded-full w-10 h-10">
            <i className="ri-mic-line text-lg" />
          </button>
          <button className="video-btn bg-red-500 text-white hover:bg-red-600 rounded-full w-10 h-10">
            <i className="ri-phone-fill rotate-135 text-lg" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-20 sm:hidden z-30">
      </div>
    </div>
  )
}

export default Audio

import Avatar from "../shared/Avatar"
import Button from "../shared/Button"

const Video = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

     
      <div className="group relative w-full overflow-hidden rounded-2xl bg-black shadow-xl">
        <div className="relative w-full pb-[56.25%]">
          <video className="absolute inset-0 h-full w-full object-cover" />
        </div>


        <div className="absolute top-4 left-4 rounded-full bg-gray-500 text-white px-3 py-1 text-xs  backdrop-blur">
          <Avatar size="sm" subtitle="Saikat" image="/image/avtar.png" subtitleColor="white" />
        </div>
         <div
          className="
            pointer-events-none
            absolute inset-0
            flex items-end justify-center
            opacity-0
            transition-all duration-300
            group-hover:pointer-events-auto
            group-hover:opacity-100
          "
        >
          <div className="mb-4 flex justify-evenly rounded-full  w-full  py-3 backdrop-blur-md">
            <button className="video-btn text-purple-500 hover:bg-purple-500 hover:text-white rounded-full w-10 h-10">
              <i className="ri-mic-line text-lg" />
            </button>        
            <button className="video-btn text-green-500 hover:bg-green-500 hover:text-white rounded-full w-10 h-10">
              <i className="ri-video-on-line text-lg" />
            </button>
            <button className="video-btn text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-full w-10 h-10">
              <i className="ri-tv-2-line text-lg" />
            </button>
            <button className="video-btn bg-red-500 text-white hover:bg-red-600 rounded-full w-10 h-10">
              <i className="ri-phone-fill rotate-135 text-lg" />
            </button>
          </div>
            <button className="video-btn rounded-full w-10 h-10 mb-4 pr-5">
              <i className="ri-fullscreen-exit-line text-lg" />
            </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
         <div className="group relative w-full overflow-hidden rounded-2xl bg-black shadow-xl">
        <div className="relative w-full pb-[56.25%]">
          <video className="absolute inset-0 h-full w-full object-cover" />
        </div>


        <div className="absolute top-4 left-4 rounded-full bg-gray-500 text-white px-3 py-1 text-xs  backdrop-blur">
          <Avatar size="sm" subtitle="Saikat" image="/image/avtar.png" subtitleColor="white" />
        </div>
      </div>

      <div className="group relative w-full overflow-hidden rounded-2xl bg-black shadow-xl flex flex-col justify-center">
        <Button icon="user-add-line" type="dark"/>
      </div>
      </div>
      
      <div className="mt-6 flex justify-center sm:hidden">
        <Button  icon="close-circle-fill" type="danger">
          End Call
        </Button>
      </div>
    </div>
  )
}

export default Video




import useSWR, { mutate } from "swr"
import Error from "../../shared/Error"
import HttpInterceptor from "../../../lib/Htttpinterceptor"
import CatchError from "../../../lib/CatchError"
import Avatar from "../../shared/Avatar"
import Fetcher from "../../../lib/fetcher"

const Friends = () => {
  const { data, error, isLoading } = useSWR(
    "/friend/fetch-friends",
    Fetcher
  )

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>
  }

  if (error) {
    return <Error message={error.message} />
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No friends found</p>
  }

  const unFriend = async (id: string) => {
    try {
      await HttpInterceptor.delete(`/friend/${id}`)

   
      mutate("/friend/fetch-friends")
    } catch (error) {
      CatchError(error)
    }
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((item: any) => (
        <div
          key={item._id}
          className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center text-center hover:bg-[#1f1f1f] transition"
        >
     
          <div className="relative">
            <Avatar
              image={item.friend.image || "/image/avtar.png"}
              size="lg"
            />

            
            {item.friend.isOnline && (
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-[#00ff6a] rounded-full border-2 border-[#161616]" />
            )}
          </div>

          
          <h2 className="mt-3 text-sm font-semibold capitalize text-white">
            {item.friend.fullname}
          </h2>

         
          <p className="text-xs text-gray-400 mt-1">
            {item.status === "accepted" ? "Friend" : "Requested"}
          </p>

          {item.status === "accepted" ? (
            <button
              onClick={() => unFriend(item._id)}
              className="mt-3 w-full py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Unfriend
            </button>
          ) : (
            <button
              className="mt-3 w-full py-2 rounded-lg text-sm font-medium bg-[#9acd32] text-black"
            >
              <i className="ri-check-double-line mr-1"></i>
              Requested
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Friends
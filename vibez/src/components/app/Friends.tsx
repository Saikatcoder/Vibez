import useSWR, { mutate } from "swr"
import Card from "../shared/Card"
import Fetcher from "../../lib/fetcher"
import Error from "../shared/Error"
import { Skeleton } from "antd"
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/Htttpinterceptor"

const Friends = () => {
  const {data, error, isLoading} = useSWR("/friend/fetch-friends",Fetcher)
  if(isLoading)
    return<Skeleton active/>
  if(error)
    return <Error message={error.message}/>
const unFriend =async(id: string)=>{
  try {
    await HttpInterceptor.delete(`/friend/${id}`)
    mutate("/friend")

  } catch (error) {
    CatchError(error)
  }
}
  return (
    <div
      className="
        grid gap-5
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
      "
    >
      {
        data.map((item: any, index: number) => (
        <Card
          key={index}
        >
          <div className="flex flex-col items-center p-5">

            {/* AVATAR */}
            <img
              src={item.friend.image || "/image/avtar.png"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            {/* NAME */}
            <h2 className="mt-3 text-base font-semibold text-gray-900">
              {item.friend.fullname}
            </h2>

            {item.status === "accepted" ? <button
            onClick={()=>unFriend(item._id)}
              className="
                mt-4 w-full py-2 rounded-lg
                text-sm font-medium
                bg-blue-500 text-white
                hover:bg-blue-600 transition
              "
            >
              UnFriend
            </button>
            :
           <button
              className="
                mt-4 w-full py-2 rounded-lg
                text-sm font-medium
                bg-green-500 text-white
                hover:bg-green-600 transition
              "
            >
              <i className="ri-check-double-line"></i>
             Request Send
            </button>
            }
            

          </div>
        </Card>
      ))}
    </div>
  )
}

export default Friends

import useSWR, { mutate } from "swr"
import { Empty, Skeleton } from "antd"
import { useState } from "react"
import { toast } from "react-toastify"
import Fetcher from "../../../lib/fetcher"
import HttpInterceptor from "../../../lib/Htttpinterceptor"
import CatchError from "../../../lib/CatchError"
import Error from "../../shared/Error"
import Avatar from "../../shared/Avatar"
import SmallButton from "../../shared/Smallbutton"


interface LoadingInterface {
  state: boolean
  index: null | number
}

const FriendSuggestion = () => {
  const [loading, setLoading] = useState<LoadingInterface>({ state: false, index: null })

  const { data, error, isLoading } = useSWR('/friend/suggestion', Fetcher)

  const addFriend = async (id: string, index: number) => {
    try {
      setLoading({ state: true, index })
      await HttpInterceptor.post('/friend/add-friend', { friend: id })
      toast.success('Request sent', { position: 'top-center' })
      mutate('/friend/fetch-friends')
      mutate('/friend/suggestion')
    } catch (err) {
      CatchError(err, 'top-center')
    } 
  }

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-300 font-semibold">Suggestions</h3>
        <span className="text-xs text-gray-500">{data?.length || 0}</span>
      </div>

      {isLoading && <Skeleton active />}
      {error && <Error message={error.message} />}

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {data && data.length === 0 && (
          <Empty description={<span className="text-gray-500">No suggestions</span>} />
        )}

        {data && data.map((item: any, index: number) => (
          <div
            key={item._id}
            className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#1f1f1f] transition"
          >
            
            <div className="flex items-center gap-3 min-w-0">
              <Avatar image={item.image || "/image/avtar.png"} size="sm" />

              <div className="min-w-0">
                <p className="text-sm font-medium truncate capitalize">{item.fullname}</p>
                <p className="text-[11px] text-gray-500">Suggested for you</p>
              </div>
            </div>
          
            <SmallButton
              onClick={() => addFriend(item._id, index)}
              type="secondary"
              icon="user-add-line"
              loading={loading.state && loading.index === index}
            >
              Add
            </SmallButton>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendSuggestion




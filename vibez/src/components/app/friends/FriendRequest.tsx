import useSWR, { mutate } from "swr"
import { Avatar, Empty, Skeleton } from "antd"
import { useState } from "react"
import moment from "moment"
import { toast } from "react-toastify"
import Fetcher from "../../../lib/fetcher"
import HttpInterceptor from "../../../lib/Htttpinterceptor"
import CatchError from "../../../lib/CatchError"
import Error from "../../shared/Error"
import SmallButton from "../../shared/Smallbutton"


interface LoadingInterface {
  state: boolean
  index: null | number
}

const FriendRequest = () => {
  const [loading, setLoading] = useState<LoadingInterface>({ state: false, index: null })

  const { data, error, isLoading } = useSWR('/friend/request', Fetcher)

  const accept = async (id: string, index: number) => {
    try {
      setLoading({ state: true, index })
      await HttpInterceptor.put(`/friend/${id}`, { status: 'accepted' })
      toast.success('Friend request accepted', { position: 'top-center' })
      mutate('/friend/request')
      mutate('/friend')
    } catch (err) {
      CatchError(err)
    } finally {
      setLoading({ state: false, index: null })
    }
  }

  return (
    <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-300 font-semibold">Requests</h3>
        <span className="text-xs text-gray-500">{data?.length || 0}</span>
      </div>

      {isLoading && <Skeleton active />}
      {error && <Error message={error.message} />}

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {data && data.length === 0 && <Empty description={<span className="text-gray-500">No requests</span>} />}

        {data && data.map((item: any, index: number) => (
          <div
            key={item._id}
            className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#1f1f1f] transition"
          >
            {/* USER */}
            <div className="flex items-center gap-3 min-w-0">
              <Avatar image={item.user.image || "/image/avtar.png"} size="sm" />

              <div className="min-w-0">
                <p className="text-sm font-medium truncate capitalize">{item.user.fullname}</p>
                <p className="text-[11px] text-gray-500">
                  {moment(item.createdAt).fromNow()}
                </p>
              </div>
            </div>

            {/* ACTION */}
            <SmallButton
              onClick={() => accept(item._id, index)}
              type="secondary"
              icon="user-add-line"
              loading={loading.state && loading.index === index}
            >
              Accept
            </SmallButton>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendRequest
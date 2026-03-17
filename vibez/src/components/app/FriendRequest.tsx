import Fetcher from "../../lib/fetcher"
import Card from "../shared/Card"
import useSWR, { mutate } from "swr"
import { Empty, Skeleton } from "antd"
import Error from "../shared/Error"
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/Htttpinterceptor"
import { useState } from "react"
import moment from "moment"
import SmallButton from "../shared/Smallbutton"
import { toast } from "react-toastify"

interface LoadingInterface{
    state:boolean
    index : null | number
}

const FriendRequest = () => {
  const [loding , setloding] = useState<LoadingInterface>({state:false, index:null})
   const {data, error, isLoading} =  useSWR('/friend/request', Fetcher)
   const acceptedFriendRequest = async (id:string, index:number)=>{
     try {
        setloding({state:true , index})
        await HttpInterceptor.put(`/friend/${id}`,{status : "accepted"})
        toast.success("friend request accepted",{position:"top-center"})
        mutate('/friend/request')
        mutate('/friend')
     } catch (error) {
        CatchError(error)
     }finally{
        setloding({state:false, index:null})
     }
   }
  return (
      <div className="w-100 overflow-auto h-60 ">
          <Card title="Friend's Request" divider={false}>
          { isLoading && <Skeleton active/> }
          {error && <Error message={error.message}/>}
          {
            data &&  <div className="space-y-3 " >
               {
                data && data.map((item: any,index:number)=>(
                  <div key={index} className=" flex gap-4">
                    <img 
                    src={item.user.image || "/image/avtar.png"}
                     alt="Suggested User Avatar" 
                     className="w-16 h-16 rounded object-cover"/>
                    <div className="">
                      <h1 className="text-black font-medium capitalize">{item.user.fullname}</h1>
                      <small>{moment(item.createdAt).format('DD MMM, YYYY')}</small>
                    <SmallButton 
                    onClick={()=>acceptedFriendRequest(item._id, index)} 
                    type="secondary" 
                    icon="user-add-line" 
                    loading={loding.state && loding.index === index}>
                      Accepted
                      </SmallButton>
                    </div>
                  </div>
                ))
               }
               {
                (data && data.length === 0) 
                &&
                <Empty/>
               }
            </div>
          }
           
          </Card>
        </div>
  )
}

export default FriendRequest


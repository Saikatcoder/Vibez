import Fetcher from "../../lib/fetcher"
import Card from "../shared/Card"
import useSWR from "swr"
import { Skeleton } from "antd"
import Error from "../shared/Error"
import Button from "../shared/Button"
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/Htttpinterceptor"
import { useState } from "react"

interface LoadingInterface{
    state:boolean
    index : null | number
}
const FriendSuggestion = () => {
   const [loding , setloding] = useState<LoadingInterface>({state:false, index:null})
   const {data, error, isLoading} =  useSWR('/friend/suggestion', Fetcher)

   const sendFriendRequest = async (id:string, index:number)=>{
     try {
        setloding({state:true , index})
       const {data }=  await HttpInterceptor.post("/friend/add-friend",{friend: id})
       console.log(data)
     } catch (error) {
        CatchError(error)
     }finally{
        setloding({state:false, index:null})
     }
   }
  return (
      <div className="w-100 overflow-auto h-60 ">
          <Card title="Suggestion" divider={false}>
          { isLoading && <Skeleton active/> }
          {error && <Error message={error.message}/>}
          {
            data &&  <div className="space-y-3 " >
               {
                data && data.map((item: any,index:number)=>(
                  <div key={index} className=" flex gap-4">
                    <img 
                    src={item.image || "/image/avtar.png"}
                     alt="Suggested User Avatar" 
                     className="w-16 h-16 rounded object-cover"/>
                    <div className="">
                      <h1 className="text-black font-medium capitalize">{item.fullname}</h1>
                    <Button onClick={()=>sendFriendRequest(item._id, index)} type="success" icon="user-add-line" size="sm" loading={loding.state && loding.index === index}>Add Friend</Button>
                    </div>
                  </div>
                ))
               }
            </div>
          }
           
          </Card>
        </div>
  )
}

export default FriendSuggestion

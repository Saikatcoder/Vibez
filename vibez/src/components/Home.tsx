// import { useRazorpay } from "react-razorpay";
// import type { RazorpayOrderOptions } from "react-razorpay";
// import Button from "./shared/Button";
// import CatchError from "../lib/CatchError";
// import HttpInterceptor from "../lib/Htttpinterceptor";
// const env = import.meta.env
// const Home = () => {
//   const {Razorpay} = useRazorpay()

//   const pay = async ()=>{
//     try {
//       const data = await HttpInterceptor.post("/payment/order",{amount: 500})
//       const options : RazorpayOrderOptions = {
//         key :env.VITE_RAZORPAY_KEY_ID,
//         name: 'Vibez-Network',
//         amount :data.amount,
//         currency:'INR',
//         order_id: data.id,
//         handler : (data)=>{
//           console.log(data)
//         }
//       }
//      const rzp = new Razorpay(options)
//      rzp.open()
//     } catch (error) {
//       CatchError(error)
//     }
//   }
//   return (
//     <div>
//      <Button loading={false} onClick={pay}>paynow</Button>
//     </div>
//   )
// }

// export default Ho
const Home = () => {
  return (
    <div>
      hello world
    </div>
  )
}

export default Home

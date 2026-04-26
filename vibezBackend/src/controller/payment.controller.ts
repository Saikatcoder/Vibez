// import { Request, Response } from "express"
// import Razorpay from "razorpay"
// import { catchError, TryError } from "../util/error"
// import crypto from "crypto"
// import fs from "fs"

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZOORPAY_KEY_SECRET
// })

// export const createOrder = async(req: Request, res:Response)=>{
//     try {
//         const amount = req.body?.amount
//         if(!amount){
//             throw TryError('Amount is required',400)
//         }
//         const payload = {
//             amount : (amount*100),
//             currency : process.env.CURRENCY!,
//             receipt : `rcp_${Date.now()}`
//         }
//       const orders = await razorpay.orders.create(payload)
//       res.json(orders)
//     } catch (error) {
//         catchError(error, res, 'Failed to create order')
//     }
    
// }


// export const webhook = async(req: Request, res: Response)=>{
//     try {
//         const body = req.body
//         const signature = req.headers['x-razorpay-signature'] 
//         if(!signature){
//             throw TryError('Signature is required',400)
//         }
//         const payload = JSON.stringify(body)
//         const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(payload).digest('hex')

//         if(signature !== expectedSignature){
//             throw TryError('Invalid signature',400)
//         }

//       fs.writeFileSync('payment.json', JSON.stringify(body, null, 2))

//       if(body.event === 'payment.authorized' && process.env.NODE_ENV === 'dev'){
//         console.log("payment success for dev server")
//       }
       
//       if(body.event === 'payment.authorized' && process.env.NODE_ENV === 'production'){
//         // Handle payment authorization logic here, such as updating order status in the database
//         console.log("payment success for production server")
//       }

//         res.json({message: 'payment successful'})
//     } catch (error) {
//         catchError(error, res, 'Failed to process webhook')
//     }
// }



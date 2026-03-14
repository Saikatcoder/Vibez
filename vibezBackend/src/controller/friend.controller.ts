import {  Response } from "express";
import { catchError } from "../util/error";
import FriendModel from "../model/Friend.model";
import { SessionInterface } from "../middleware/auth.middleware";
import AuthModel from "../model/auth.model";

export const addFriend = async (req:SessionInterface, res:Response)=>{
 try {
   req.body.user = req.session?.id
 const friend =await FriendModel.create(req.body)
 res.json(friend)
 } catch (error) {
    catchError(error, res, "failed to send request")
 }
}


export const fetchFrends = async (req:SessionInterface, res:Response)=>{
 try {
    const user = req.session?.id
  const friends =  await FriendModel.find(user)
  res.json(friends)
 } catch (error) {
    catchError(error, res, "failed to friend friends")
 }
}


export const friendSuggestion = async(req:SessionInterface,res:Response)=>{
 try {
    const friends = await AuthModel.aggregate([
      {
         $sample:{
            size:5
         }
      },
      {$project:{fullname:1, image:1}}
    ])
    setTimeout(()=>{
       res.json(friends)
    },2000)
    
 } catch (error) {
   
 }
}
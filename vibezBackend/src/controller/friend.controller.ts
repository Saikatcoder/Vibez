import {  Request, Response } from "express";
import { catchError, TryError } from "../util/error";
import FriendModel from "../model/Friend.model";
import { SessionInterface } from "../middleware/auth.middleware";
import AuthModel from "../model/auth.model";
import mongoose from "mongoose";

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
  const friends =  await FriendModel.find({ user}).populate('friend')
  res.json(friends)
 } catch (error) {
    catchError(error, res, "failed to friend friends")
 }
}


export const unFriend = async(req:Request, res:Response)=>{
 try {
   await FriendModel.deleteOne({_id: req.params.id})
   res.json({message: "Friend deleted"})

 } catch (error) {
  catchError(error, res, "failed to send friend request")
 }
}


export const friendSuggestion = async (req: SessionInterface, res: Response) => {
 try {

  if(!req.session)
    throw TryError("failed to suggest friend",401)

  const friends = await AuthModel.aggregate([
    {
      $match:{
        _id:{ $ne: new mongoose.Types.ObjectId(req.session.id) }
      }
    },
    {
      $sample:{ size:5 }
    },
    {
      $project:{ fullname:1, image:1, createdAt:1 }
    }
  ])

  const modify = await Promise.all(
    friends.map(async (item:any)=>{

      const count = await FriendModel.countDocuments({
        $or:[
          { user:req.session?.id, friend:item._id },
          { user:item._id, friend:req.session?.id }
        ]
      })

      return count === 0 ? item : null
    })
  )

  const filtered = modify.filter(item => item !== null)

  res.json(filtered)

 } catch (error) {
   res.status(500).json({message:"Server error"})
 }
}


export const friendRequest = async (req:SessionInterface ,res:Response)=>{
  try {
    if(!req.session)
      throw TryError("failed to fetch friend request")
   const friends =  await FriendModel.find({friend:req.session.id, status : "requested"}).populate("user","fullname image")

   res.json(friends)
  } catch (error) {
    catchError(error, res,'Failed to fetch freind request')
  }
}

export const updateFriendStatus = async(req: SessionInterface, res: Response)=>{
  try {
      if(!req.session)
        throw TryError("failed to update status")
      await FriendModel.updateOne(
        {_id:req.params.id},
        {$set:{status:req.body.status}}
      )
res.json({message: "Friend status update"})
  } catch (error) {
    catchError(error, res, "failed to update status")
  }
}


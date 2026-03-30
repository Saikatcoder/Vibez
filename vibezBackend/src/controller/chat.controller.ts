import mongoose from "mongoose"
import ChatModel from "../model/chats.model"
import { Request, Response } from "express"
import { catchError, TryError } from "../util/error"
import { SessionInterface } from "../middleware/auth.middleware"

interface PayloadInterface {
    from: string,
    to: string,
    message: string,
    file?: {
        path: string,
        type: string
    }

}

export const createChat = (payload: PayloadInterface) => {
    ChatModel.create(payload)
    .catch((err)=>{
        console.error("Error creating chat:", err)
    })
}



export const getChats = async (req: SessionInterface, res: Response) => {
    try {
        if(!req.session)
          throw TryError("failed to fetch chats")
        const chats = await ChatModel.find({
              $or: [
            { from: req.session.id, to: req.params.to },
            { from: req.params.to, to: req.session.id }
        ]
        })
        .populate("from", "fullname image email mobile")
        res.json(chats)
    } catch (error) {
        catchError( error, res, "failed to fetch chats")
    }
}
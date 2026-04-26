import { Request, Response } from "express";
import { catchError } from "../util/error";
import PostModel from "../model/post.model";
import { SessionInterface } from "../middleware/auth.middleware";

export const createPost = async (req:SessionInterface, res:Response) => {
    try {
        req.body.user = req.session?.id
        const post = PostModel.create(req.body)
        
        res.json(post)
    } catch (error) {
        catchError(error,res, "Failed to create post")
    }
}



export const fetchPost = async (req:Request, res:Response) => {
    try{
     const posts = await PostModel.find().sort({createdAt: -1})
        res.json(posts)
    }catch(error){
        catchError(error,res, "Failed to fetch post")
    }
}



export const deletePost = async (req:Request, res:Response) => {
    try{
        const postId = req.params.id
        await PostModel.findByIdAndDelete(postId)
        res.json({message: "Post deleted successfully"})
    }catch(error){
        catchError(error,res, "Failed to delete post")
    }
}
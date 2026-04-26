import { Router } from "express";
import { createPost, deletePost, fetchPost } from "../controller/post.controller";


const postRouter = Router();

postRouter.post("/", createPost)
postRouter.get("/get-post", fetchPost)
postRouter.delete("/:id", deletePost)
export default postRouter;
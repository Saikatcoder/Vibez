import { Router } from "express";
import { getChats } from "../controller/chat.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const ChatRouter = Router()

ChatRouter.get("/:to", AuthMiddleware ,getChats)

export default ChatRouter   
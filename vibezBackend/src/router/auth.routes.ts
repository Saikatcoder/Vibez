import { Router } from "express";
import { getSession, login, refreshToken, signup, updateProfilePicture } from "../controller/auth.controller";
import AuthMiddleware from "../middleware/auth.middleware";


const AuthRouter = Router()

AuthRouter.post("/signup",signup)
AuthRouter.post("/login", login)
AuthRouter.post("/refresh-token", refreshToken)
AuthRouter.get("/session", getSession)
AuthRouter.put("/profile-picture",AuthMiddleware, updateProfilePicture)

export default AuthRouter 




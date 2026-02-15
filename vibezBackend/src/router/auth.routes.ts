import { Router } from "express";
import { login, signup } from "../controller/auth.controller";


const AuthRouter = Router()

AuthRouter.post("/signup",signup)
AuthRouter.get("/login",login)

export default AuthRouter 

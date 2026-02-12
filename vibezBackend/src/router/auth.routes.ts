import { Router } from "express";
import { signup } from "../controller/auth.controller";

const AuthRouter = Router()

AuthRouter.post("/",signup)

export default AuthRouter 

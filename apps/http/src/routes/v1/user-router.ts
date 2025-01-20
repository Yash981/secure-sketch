import { Router } from "express"
import { UserSignIn, UserSignUp } from "../../controller/user-controller"

const UserRouter:Router = Router()

UserRouter.post('/signup',UserSignUp)
UserRouter.post('/signin',UserSignIn)

export default UserRouter
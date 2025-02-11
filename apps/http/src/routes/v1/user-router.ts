import { Router } from "express"
import { downloadEncryptedContent, UploadEncryptedData, UserSignIn, UserSignUp } from "../../controller/user-controller"

const UserRouter:Router = Router()

UserRouter.post('/signup',UserSignUp)
UserRouter.post('/signin',UserSignIn)
UserRouter.post('/upload',UploadEncryptedData)
UserRouter.get("/download",downloadEncryptedContent)

export default UserRouter
import { Router } from "express"
import { downloadEncryptedContent, UploadEncryptedData, UserSignIn, UserSignUp } from "../../controller/user-controller"
import { authenticateUser } from "../../middleware/auth-middleware"

const UserRouter:Router = Router()

UserRouter.post('/signup',UserSignUp)
UserRouter.post('/signin',UserSignIn)
UserRouter.post('/upload',authenticateUser,UploadEncryptedData)
UserRouter.get("/download",authenticateUser,downloadEncryptedContent)

export default UserRouter
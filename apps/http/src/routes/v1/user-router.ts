import { Router } from "express"
import { Cronjobfn, downloadEncryptedContent, UploadEncryptedData, UserSignIn, UserSignUp } from "../../controller/user-controller"
import { authenticateUser } from "../../middleware/auth-middleware"

const UserRouter:Router = Router()
UserRouter.get('/cronjob',Cronjobfn)
UserRouter.post('/signup',UserSignUp)
UserRouter.post('/signin',UserSignIn)
UserRouter.post('/upload',authenticateUser,UploadEncryptedData)
UserRouter.get("/download",authenticateUser,downloadEncryptedContent)

export default UserRouter
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const VerifyUser = (token: string) => {
    if(!process.env.JWT_SECRET){
        return null
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      if (typeof decoded == "string") {
        return null;
      }
  
      if (!decoded || !decoded.email) {
        return null;
      }
  
      return decoded.email;
    } catch (e) {
      return null;
    }
};
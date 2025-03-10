import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' });
export const VerifyUser = (token: string):string | null => {
    console.log(process.env.JWT_SECRET,'secret')
    if(!process.env.JWT_SECRET){
        console.error('JWT_SECRET is not defined in the environment variables.');
        return null
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (typeof decoded == "string") {
        return null;
      }
  
      if (!decoded || !decoded.userId) {
        console.error('Decoded token does not contain an email.');
        return null;
      }
  
      return decoded.userId;
    } catch (e:any) {
      console.error('Error verifying token:', e.message);
      return null;
    }
};
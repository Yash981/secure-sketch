import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token as string;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return 
  }
  try {
    const decode = jwt.decode(token) as { exp: number };
    //
    if (!decode || decode.exp < Date.now() / 1000) { 
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    req.email = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return 
  }
};

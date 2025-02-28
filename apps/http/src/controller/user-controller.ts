import { Request, Response } from "express";
import { CreateUser, findUserByEmail } from "../model/user-model";
import 'crypto' 
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../services/auth-service";
import { UserAuthFormSchema } from "@repo/shared-schema";
import { prisma } from "@repo/db";
const storage: Record<string, Buffer> = {};
export const UserSignUp = async (req: Request, res: Response) => {
  const parsedSignUpData = UserAuthFormSchema.safeParse(req.body);
  if (!parsedSignUpData.success) {
    res
      .status(400)
      .json({ message: "Invalid Inputs", error: parsedSignUpData.error });
    return;
  }
  try {
    const existingUser = await findUserByEmail(parsedSignUpData.data.email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }
    const hashedPassword = await hashPassword(parsedSignUpData.data.password);
    const newUser = await CreateUser({
      email: parsedSignUpData.data.email,
      password: hashedPassword,
      name: parsedSignUpData.data.name,
    });

    res.status(201).json({ message: "SignUp Successful", user: newUser });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
    return;
  }
};
export const UserSignIn = async (req: Request, res: Response) => {
  const parsedSignInData = UserAuthFormSchema.safeParse(req.body);
  if (!parsedSignInData.success) {
    res
      .status(400)
      .json({ message: "Invalid Inputs", error: parsedSignInData.error });
    return;
  }
  try {
    const existingUser = await findUserByEmail(parsedSignInData.data.email);
    if (!existingUser) {
      res.status(400).json({ message: "User doesn't exists!" });
      return;
    }
    const verifyPassword = await comparePassword(
      parsedSignInData.data.password,
      existingUser.password
    );
    console.log(verifyPassword, "existingUser");
    if (!verifyPassword) {
      res
        .status(400)
        .json({ message: "Wrong password! Please Enter Correct Password" });
      return;
    }
    const token = generateToken(parsedSignInData.data.email);

    res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; ${
        process.env.NODE_ENV === "production"
          ? "Secure; SameSite=Strict"
          : "SameSite=Lax"
      }`,
    ]);
    res.status(200).json({ token,username:existingUser.email.split('@')[0] });
    return;
  } catch (error) {
    res.status(500).json({ mesage: "Internal Server Error", error });
    return;
  }
};
export const UploadEncryptedData = async(req:Request,res:Response) =>{
  const getUserId = await prisma.user.findUnique({
    where:{
      email:req.email
    }
  })
  if(!getUserId){
    res.status(401).json({message:"User doesn't exist"})
    return;
  }
  if (!req.body || !Buffer.isBuffer(req.body)) {
    res.status(400).json({ error: 'Invalid encrypted data' });
    return
  }
  const uploadEncryptedContent = await prisma.drawing.create({
    data:{
      encryptedData:new Uint8Array(req.body),
      ownerId:getUserId?.id,
    } 
  })
  res.json({url:`http://localhost:3000/collaboration?id=${uploadEncryptedContent.id}`})
}
export const downloadEncryptedContent = async(req:Request,res:Response) =>{
    const { id } = req.query;
    
    if (!id || typeof id !== "string") {
        res.status(404).json({ error: "File not found" });
        return
    }
    const getEncryptedContent = await prisma.drawing.findUnique({
      where:{
        id:id
      }
    })
    if(!getEncryptedContent || !getEncryptedContent.encryptedData){
      return;
    }
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(getEncryptedContent?.encryptedData))
}
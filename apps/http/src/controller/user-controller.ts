import { Request, Response } from "express"
import { CreateUser, findUserByEmail } from "../model/user-model";
import { comparePassword, generateToken, hashPassword } from "../services/auth-service";
import { UserAuthFormSchema } from "@repo/shared-schema";

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
      res.setHeader('Set-Cookie', [
        `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; ${
          process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : 'SameSite=Lax'
        }`
      ]);
      res.status(200).json({ token });
      return;
    } catch (error) {
      res.status(500).json({ mesage: "Internal Server Error", error });
      return;
    }
  };
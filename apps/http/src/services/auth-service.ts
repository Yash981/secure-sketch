import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
configDotenv({path:'../../.env'})
const JWT_SECRET = process.env.JWT_SECRET || 'Yashwanth14';
const JWT_EXPIRATION = '7d';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
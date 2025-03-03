import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" }); 
export const prisma:PrismaClient = new PrismaClient()

export * from '@prisma/client';
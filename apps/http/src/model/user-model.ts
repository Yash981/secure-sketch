import { prisma } from '@repo/db'
import { UserAuthFormSchema } from '@repo/shared-schema'
export const findUserByEmail = async (email:string) =>{
    return await prisma.user.findUnique({
        where:{ email }
    })
}
export const CreateUser = async (data:UserAuthFormSchema) =>{
    return await prisma.user.create({
        data:{
            email:data.email,
            password: data.password,
            name:data.name
        }
    })
}
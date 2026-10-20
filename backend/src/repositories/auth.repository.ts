import {prisma} from "../config/prisma.js";

 export const buscarUsuarioPorUsernameOEmail  = async (username: string, email: string) => {

  return await prisma.user.findFirst({
   where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
 });
 };

 export const existingNumber = async () => {

    return await prisma.user.findFirst
 };

 export const user = async () => {

    return await prisma.user.create
 };

 export const loginUser = async () => {

    return await prisma.user.findFirst
 };
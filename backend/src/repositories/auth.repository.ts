import {prisma} from "../config/prisma.js";



export const findEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
};


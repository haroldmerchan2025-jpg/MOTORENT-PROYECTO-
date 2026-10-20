import {prisma} from "../config/prisma.js";

interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
}


export const findEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    });
};

export const findNumber = async (phone: string) => {

 return await prisma.user.findFirst({
            where: {
                     phone: phone 
            }
        })
};

export const findUserName = async (username: string) => {

    return await prisma.user.findUnique({
        where:{
            username:username
        }
    })
}

export const createUser = async (newUser: CreateUserData) => {
  const { username, email, passwordHash, fullName, phone } = newUser;

  return prisma.user.create({
    data: {
      username,
      email,
      password: passwordHash,
      fullName,
      phone,
    },
  });
};

export const findUserByIdentifier = async (identifier: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier },
      ],
    },
  });
};


export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      client: true,
      owner: true,
    },
  });
};
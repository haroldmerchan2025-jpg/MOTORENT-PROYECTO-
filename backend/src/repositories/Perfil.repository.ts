import { prisma } from "../config/prisma.js";

export const findOwnerByUserId = async (userId: string) => {
  return await prisma.owner.findUnique({
    where: { idUser: userId },
  });
};

export const findRenterByUserId = async (userId: string) => {
  return await prisma.renter.findUnique({
    where: { idUser: userId },
  });
};


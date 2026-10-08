

interface createUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export const NewUser = async (userData: createUserData) => {

  

  return await prisma.user.create({ data: userData });
};
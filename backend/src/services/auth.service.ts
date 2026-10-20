
import { findEmail, findNumber, findUserName,createUser } from "../repositories/auth.repository.js";
import { AppError} from "../utils/response.util.js"
import bcrypt from "bcryptjs";

interface createUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export const registerUser = async (newUser: createUserData) => {

  const { email, username, password, fullName, phone } = newUser 

  const verifyemail = await findEmail(email)

  if (verifyemail) {
    throw new AppError("El correo ya está registrado", 409);}

  const verifyNumber = await findNumber(phone)

  if (verifyNumber) {
    throw new AppError("El numero ya está registrado", 409);}

  const verifyUserName = await findUserName(username)

  if (verifyUserName) {
    throw new AppError("Nombre de usuario no disponible", 409)
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const creationUser = await createUser({
  username,
  email,
  passwordHash,
  fullName,
  phone
});

const { password: ignorePassword, ...userWithoutPassword } = creationUser;


return userWithoutPassword;
};
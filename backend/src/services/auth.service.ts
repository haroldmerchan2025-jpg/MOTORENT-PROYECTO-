
import { findEmail } from "../repositories/auth.repository.js";
import {responseError, AppError} from "../utils/response.util.js"
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
    return new AppError("El correo ya está registrado", 409);}

};
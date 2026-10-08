import {prisma} from "../config/prisma.js";

 const NewUser = await prisma.user.findFirst({
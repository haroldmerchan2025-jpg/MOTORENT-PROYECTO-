import {type Request, type Response, type NextFunction}from "express";

export const validateData = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { username, email, password, fullName, phone } = req.body;

        if (!username || typeof username!== "string"){
            return(
            res.status(400).json({
                ok:false,
                message: "Dato incorrecto"
            })

        )};

        if (!email || typeof email!== "string" || !email.includes("@")){
            return(
            res.status(400).json({
                ok:false,
                message: "El correo debe ser valido"
            })

        )};

        if (!password || typeof password!== "string"){
            return(
            res.status(400).json({
                ok:false,
                message: "Dato incorrecto"
            })

        )};

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#$%&@?¿/!¡+/*|-])\S{8,16}$/;

        if (!passwordRegex.test(password)) {
            return (
                res.status(400).json({
                    ok: false,
                    message: "Contraseña no cumple los parametros"
                })
            );
        }

        const fullNameRegex = /^.{10,35}$/ 

        if (!fullName || typeof fullName!== "string" || !fullNameRegex.test(String(fullName))){
            return(
            res.status(400).json({
                ok:false,
                message: "Dato incorrecto"
            })

        )};



        if (!phone || typeof phone!== "string"){
            return(
            res.status(400).json({
                ok:false,
                message: "Dato incorrecto"
            })

        )};   

        const numberRegex = /^([0-9]){9,16}$/;

        if (!numberRegex.test(String(phone))) {
            return res.status(400).json({
                ok: false,
                message: "Numero de telefono invalido"
            });
        }

        next();

    }catch(error){
    console.error(error);
    res.status(500).json({
        ok: false,
        message: "Error interno del servidor"
    })
    };
}
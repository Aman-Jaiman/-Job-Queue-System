import bcrypt from "bcrypt";

import config from "../../config/env.js";

import { generateToken } from "../../utils/jwt.js";


export const loginService = async (
    email,
    password
) => {

    if (!email || !password) {
        return null;
    }


    if (email !== process.env.ADMIN_EMAIL) {

        return null;

    }

    const valid = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD
    );

    if (!valid) {

        return null;

    }

    return generateToken({
        email,
        role: "admin",
    });

};
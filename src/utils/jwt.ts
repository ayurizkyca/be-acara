import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken"
import { SECRET } from "./env";

//omit, extends dari kelas user tapi tidak menggunakan semua properti yang harus diisi
export interface IUserToken extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username">{
    id?: Types.ObjectId;
}

//saat login berhasil, data usernya dibuat menjadi token
export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET, {
        expiresIn: "1h"
    });
    return token;
};

//mengambil data usernya, siapa yang sedang login tersebut
export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET) as IUserToken;
    return user;
};
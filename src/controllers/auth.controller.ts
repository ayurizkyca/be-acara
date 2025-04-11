import { request, Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
}

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password not match!")
})

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

      try {
        await registerValidateSchema.validate({
          fullName,
          username,
          email,
          password,
          confirmPassword
        });

        const result = await UserModel.create({
          fullName, email, username, password
        })

        res.status(200).json({
          message: "Success Registration!",
          data: result
        });
      } catch (error) {
        const err = error as unknown as Error;
        res.status(400).json({
          message: err.message,
          data: null
        })
      }

     
  },

  async login(req: Request, res: Response){
    /**
     #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/LoginRequest"}
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      //ambil data user berdasarkan identifier, mengarah ke 2 properti (email/password)

      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier
          },
          {
            username: identifier
          }
        ]
      })

      if(!userByIdentifier){
        return res.status(403).json({
          message: "User Not Found",
          data: null
        })
      }

      //validasai password

      const validatePassword: boolean = encrypt(password) === userByIdentifier.password

      if(!validatePassword){
        return res.status(403).json({
          message: "Email/Username Does'nt match with password",
          data: null
        })
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role
      })

      res.status(200).json({
        message: "Login Success",
        data: token
      })

    } catch (error) {
      const err = error as unknown as Error;
        res.status(400).json({
          message: err.message,
          data: null
        })
    }
  },

  async me (req: IReqUser, res: Response){
    /**
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id)

      res.status(200).json({
        message: "Success get User Profile",
        data: result
      })
    } catch (error) {
      const err = error as unknown as Error;
        res.status(400).json({
          message: err.message,
          data: null
        })
    }
  }
};

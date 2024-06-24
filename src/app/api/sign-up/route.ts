import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, username, email, password } = await request.json();
        
        if (!name || !username || !email || !password) {
            console.log("name", name);
            console.log("username", username);
            console.log("email", email);
            console.log("password", password)
            return Response.json({
                success: false,
                message: "All fields (name, username, email, password) are required",
            }), { status: 400 }
        }

        const existingVerifiedUserbyUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedUserbyUsername) {
            return Response.json({
                success: false,
                message: "User already exists with this username",
            },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                },
                    { status: 400 }
                );
            }
            else {
                const hashpassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashpassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 600000);
                await existingUserByEmail.save();
            }
        }

        else {
            const hashpassword = await bcrypt.hash(password, 10);
            const user = new UserModel({
                name,
                username,
                email,
                password: hashpassword,
                verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 600000),
                forgotPasswordLinkExpiry:undefined,
                isVerified: false,
                isAnonymous: true,
                messages: []
            });
            await user.save();
        }

        const sendEmail = await sendVerificationEmail(email, name, verifyCode);
        if(!sendEmail.success){
            return Response.json({
                success: false,
                message: sendEmail.message,
            },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: sendEmail.message,
        },
            { status: 200 }
        );

        } catch (error) {

            console.log("error while creating user", error);
            return Response.json({
                success: false,
                message: "error while creating user",
            },
                { status: 500 }
            );
        }
    }

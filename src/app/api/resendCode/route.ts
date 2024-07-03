import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username} = await request.json();

        const user = await UserModel.findOne({username})

        if (!user) {
            return Response.json({
                success: false,
                message: "User does not exist",
            }, {status: 400})
        }

        if(user.isVerified){
            return Response.json({
                success: false,
                message: "User is already verified",
            }, {status: 400})
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 600000);
        await user.save();

        const sendEmail = await sendVerificationEmail(user.email, user.username, verifyCode);

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
        
    }
}
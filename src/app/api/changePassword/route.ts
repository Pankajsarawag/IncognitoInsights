import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {

        const { username, newPassword } = await request.json();
        const user = await UserModel.findOne({
            username
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            );
        }

        const isValidLink = new Date() < new Date(user.forgotPasswordLinkExpiry);
        if (!isValidLink) {
            return Response.json({
                success: false,
                message: "Link expired"
            },
                { status: 400 }
            );
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);

        user.password = hashpassword;
        await user.save();
        console.log(user);
        return Response.json({
            success: true,
            message: "Password reset successfully"
        },
            { status: 200 }
        );
    }
    catch (error) {
        return Response.json({
            success: false,
            message: "Error in forgot password"
        },
            { status: 500 }
        );
    }
}
import dbConnect from "@/config/dbConnect";
import { sendForgotPasswaordEmail } from "@/helper/sendForgotPasswaordEmail";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username,email,resetdomain } = await request.json();

        const user = await UserModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            );
        }

        // console.log(user);
        user.forgotPasswordLinkExpiry = new Date(Date.now() + 600000);
        await user.save();

        const resetUrl = `${resetdomain}/${user?.username}`

        const sendEmail = await sendForgotPasswaordEmail  (user.email, user.username, resetUrl);

        if (!sendEmail.success) {
            return Response.json({
                success: false,
                message: "Error sending email"
            },
                { status: 500 }
            );
        }

        return Response.json({
            username: user.username,
            success: true,
            message: "Reset password email sent successfully"
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

import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, verifyCode } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            },
                { status: 404 }
            );
        }

        const isValidCode = user.verifyCode === verifyCode;
        const isCodeExpired = new Date() > new Date(user.verifyCodeExpiry);

        if(!isValidCode || isCodeExpired) {
            return Response.json({
                success: false,
                message: !isValidCode ? 'Invalid verification code' : 'Verification code expired please request a new one' 
            },
                { status: 400 }
            );
        }
            
        user.isVerified = true;

        await user.save();

        return Response.json({
            success: true,
            message: 'User verified successfully'
        },
            { status: 200 }
        );
    } catch (error) {
        return Response.json({
            success: false,
             message: 'Error verifying user'
        },
            { status: 500 }
        );
    }
}
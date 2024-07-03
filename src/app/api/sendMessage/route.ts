import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, content } = await request.json();
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 })
        }

        if (!user.isAnonymous) {
            return Response.json({
                success: false,
                message: 'User is not allowed to send messages'
            }, { status: 401 })
        }

        if(!user.isVerified){
            return Response.json({
                success: false,
                message: 'User is not verified on the Incognito Insights'
            }, { status: 401 })
        }

        const message = {
            content,
            createdAt: new Date()
        }

        user.messages.push(message as Message);
        await user.save();

        return Response.json({
            success: true,
            message: 'Message sent successfully',
            data: message
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to send message'
        }, { status: 500 })
    }
}

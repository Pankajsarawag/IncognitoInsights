import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username } = await request.json();
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        user.messages.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return Response.json({
            success: true,
            message: 'Messages fetched successfully',
            messages: user.messages
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to fetch messages'
        }, { status: 500 })
    }
}
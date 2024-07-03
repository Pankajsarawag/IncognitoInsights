import dbConnect from "@/config/dbConnect"; 
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username } = await request.json();
        const existingUser = await UserModel.findOne({ username })

        if (!existingUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: 'User found',
            isAnonymous: existingUser.isAnonymous
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching user:', error);
        return Response.json({
            success: false,
            message: 'Failed to fetch user status for isAcceptedMessage'
        }, { status: 500 });
    }
}
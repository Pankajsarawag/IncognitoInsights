import dbConnect from "@/config/dbConnect"; 
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, isAnonymous} = await request.json();
        const updatedUser = await UserModel.updateOne({username}, {isAnonymous});

        if(!updatedUser){
            return Response.json({
                success: false,
                message: 'failed to update user status to isAcceptedMessage'
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message: 'Message status updated successfully',
            data: updatedUser
        }, {status: 200})
        
    } catch (error) {
        return Response.json({
            success: false,
            message: 'failed to update user status to isAcceptedMessage'
        }, {status: 500})
    }
}
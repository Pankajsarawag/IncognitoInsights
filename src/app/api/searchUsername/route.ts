import dbConnect from '@/config/dbConnect';
import UserModel from '@/model/User';


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { keyword } = await request.json();

        const users = await UserModel.find({
            username: { $regex: keyword, $options: 'i' },
            isVerified: true
        });


        if (!users) {
            return Response.json({
                success: false,
                message: 'There is no user with that username'
            }, { status: 404 })
        }

        return Response.json(
            users,
        { status: 200 });


    }

    catch (error) {
        return Response.json({
            message: 'Error fetching search results'
        }, { status: 500 });
    }
}
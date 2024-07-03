import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

export async function DELETE(request: Request) {
    await dbConnect();
    try {
        const { userId, password } = await request.json();
        const user = await UserModel.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid password'
            }), { status: 400 });
        }

        await UserModel.findByIdAndDelete(userId);

        return new Response(JSON.stringify({
            success: true,
            message: 'User deleted successfully'
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Failed to delete user'
        }), { status: 500 });
    }
}

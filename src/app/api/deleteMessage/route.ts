import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";

export async function DELETE (request:Request){
  await dbConnect();
  try{
    const {userId, messageId} = await request.json();

    const updatedUser = await UserModel.updateOne(
      {
        _id: userId,
        'messages._id': messageId,
      },
      {
        $pull: {
          messages: { _id: messageId },
        },
      },
      { new: true }
    );

    if(updatedUser.modifiedCount === 0){
      return Response.json({
        success: false,
        message: 'Message not found or already deleted',
      }, {status: 404})
    } 

    return Response.json({
      success: true,
      message: 'Message deleted successfully',
    }, {status: 200})
  }
  catch(error){
    return Response.json({
      success: false,
      message: 'Error deleting message',
    }, {status: 500})
  }
}
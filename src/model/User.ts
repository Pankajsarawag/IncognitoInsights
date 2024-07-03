import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

export interface User extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    forgotPasswordLinkExpiry: Date;
    isVerified: boolean;
    isAnonymous: boolean;
    messages: Message[];
}

const MessageSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const UserSchema: Schema = new Schema({
    name:{
        type: String,
        required: [true, 'Please provide your name'],
        unique: false,
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    verifyCode: {
        type: String,
        required: [true, 'Please provide a verification code']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Please provide a verification code expiry date']
    },
    forgotPasswordLinkExpiry: {
        type: Date,
        required: [true, 'Please provide a forgot password link expiry date'],
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});


UserSchema.index({ username: 'text' });


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;

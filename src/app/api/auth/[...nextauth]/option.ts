import dbConnect from "@/config/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Email or Username', type: 'text', placeholder: 'Email or Username'},
                password: { label: 'Password', type: 'password', placeholder: 'Password'},
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error('No user found with this Email/Username');
                    }

                    if (!user.isVerified) {
                        throw new Error('User not verified');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error('Invalid password');
                    }

                    return user;

                } catch (error) {
                    console.error('Error in authorize:', error);
                    throw new Error('Error in sign in');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAnonymous = user.isAnonymous;
                token.username = user.username;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    _id: token._id as string,
                    isVerified: token.isVerified as boolean,
                    isAnonymous: token.isAnonymous as boolean,
                    username: token.username as string,
                    email: token.email as string,
                    name: token.name as string,
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 365 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/sign-in',
    }
};

export default authOptions;

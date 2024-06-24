import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface Session {
        user: {
          _id?: string;
          isAnonymous?: boolean;
          isVerified?: boolean;
          email?: string;
          username?: string;
          name?: string;
        } & DefaultSession["user"];
      }
    
      interface User {
        _id?: string;
        isAnonymous?: boolean;
        isVerified?: boolean;
        email?: string;
        username?: string;
        name?: string;
      }
}


declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            _id?: string;
            isAnonymous?: boolean;
            isVerified?: boolean;
            email?: string;
            username?: string;
            name?: string;
        };
    }
}
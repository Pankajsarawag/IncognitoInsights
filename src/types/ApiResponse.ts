import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAnonymous?: boolean;
    messages?: Array<Message>;
    name?:string;
    isRead?:boolean;
}
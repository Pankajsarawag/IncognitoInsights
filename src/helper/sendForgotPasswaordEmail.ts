import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
import ForgotPasswordEmail from "@/emailFormat/ForgotPasswordEmail";
import{ render } from "@react-email/components";


export async function sendForgotPasswaordEmail(
    email: string,
    username: string,
    resetUrl:string
): Promise<ApiResponse> {
    
    try {
        var transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
          });

        const emailHtml = render(ForgotPasswordEmail({ username,resetUrl}));

        const mailoption = {
            from: 'Icognito Insights <process.env.EMAIL_USER>',
            to: email,
            subject: "Reset Password for Icognito Insights",
            html: emailHtml,
        };

        const info = await transport.sendMail(mailoption);
        return {
            success: true,
            message: "Forgot Password email sent successfully",
        };

    } catch (error) {
        return {
            success: false,
            message: "Failed to send Forgot Password email",
        };
    }
}
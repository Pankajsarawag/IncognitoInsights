import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../emailFormat/verificatonEmail";
import {render } from "@react-email/components";

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string,
): Promise<ApiResponse> {
    try {
        var transport = nodemailer.createTransport({
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false, 
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
          });

        const emailHtml = render(VerificationEmail({ username, otp }));

        const mailoption = {
            from: 'Icognito Insights <process.env.EMAIL_USER>',
            to: email,
            subject: "Verification Code for Icognito Insights",
            html: emailHtml,
        };

        const info = await transport.sendMail(mailoption);
        console.log("Message sent: %s", info.messageId);
        return {
            success: true,
            message: "Verification email sent successfully",
        };

    } catch (error) {
        console.log("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}






























// import { resend } from "@/config/resend";
// import VerificationEmail from "../../email/verificatonEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     otp: string,
// ): Promise<ApiResponse> {
//     try {
//         await resend.emails.send({
//             from: 'pankajsarawag2@gmail.com',
//             to: email,
//             subject: "Verification Code",
//             react: VerificationEmail({ username, otp }),
//         });
//         return {
//             success: true,
//             message: "Verification email sent successfully",
//         };
//     } catch (error) {
//         return {
//             success: false,
//             message: "Failed to send verification email",
//         };
//     }
// }
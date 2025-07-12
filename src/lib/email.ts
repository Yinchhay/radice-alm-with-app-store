// src/lib/email.ts

import { sendMail } from "@/smtp/mail";

export const sendPasswordResetEmail = async (
    recipientEmail: string,
    resetUrl: string,
    name: string,
) => {
    const mailOptions = {
        to: recipientEmail,
        subject: "Password Reset Request",
        text: `Hi ${name},\n\nPlease reset your password using the following link:\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    };

    await sendMail(mailOptions);
};

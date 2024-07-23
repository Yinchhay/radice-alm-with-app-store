"use server";
import nodemailer, { SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { localDebug } from "@/lib/utils";
import { HTML_TEMPLATE } from "./mail_template";
import { getBaseUrl } from "@/lib/server_utils";

const createTransporter = async () => {
    const smtpConfig: SMTPTransport.Options = {
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            /**
             * using APP password is easier, not many error.
             * google app password is a one time password,
             * enable 2FA to be able to access that feature.
             */
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    return transporter;
};

/**
 * Either read type from nodemailer or check the official documentation here
 * https://nodemailer.com/message/
 */
export const sendMail = async (mailOptions: SendMailOptions) => {
    try {
        const transporter = await createTransporter();

        // Remove this line if don't want to use the default template
        if (!mailOptions.html) {
            mailOptions.html = HTML_TEMPLATE(
                mailOptions.text || "",
                await getBaseUrl(),
            );
        }

        mailOptions.from = process.env.EMAIL;

        if (process.env.NODE_ENV === "development") {
            // if mail is being sent in local development, don't send to actual email user;
            mailOptions.to = process.env.DEV_EMAIL || "lifegoalcs2@gmail.com";
        }

        return await transporter.sendMail(mailOptions);
    } catch (error: any) {
        console.error(error);
        localDebug(error.message, "/src/smtp/mail.ts");
    }
};

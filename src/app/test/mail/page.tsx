"use client";
import { sendMail } from "@/smtp/mail";
import { useState } from "react";

export default function TestMail() {
    const [sendOnce, setSendOnce] = useState<boolean>(false);

    const sendMailFunction = async () => {
        // even though it's test, prevent from sending too many email to avoid spam
        if (sendOnce) {
            return;
        }

        const result = await sendMail({
            subject: "Test Mail from Radi Dev localhost server",
            // change to your email
            to: "lifegoalcs2@gmail.com",
            text: "This is a test mail from Radi Dev localhost server.",
        });

        if (result && result.accepted.length > 0) {
            console.log("Mail sent successfully");
            alert("Mail sent successfully");
        }
        setSendOnce(true);
    };

    return (
        <div>
            <h1>Test Mail</h1>
            <p>This is a test mail page.</p>
            {sendOnce && <p>Mail sent successfully</p>}
            {!sendOnce && (
                <button onClick={sendMailFunction}>Click to send mail</button>
            )}
        </div>
    );
}

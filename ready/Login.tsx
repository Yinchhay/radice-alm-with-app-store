'use client'
import { loginWithPassWord } from "@/actions/guest";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";

export default function Login() {
    const [errMessage, setErrMessage] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);

    return (<>
        <form ref={formRef} action={async (formData: FormData) => {
            const { success, message } = await loginWithPassWord(formData);
            if (success) redirect('/app');
            else {
                setErrMessage(message as string);
                formRef.current?.reset();
            }
        }}>
            <div>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email" placeholder="email" />
                {/* <input type="text" name="email" id="email" placeholder="email" value={'lucia3@gmail.com'} /> */}
            </div>
            <div>
                <label htmlFor="password"></label>
                {/* <input type="password" name="password" id="password" placeholder="password" value={'lucialucia3'} /> */}
                <input type="password" name="password" id="password" placeholder="password" />
            </div>
            <button type="submit">Log in</button>
            <br></br>
            {errMessage && <span>{errMessage}</span>}
        </form>
    </>);
}
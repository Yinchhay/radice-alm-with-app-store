'use client'
import { useRouter } from "next/navigation";
import React from "react"

interface IForm {
    children: React.ReactNode;
    action: string;
}

export default function Form({ children, action }: IForm) {
    const METHOD = "POST";
    const router = useRouter();

    return (
        <form
            action={action}
            method={METHOD}
            onSubmit={async (event) => {
                // prevent reload
                event.preventDefault();
                const formData = new FormData(event.currentTarget);

                // convert formData and take only object naem and value
                const body: any = {};
                formData.forEach((value, key) => {
                    body[key] = value;
                })

                const res = await fetch(action, {
                    method: METHOD,
                    body: JSON.stringify(body),
                })

                // uncomment if want to refresh after submit
                // router.refresh();
            }}
        >
            {children}
        </form>
    )
}
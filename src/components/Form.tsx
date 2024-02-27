'use client'
import React, { useRef } from "react"

interface IForm {
    children: React.ReactNode,
    actionCallback: (formData: FormData) => Promise<{ success: boolean } | { error: string }>,
    resetInput?: boolean,
}

export default function Form({ children, actionCallback, resetInput = false }: IForm) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            action={async (formData: FormData) => {
                await actionCallback(formData)

                if (resetInput) formRef.current?.reset();
            }}
        >
            {children}
        </form>
    )
}
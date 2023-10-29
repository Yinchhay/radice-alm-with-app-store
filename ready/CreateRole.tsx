'use client'
import { createRole } from "@/actions/super_admin";
import { useRef } from "react";
import Permissions from "./components/Permissions";
import { revalidatePath } from "next/cache";

export default function CreateRole() {
    const formRef = useRef<HTMLFormElement>(null);
    
    return (
        <>
            <form ref={formRef} action={async (formData: FormData) => {
                const { success, message } = await createRole(formData);

                alert(message);
                formRef.current?.reset();
            }}>
                <div>
                    <label htmlFor="name">name</label>
                    <input type="text" name="name" id="name" placeholder="name" />
                </div>
                <div>
                    <label htmlFor="description">description</label>
                    <input type="text" name="description" id="description" placeholder="description" />
                </div>
                <Permissions />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
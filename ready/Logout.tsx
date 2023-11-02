'use client'
import { logCurrentUserOut } from "@/actions/member"

export default function Logout() {
    return (
        <form action={logCurrentUserOut}>
            <button>Logout</button>
        </form>
    )
}
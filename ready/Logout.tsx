'use client'

import { logCurrentUserOut } from "@/actions/guest"

export default function Logout() {
    return (
        <form action={logCurrentUserOut}>
            <button>Logout</button>
        </form>
    )
}
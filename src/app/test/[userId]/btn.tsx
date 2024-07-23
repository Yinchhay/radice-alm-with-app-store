"use client"

export const Button = ({ revalidateUser }: { revalidateUser: () => void }) => {
    return (
        <form action={revalidateUser}>
            <button>Revalidate</button>
        </form>
    )
}

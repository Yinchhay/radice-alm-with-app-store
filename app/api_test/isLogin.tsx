import { getPageSession } from "@/auth/lucia";

export default async function IsLogin()  {
    const session = await getPageSession();

    return (
        <div className="">
            <h1>u are {session ? session?.user?.username : 'not logged in'}</h1>
        </div>
    );
}
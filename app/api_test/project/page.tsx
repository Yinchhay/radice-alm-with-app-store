import IsLogin from "../isLogin";
import Project from "./project";

export default function Page() {
  return (<>
    {/* wrap client component in server side to be able to use server side component */}
    <IsLogin />
    <Project />
  </>)
}
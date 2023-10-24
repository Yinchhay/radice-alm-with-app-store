import TestClientComponent from "./TestClientComponent";
import IsLogin from "./isLogin";

export default function Page() {
  return (<>
    {/* wrap client component in server side to be able to use server side component */}
    <IsLogin />
    <TestClientComponent />
  </>)
}
import Login from "@/ready/Login";
import Logout from "@/ready/Logout";
import IsLogin from "../api_test/isLogin";
import CreateRole from "@/ready/CreateRole";
import AssignRole from "@/ready/AssignRole";

// TODO: test component functionality are ready, uncomment to use it.
export default function LoginPage() {
    return (<>
        <IsLogin />
        <Login />
        <Logout />
        <CreateRole />
        <AssignRole />
    </>);
}
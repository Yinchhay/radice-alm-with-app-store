import Link from "next/link";
import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import { User } from "lucia";
import { UserType } from "@/types/user";
import { GetUserRolesAndRolePermissions_C_ReturnType } from "@/repositories/users";

interface NavbarProps {
    onClick?: () => void;
    user: User;
    userWithRoles: GetUserRolesAndRolePermissions_C_ReturnType;
}

export default function Navbar({ user, userWithRoles }: NavbarProps) {
    // Get the current role name (show Super Admin if super admin, else first role)
    let roleName = "";
    if (user.type === UserType.SUPER_ADMIN) {
        roleName = "Super Admin";
    } else if (userWithRoles?.userRoles?.length) {
        roleName = userWithRoles.userRoles[0]?.role?.name || "";
    }

    // Logo element (copied from main Navbar)
    const logo = (
        <Link href="/">
            <img
                src="/RadiceLogo_light.png"
                alt="Radice Logo"
                style={{ 
                    color: "transparent", 
                    objectFit: "contain", 
                    height: "50px", 
                    width: "300px",
                    display: "block"
                }}
            />
        </Link>
    );

    return (
        <nav className="w-full h-full bg-white dark:bg-gray-900 flex items-center">
            <div
                style={{
                    display: "flex",
                    width: 1440,
                    maxWidth: 1440,
                    padding: "16px 40px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "0 auto",
                }}
            >
                {/* Logo on the left */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "300px", minWidth: "300px", maxWidth: "300px" }}>
                    <Link href="/">
                        <img
                            src="/RadiceLogo_light.png"
                            alt="Radice Logo"
                            style={{ 
                                color: "transparent", 
                                objectFit: "contain", 
                                height: "50px", 
                                width: "100%",
                                display: "block"
                            }}
                        />
                    </Link>
                </div>
                {/* Right side: bell, role, profile */}
                <div className="flex items-center gap-6">
                    {/* Role frame */}
                    <span style={{
                        display: "flex",
                        padding: "8px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        color: "var(--Button, #7F56D9)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 14,
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                        background: "#fff",
                        borderRadius: "8px",
                        border: "none"
                    }}>
                        {roleName}
                    </span>
                    {/* Empty profile picture (gray circle) */}
                    <div style={{ width: 31, flexShrink: 0, alignSelf: "stretch", aspectRatio: "1/1", borderRadius: "50%", background: "#ddd" }} />
                </div>
            </div>
        </nav>
    );
}


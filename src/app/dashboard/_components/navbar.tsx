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
                    {/* Bell icon (provided SVG) */}
                    <button aria-label="Notifications" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", width: 17, height: 17, flexShrink: 0, aspectRatio: "1/1" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M2.48008 9.76582V9.6107C2.50283 9.15177 2.64991 8.70715 2.90616 8.32259C3.33268 7.86069 3.62465 7.29459 3.75145 6.68378C3.75145 6.21169 3.75145 5.73286 3.79269 5.26077C4.00573 2.98801 6.25298 1.41663 8.47277 1.41663H8.52774C10.7475 1.41663 12.9947 2.98801 13.2146 5.26077C13.2559 5.73286 13.2146 6.21169 13.249 6.68378C13.3775 7.296 13.6692 7.8638 14.0943 8.32932C14.3524 8.71048 14.4998 9.15354 14.5204 9.6107V9.75909C14.5357 10.3756 14.3234 10.9769 13.9225 11.4519C13.3928 12.0073 12.6739 12.3528 11.902 12.423C9.63861 12.6658 7.35495 12.6658 5.09155 12.423C4.32055 12.3498 3.60274 12.0047 3.0711 11.4519C2.67641 10.9765 2.46691 10.3789 2.48008 9.76582Z" stroke="#110000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.76855 14.77C7.1222 15.2139 7.64155 15.5012 8.21162 15.5682C8.78176 15.6353 9.35558 15.4767 9.80615 15.1274C9.9447 15.0242 10.0694 14.904 10.1772 14.77" stroke="#110000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {/* Empty profile picture (gray circle) */}
                    <div style={{ width: 31, flexShrink: 0, alignSelf: "stretch", aspectRatio: "1/1", borderRadius: "50%", background: "#ddd" }} />
                </div>
            </div>
        </nav>
    );
}


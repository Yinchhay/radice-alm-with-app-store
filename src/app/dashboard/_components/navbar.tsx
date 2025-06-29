import { IconMenu2 } from "@tabler/icons-react";
import { User } from "lucia";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import ChipsHolder from "@/components/ChipsHolder";
import {
    GetUserRolesAndRolePermissions_C_ReturnType,
} from "@/repositories/users";
import Chip from "@/components/Chip";
import Tooltip from "@/components/Tooltip";
import { UserType } from "@/types/user";

interface NavbarProps {
    onClick: () => void;
    user: User;
    userWithRoles: GetUserRolesAndRolePermissions_C_ReturnType;
}

export default function Navbar({ onClick, user, userWithRoles }: NavbarProps) {
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
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClick}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-300 transition"
                        aria-label="Toggle sidebar"
                    >
                        <IconMenu2 size={28} className="text-gray-700 dark:text-gray-900" />
                    </button>
                    <h2 className="text-gray-900 dark:text-gray-900 font-semibold">Roles:</h2>
                    {user.type === UserType.SUPER_ADMIN ? (
                        <ChipsHolder>
                            <Tooltip title="Superadmin" position="bottom" key="superadmin-chip">
                                <Chip>Superadmin</Chip>
                            </Tooltip>
                        </ChipsHolder>
                    ) : (
                        <ChipsHolder>
                            {userWithRoles?.userRoles.map((role, i: number) => (
                                role.role && (
                                <Tooltip
                                    key={`role-chip-${role.role.id}-${i}`}
                                    title={role.role.description?.length ? role.role.description : role.role.name}
                                    position="bottom"
                                >
                                    <Chip>{role.role.name}</Chip>
                                </Tooltip>
                                )
                            ))}
                        </ChipsHolder>
                    )}
                </div>

                {/* Right side */}
                <Link href="/dashboard/account" className="flex items-center gap-4 hover:underline">
                    <h2 className="text-gray-900 dark:text-gray-900 font-bold">{`${user.firstName} ${user.lastName}`}</h2>
                    <ImageWithFallback
                        className="aspect-square object-cover rounded-full"
                        src={fileToUrl(
                            user.profileUrl,
                            user.type === UserType.PARTNER
                                ? "/placeholders/logo_placeholder.png"
                                : "/placeholders/missing_profile.png"
                        )}
                        alt="profile"
                        width={52}
                        height={52}
                    />
                </Link>
            </div>
        </nav>
    );
}


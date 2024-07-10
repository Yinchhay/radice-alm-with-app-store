import { IconMenu2 } from "@tabler/icons-react";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fileToUrl } from "@/lib/file";
import ChipsHolder from "@/components/ChipsHolder";
import {
    GetUserRolesAndRolePermissions_C_ReturnType,
    getUserRolesAndRolePermissions_C,
} from "@/repositories/users";
import { useEffect } from "react";
import Chip from "@/components/Chip";
import Tooltip from "@/components/Tooltip";
import { UserType } from "@/types/user";

export default function Navbar({
    onClick,
    user,
    userWithRoles,
}: {
    onClick: () => void;
    user: User;
    userWithRoles: GetUserRolesAndRolePermissions_C_ReturnType;
}) {
    return (
        <nav className="sticky h-[70px] z-40 top-0 left-0 px-4 py-2 bg-gray-900 dark:bg-[#0A0F1D] flex justify-between">
            <div className="flex items-center gap-2">
                <button onClick={onClick} className="p-2 hover:bg-gray-800">
                    <IconMenu2 size={28} className="text-gray-200" />
                </button>
                <h2 className="text-white dark:text-white">Roles:</h2>
                {user.type == UserType.SUPER_ADMIN ? (
                    <ChipsHolder>
                        <Tooltip
                            title={"Superadmin"}
                            key={`superadmin-chip`}
                            position="bottom"
                        >
                            <Chip>Superadmin</Chip>
                        </Tooltip>
                    </ChipsHolder>
                ) : (
                    <ChipsHolder>
                        {userWithRoles?.userRoles.map((role, i) => {
                            return (
                                <Tooltip
                                    title={
                                        role.role.description &&
                                        role.role.description.length > 0
                                            ? role.role.description
                                            : role.role.name
                                    }
                                    key={`role-chip-${role.role.id}-${i}`}
                                    position="bottom"
                                >
                                    <Chip>{role.role.name}</Chip>
                                </Tooltip>
                            );
                        })}
                    </ChipsHolder>
                )}
            </div>
            <Link
                href={"/dashboard/account"}
                className="flex items-center gap-4"
            >
                <h2 className="text-white font-bold">
                    {`${user.firstName} ${user.lastName}`}
                </h2>
                <ImageWithFallback
                    className="aspect-square object-cover rounded-full"
                    src={fileToUrl(
                        user.profileUrl,
                        user.type === UserType.PARTNER
                            ? "/placeholders/logo_placeholder.png"
                            : "/placeholders/missing_profile.png",
                    )}
                    alt={"profile"}
                    width={52}
                    height={52}
                />
            </Link>
        </nav>
    );
}

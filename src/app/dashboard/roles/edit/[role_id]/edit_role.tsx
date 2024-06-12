"use client";
import { GetRoleByIdReturnType } from "@/app/api/internal/role/[role_id]/route";
import { GetUsersByRoleReturnType } from "@/app/api/internal/role/[role_id]/users/route";
import Button from "@/components/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import InputField from "@/components/InputField";
import ToggleSwitch from "@/components/ToggleSwitch";
import Tooltip from "@/components/Tooltip";
import { useSelector } from "@/hooks/useSelector";
import { PermissionNames } from "@/lib/client_IAM";
import { fileToUrl } from "@/lib/file";
import { IconPlus, IconX } from "@tabler/icons-react";
import { fetchEditRoleById, fetchUsersNotInRole } from "../../fetch";
import { localDebug } from "@/lib/utils";
import Selector from "@/components/Selector";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import FormErrorMessages from "@/components/FormErrorMessages";
import { User as UserLuciaType } from "lucia";
import { UserType } from "@/types/user";
import { PermissionsToFilterIfNotSuperAdmin } from "@/lib/filter";

type Permission = {
    id: number;
    name: string;
    state: boolean;
};

export default function EditRole({
    role,
    usersInRole,
    user,
}: {
    role: GetRoleByIdReturnType;
    usersInRole: GetUsersByRoleReturnType;
    user: UserLuciaType;
}) {
    if (!role) {
        throw new Error("Role not found");
    }

    const pathname = usePathname();
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditRoleById>>>();
    async function fetchUsersNotInRoleBySearchCallback(search: string) {
        try {
            const response = await fetchUsersNotInRole(
                role?.id as number,
                search,
                1,
            );
            if (response.success) {
                return response.data.usersNotInRole;
            }
        } catch (error) {
            localDebug(
                "Error fetching users not in role by search",
                "edit_role.tsx",
            );
        }

        return [];
    }

    const {
        showSelectorOverlay,
        itemsCheckList,
        checkedItems,
        checkedItemsValues: usersDetail,
        searchTerm,
        onSearchChange,
        onCheckChange,
        onOpenSelector,
        onCloseSelector,
        onRemoveItem,
        onReset,
        onConfirm,
    } = useSelector(
        fetchUsersNotInRoleBySearchCallback,
        usersInRole,
        "firstName",
        "id",
        "lastName",
    );

    // users to be add, remove from role
    const [newUsersInRole, setNewUsersInRole] =
        useState<GetUsersByRoleReturnType>([]);
    const [permissions, setPermissions] = useState<Permission[]>(
        constructPermissions(),
    );

    function onPermissionChange(id: number, state: boolean) {
        setPermissions((prev) =>
            prev.map((permission) =>
                permission.id === id ? { ...permission, state } : permission,
            ),
        );
    }

    function constructUserLists() {
        const usersList: GetUsersByRoleReturnType = [];

        checkedItems.forEach((checkedItem) => {
            const user = usersDetail.find((u) => u.id === checkedItem.value);
            if (user) {
                usersList.push(user);
            }
        });

        return usersList;
    }

    function constructPermissions() {
        if (!role) {
            return [];
        }

        const permissionsState = [...PermissionNames.entries()].map(
            ([id, name]) => ({
                id: Number(id),
                name,
                state: role.rolePermissions.some(
                    (rp) => rp.permission.id === Number(id),
                ),
            }),
        ) satisfies Permission[];

        if (user.type === UserType.SUPER_ADMIN) {
            return permissionsState;
        }

        // only allow super admin to edit permissions related to roles
        return permissionsState.filter(
            (permission) =>
                !PermissionsToFilterIfNotSuperAdmin.includes(permission.id),
        );
    }

    function onResetClick() {
        setPermissions(constructPermissions());
        setResult(undefined);
        onReset();
    }

    const Users = newUsersInRole.map((user) => (
        <User
            key={user.id}
            user={user}
            onRemove={() => onRemoveItem(user.id)}
        />
    ));

    const RolePermissions = permissions.map((permission) => (
        <RolePermission
            key={permission.id}
            permission={permission}
            onChange={onPermissionChange}
        />
    ));

    useEffect(() => {
        const usersList = constructUserLists();

        // not sure what caused maximum call stack exceeded error but a fix is by comparing the two arrays and return if they are the same
        if (JSON.stringify(usersList) === JSON.stringify(newUsersInRole)) {
            return;
        }

        setNewUsersInRole(usersList);
    }, [checkedItems, usersDetail, usersInRole]);

    async function onSubmit(formData: FormData) {
        if (!role) {
            return;
        }

        const usersInRoleIds = newUsersInRole.map((user) => user.id);
        const permissionsIds = permissions
            .filter((permission) => permission.state)
            .map((permission) => permission.id);

        const result = await fetchEditRoleById(
            {
                name: formData.get("roleName") as string,
                permissionIds: permissionsIds,
                roleId: role.id,
                userIds: usersInRoleIds,
            },
            pathname,
        );

        setResult(result);
    }

    return (
        <form className="grid gap-4" action={onSubmit}>
            <div className="flex flex-col gap-2">
                <label htmlFor="roleName" className="font-semibold">
                    Role name:
                </label>
                <InputField
                    required
                    className="max-w-96"
                    defaultValue={role?.name ?? ""}
                    name="roleName"
                    id="roleName"
                    placeholder="Role name"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="roleName" className="font-semibold">
                    Role permissions:
                </label>
                <div className="grid gap-2">{RolePermissions}</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <label htmlFor="roleName" className="font-semibold">
                        Users:
                    </label>
                    <Tooltip title="Add users to role">
                        <Button
                            onClick={onOpenSelector}
                            square={true}
                            variant="primary"
                            type="button"
                        >
                            <IconPlus></IconPlus>
                        </Button>
                    </Tooltip>
                </div>
                <div className="grid gap-2">
                    {newUsersInRole.length > 0 ? Users : <NoUser />}
                </div>
            </div>
            {!result?.success && result?.errors && (
                <FormErrorMessages errors={result?.errors} />
            )}
            <div className="flex justify-end">
                <div className="flex gap-4">
                    <Button
                        onClick={onResetClick}
                        variant="secondary"
                        type="button"
                    >
                        Reset
                    </Button>
                    <SaveChangesBtn />
                </div>
            </div>
            {showSelectorOverlay && (
                <Selector
                    className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto"
                    selectorTitle="Add users to role"
                    searchPlaceholder="Search users"
                    checkListTitle="Users"
                    checkList={itemsCheckList || []}
                    onSearchChange={onSearchChange}
                    onCancel={onCloseSelector}
                    onConfirm={onConfirm}
                    onCheckChange={onCheckChange}
                    searchTerm={searchTerm}
                />
            )}
        </form>
    );
}

function RolePermission({
    permission,
    onChange,
}: {
    permission: Permission;
    onChange: (id: number, state: boolean) => void;
}) {
    return (
        <div className="flex justify-between">
            <p>{permission.name}</p>
            <ToggleSwitch
                defaultState={permission.state}
                onChange={(state) => onChange(permission.id, state)}
            />
        </div>
    );
}

function User({
    user,
    onRemove,
}: {
    user: GetUsersByRoleReturnType[number];
    onRemove: () => void;
}) {
    return (
        <div className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
                <ImageWithFallback
                    className="aspect-square object-cover rounded-sm"
                    src={fileToUrl(user.profileUrl)}
                    alt={"profile logo"}
                    width={48}
                    height={48}
                />
                <p>{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <Tooltip title="Remove user">
                <Button
                    type="button"
                    square={true}
                    variant="danger"
                    onClick={onRemove}
                >
                    <IconX></IconX>
                </Button>
            </Tooltip>
        </div>
    );
}

function NoUser() {
    return <p>No user in this role</p>;
}

function SaveChangesBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Saving changes" : "Save changes"}
        </Button>
    );
}

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
import { fetchUsersNotInRole } from "../../fetch";
import { localDebug } from "@/lib/utils";
import Selector from "@/components/Selector";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type Permission = {
    id: number;
    name: string;
};

export default function EditRole({
    role,
    usersInRole,
}: {
    role: GetRoleByIdReturnType;
    usersInRole: GetUsersByRoleReturnType;
}) {
    if (!role) {
        throw new Error("Role not found");
    }

    const permissions = [...PermissionNames.entries()].map(([id, name]) => ({
        id: Number(id),
        name,
    })) satisfies Permission[];

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
        checkedItemsValues: usersInTheSystem,
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

    function onResetClick() {
        onReset();
    }

    // users to be add, remove from role
    const [newUsersInRole, setNewUsersInRole] =
        useState<GetUsersByRoleReturnType>([]);

    function constructUserLists() {
        const usersList: GetUsersByRoleReturnType = [];

        checkedItems.forEach((checkedItem) => {
            const user = usersInTheSystem.find(
                (u) => u.id === checkedItem.value,
            );
            if (user) {
                usersList.push(user);
            }
        });

        return usersList;
    }

    const Users = newUsersInRole.map((user) => (
        <User
            key={user.id}
            user={user}
            onRemove={() => onRemoveItem(user.id)}
        />
    ));

    useEffect(() => {
        const usersList = constructUserLists();

        // not sure what caused maximum call stack exceeded error but a fix is by comparing the two arrays and return if they are the same
        if (JSON.stringify(usersList) === JSON.stringify(newUsersInRole)) {
            return;
        }

        setNewUsersInRole(usersList);
    }, [checkedItems, usersInTheSystem, usersInRole]);

    return (
        <div className="grid gap-4">
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
                <div className="grid gap-2">
                    {permissions.map((permission) => {
                        const dbPermission = role?.rolePermissions.find(
                            (rp) => rp.permission.id === permission.id,
                        )?.permission;
                        return (
                            <RolePermission
                                key={permission.id}
                                permission={permission}
                                dbPermission={dbPermission}
                            />
                        );
                    })}
                </div>
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
        </div>
    );
}

function RolePermission({
    permission,
    dbPermission,
}: {
    permission: Permission;
    dbPermission: Permission | undefined;
}) {
    return (
        <div className="flex justify-between">
            <p>{permission.name}</p>
            <ToggleSwitch defaultState={dbPermission?.id === permission.id} />
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
                <Button square={true} variant="danger" onClick={onRemove}>
                    <IconX></IconX>
                </Button>
            </Tooltip>
        </div>
    );
}

function SaveChangesBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Saving changes" : "Save changes"}
        </Button>
    );
}

function NoUser() {
    return <p>No user in this role</p>;
}

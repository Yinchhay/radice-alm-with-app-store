// TODO: Optimize code

"use client";
import { Suspense } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { RoleUsersOverlay } from "./users";
import FormErrorMessages from "@/components/FormErrorMessages";

import {
    fetchRoleById,
    fetchEditRoleById,
} from "../../fetch";

type Params = { params: { role_id: number } };

export default function EditRole({ params }: Params) {
    const [roleInfo, setRoleInfo] =
        useState<Awaited<ReturnType<typeof fetchRoleById>>>();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRoleById(Number(params.role_id)).then((roleInfo) => {
            setRoleInfo(roleInfo);
            setIsLoading(false); // Set loading to false after fetch completes
        });
    }, [Number(params.role_id)]);

    if (roleInfo && !roleInfo.success) {
        throw new Error(roleInfo.message);
    }

    const permissions = [
        { id: 1, name: "Create Users" },
        { id: 3, name: "Delete Users" },
        { id: 4, name: "Create Categories" },
        { id: 5, name: "Edit Categories" },
        { id: 6, name: "Delete Categories" },
        { id: 7, name: "Create Roles" },
        { id: 8, name: "Edit Roles" },
        { id: 9, name: "Delete Roles" },
        { id: 10, name: "Create Partners" },
        // { id: 11, name: "Edit Partners" },
        { id: 12, name: "Delete Partners" },
        { id: 13, name: "Approve and Reject Application Forms" },
        { id: 14, name: "Create Own Projects" },
        { id: 15, name: "Change project status" },
        { id: 16, name: "Delete project" },
    ];

    const [currentRoleName, setCurrentRoleName] = useState<string>();
    const [currentRolePermissions, setCurrentRolePermissions] = useState<
        { id: number; name: string }[]
    >([]);
    const [initialRolePermissions, setInitialRolePermissions] = useState<
        { id: number; name: string }[]
    >([]);

    useEffect(() => {
        if (roleInfo?.data.role?.name) {
            setInitialRoleName(roleInfo?.data.role?.name);
            setCurrentRoleName(roleInfo?.data.role?.name);
        }
        if (roleInfo?.data.role?.rolePermissions) {
            const rolePermissions = roleInfo?.data.role?.rolePermissions.map(
                (rolePermission) => rolePermission.permission,
            );
            setCurrentRolePermissions(rolePermissions);
            if (initialRolePermissions.length === 0) {
                setInitialRolePermissions(rolePermissions);
            }
        }
    }, [roleInfo]);

    const [initialRoleName, setInitialRoleName] = useState<string>();

    const [usersRoleChanged, setUsersRoleChanged] = useState<boolean>(false);
    const handleUsersRoleChanged = (value: boolean) => {
        setUsersRoleChanged(value);
        checkForChanges();
    };

    const permissionStates = permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        defaultState: roleInfo?.data.role?.rolePermissions.some(
            (rolePermission) =>
                rolePermission.permission.name === permission.name,
        ),
    }));

    const handlePermissionToggle = (
        newState: boolean,
        permission: { id: number; name: string },
    ) => {
        if (newState) {
            setCurrentRolePermissions((prevPermissions) => [
                ...prevPermissions,
                permission,
            ]);
        } else {
            setCurrentRolePermissions((prevPermissions) =>
                prevPermissions.filter((p) => p.id !== permission.id),
            );
        }

        checkForChanges();
    };

    const [anyChanges, setAnyChanges] = useState<boolean>(false);

    const checkForChanges = () => {
        const nameCheck = currentRoleName !== initialRoleName;
        const usersCheck = usersRoleChanged;

        const permissionsCheck = !(
            currentRolePermissions.length === initialRolePermissions.length &&
            currentRolePermissions.every(
                (p, i) => p.id === initialRolePermissions[i].id,
            )
        );

        setAnyChanges(nameCheck || permissionsCheck || usersCheck);
    };

    const [resetUsers, setResetUsers] = useState(false);
    const [resetToggle, setResetToggle] = useState(false);
    const [userSubmission, setUserSubmission] = useState(false);

    const [newRoleUsers, setNewRoleUsers] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);
    const reset = () => {
        setCurrentRoleName(initialRoleName);
        setCurrentRolePermissions(initialRolePermissions);
        setUsersRoleChanged(false);
        setAnyChanges(false);
        setResetUsers(true);
        setResetToggle((prev) => !prev);
    };

    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditRoleById>>>();

    useEffect(() => {
        if (result?.success) {
            setAnyChanges(false);
            setInitialRolePermissions(currentRolePermissions);
            setInitialRoleName(currentRoleName);
            setUserSubmission(true);
        }
    }, [result]);

    return (
        <Suspense fallback={"loading..."}>
            <div className="flex flex-col gap-4 bg-slate-200 p-5 rounded-lg">
                <BackButton />
                <h2 className="text-4xl font-bold">
                    Edit Role {params.role_id}
                </h2>
                <form
                    className="flex flex-col gap-4"
                    action={async () => {
                        const result = await fetchEditRoleById({
                            users: newRoleUsers,
                            permissions: currentRolePermissions,
                            name: currentRoleName as string,
                            roleId: params.role_id,
                        });
                        setResult(result);
                    }}
                >
                    <div className="w-1/2">
                        <h3>Name</h3>
                        <InputField
                            name="name"
                            id="name"
                            value={currentRoleName || ""}
                            onChange={(e) => {
                                setCurrentRoleName(e.target.value);
                                checkForChanges();
                            }}
                        />
                    </div>

                    <div className="w-1/2">
                        <h3>Permission</h3>
                        {isLoading ? (
                            <p>Loading permissions...</p>
                        ) : (
                            permissionStates.map((permission) => (
                                <div
                                    className="flex justify-between bg-gray-500 p-2 gap-5 my-1 rounded-md text-white"
                                    key={permission.id}
                                >
                                    <p>{permission.name}</p>
                                    <RolePermissionToggleSwitch
                                        defaultState={permission.defaultState}
                                        onChange={(newState) =>
                                            handlePermissionToggle(
                                                newState,
                                                permission,
                                            )
                                        }
                                        permission={permission}
                                        resetToggle={resetToggle}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex flex-col gap-4 w-1/2">
                        <RoleUsersOverlay
                            role={params.role_id}
                            onUpdateUsersRoleChanged={handleUsersRoleChanged}
                            reset={resetUsers}
                            onResetDone={setResetUsers} // pass setResetUsers as a prop
                            newRoleUsers={setNewRoleUsers}
                            isSubmitted={userSubmission}
                            doneSubmission={setUserSubmission}
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        {result?.success ? (
                            <div className="text-green-500">
                                Your success message here
                            </div>
                        ) : (
                            result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )
                        )}
                        <ResetBtn changes={anyChanges} reset={reset} />
                        <EditRoleBtn changes={anyChanges} />
                    </div>
                </form>
            </div>
        </Suspense>
    );
}

function ResetBtn({ changes = true, reset }: { changes?: boolean, reset: () => void }) {
    const formStatus = useFormStatus();
    return (
        <Button
            className="h-fit my-auto"
            type="reset"
            disabled={formStatus.pending || !changes}
            onClick={reset}
        >
            Reset
        </Button>
    );
}

function EditRoleBtn({ changes = true }: { changes?: boolean }) {
    const formStatus = useFormStatus();
    return (
        <Button
            disabled={formStatus.pending || !changes}
            variant="primary"
            className="h-fit my-auto"
        >
            {formStatus.pending ? "Saving" : "Save Changes"}
        </Button>
    );
}
const BackButton = () => {
    const goBack = () => {
        window.history.back();
    };
    return (
        <button
            className="text-lg font-bold text-blue-700 hover:text-blue-800 w-fit"
            onClick={goBack}
        >
            Back
        </button>
    );
};

const RolePermissionToggleSwitch = ({
    defaultState = false,
    onChange,
    permission,
    resetToggle,
}: {
    defaultState?: boolean;
    onChange?: (
        state: boolean,
        permission: { id: number; name: string },
    ) => void;
    permission: { id: number; name: string };
    resetToggle: boolean;
}) => {
    const [toggleOn, setToggleOn] = useState<boolean>(defaultState);

    useEffect(() => {
        setToggleOn(defaultState);
    }, [defaultState, resetToggle]);

    return (
        <button
            type="button"
            className={[
                "rounded-full w-[50px] h-[24px] flex items-center relative",
                toggleOn ? "bg-blue-500" : "bg-gray-400",
            ].join(" ")}
            onClick={() => {
                setToggleOn(!toggleOn);
                if (onChange) {
                    onChange(!toggleOn, permission);
                }
            }}
        >
            <div
                className={[
                    "rounded-full w-[18px] h-[18px] bg-white transition-all absolute outline outline-1",
                    toggleOn
                        ? "left-[28px] outline-transparent"
                        : "left-[4px] outline-gray-300",
                ].join(" ")}
            ></div>
        </button>
    );
};

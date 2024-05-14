import { useEffect, useState } from "react";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import Card from "@/components/Card";

import { IconPlus } from "@tabler/icons-react";

import { fetchUsersNotInRole, fetchUsersInRole } from "../../fetch";
import { users } from "@/drizzle/schema";

export function RoleUsersOverlay({
    role,
    onUpdateUsersRoleChanged,
    reset,
    onResetDone,
}: {
    role: number;
    onUpdateUsersRoleChanged: (value: boolean) => void;
    reset: boolean;
    onResetDone: (value: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    const [usersInRole, setUsersInRole] =
        useState<Awaited<ReturnType<typeof fetchUsersInRole>>>();
    const [usersNotInRole, setUsersNotInRole] =
        useState<Awaited<ReturnType<typeof fetchUsersNotInRole>>>();

    useEffect(() => {
        setIsLoading(true);
        fetchUsersInRole(role).then((usersInRoleData) => {
            setUsersInRole(usersInRoleData);
            setIsLoading(false);
        });
        fetchUsersNotInRole(role).then((userNotInRole) =>
            setUsersNotInRole(userNotInRole),
        );
        if (reset) {
            onResetDone(false);
        }
    }, [role, reset]); // add reset to the dependency array

    if (usersInRole && !usersInRole.success) {
        throw new Error(usersInRole.message);
    }

    if (usersNotInRole && !usersNotInRole.success) {
        throw new Error(usersNotInRole.message);
    }

    const [initialUsersInRole, setInitialUsersInRole] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);
    const [currentUsersInRole, setCurrentUsersInRole] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);
    useEffect(() => {
        if (usersInRole?.data?.users) {
            const users = usersInRole.data.users.map((user) => user.user);
            setCurrentUsersInRole(users);
            setInitialUsersInRole(users);
        }
    }, [usersInRole]);

    const [initialUsersNotInRole, setInitialUsersNotInRole] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);
    const [currentUsersNotInRole, setCurrentUsersNotInRole] = useState<
        { id: string; firstName: string; lastName: string }[]
    >([]);
    useEffect(() => {
        if (usersNotInRole?.data?.users) {
            const users = usersNotInRole.data.users.map((user) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
            }));
            setCurrentUsersNotInRole(users);
            setInitialUsersNotInRole(users);
        }
    }, [usersNotInRole]);
    const [usersRoleChanged, setUsersRoleChanged] = useState(false);

    // const removeUserFromRole = (id: string) => {
    //     const user = currentUsersInRole.find((user) => user.id === id);
    //     setCurrentUsersInRole(
    //         currentUsersInRole.filter((user) => user.id !== id),
    //     );
    //     if (user) {
    //         setCurrentUsersNotInRole([...currentUsersNotInRole, user]);
    //     }
    //     setUsersRoleChanged(
    //         initialUsersInRole !== currentUsersInRole &&
    //             initialUsersNotInRole !== currentUsersNotInRole,
    //     );
    // };
    const removeUserFromRole = (id: string) => {
        const user = currentUsersInRole.find((user) => user.id === id);
        const newCurrentUsersInRole = currentUsersInRole.filter(
            (user) => user.id !== id,
        );
        const newCurrentUsersNotInRole = user
            ? [...currentUsersNotInRole, user]
            : [...currentUsersNotInRole];

        setUsersRoleChanged(
            JSON.stringify(initialUsersInRole.sort()) !==
                JSON.stringify(newCurrentUsersInRole.sort()) &&
                JSON.stringify(initialUsersNotInRole.sort()) !==
                    JSON.stringify(newCurrentUsersNotInRole.sort()),
        );

        setCurrentUsersInRole(newCurrentUsersInRole);
        if (user) {
            setCurrentUsersNotInRole(newCurrentUsersNotInRole);
        }
    };
    const addUserToRole = () => {
        const usersNotInRole =
            document.querySelectorAll<HTMLInputElement>("#usersNotInRole");
        const usersToAdd = Array.from(usersNotInRole)
            .filter((user) => user.checked)
            .map((user) => user.value);

        const users = currentUsersNotInRole.filter((user) =>
            usersToAdd.includes(user.id),
        );

        const newCurrentUsersNotInRole = currentUsersNotInRole.filter(
            (user) => !usersToAdd.includes(user.id),
        );
        const newCurrentUsersInRole = [...currentUsersInRole, ...users];

        setUsersRoleChanged(
            JSON.stringify(initialUsersInRole.sort()) !==
                JSON.stringify(newCurrentUsersInRole.sort()) &&
                JSON.stringify(initialUsersNotInRole.sort()) !==
                    JSON.stringify(newCurrentUsersNotInRole.sort()),
        );

        setCurrentUsersNotInRole(newCurrentUsersNotInRole);
        setCurrentUsersInRole(newCurrentUsersInRole);
        setShowOverlay(false);
    };

    useEffect(() => {
        onUpdateUsersRoleChanged(usersRoleChanged);
    }, [usersRoleChanged, onUpdateUsersRoleChanged]);

    useEffect(() => {
        if (reset) {
            setCurrentUsersInRole(initialUsersInRole);
            setCurrentUsersNotInRole(initialUsersNotInRole);
            setUsersRoleChanged(false);
        }
    }, [reset]);

    return (
        <>
            <div className="flex justify-between">
                <h3>Users</h3>
                <Button
                    type="button"
                    data-test="createRole"
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {isLoading ? (
                    <p>Loading Users</p>
                ) : currentUsersInRole.length > 0 ? (
                    currentUsersInRole.map((user) => (
                        <div
                            className="flex justify-between bg-gray-300 rounded-md py-2 px-4"
                            key={user.id}
                        >
                            <div className="flex gap-4">
                                <p className="my-auto">
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>

                            <Button
                                data-test="removeUser"
                                onClick={() => removeUserFromRole(user.id)}
                                type="button"
                                variant="danger"
                            >
                                Remove
                            </Button>
                        </div>
                    ))
                ) : (
                    <NoUsersInRole />
                )}
            </div>

            {showOverlay && (
                <div className="font-normal">
                    <Overlay
                        onClose={() => {
                            setShowOverlay(false);
                        }}
                    >
                        <Card className="w-[300px]">
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-2xl font-bold capitalize">
                                    Add Users to Role
                                </h1>
                            </div>

                            <div className="flex flex-col items-start my-1">
                                <InputField
                                    name="search"
                                    id="search"
                                    isSearch
                                />

                                {(currentUsersNotInRole || []).length > 0 ? (
                                    (currentUsersNotInRole || []).map(
                                        (user) => (
                                            <User key={user.id} user={user} />
                                        ),
                                    )
                                ) : (
                                    <NoUsersNotInRole />
                                )}
                            </div>

                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={() => {
                                        addUserToRole();
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </Card>
                    </Overlay>
                </div>
            )}
        </>
    );
}

function NoUsersInRole() {
    return <p>No users found in role!</p>;
}

function NoUsersNotInRole() {
    return <p>No users found not in role!</p>;
}

function User({
    user,
}: {
    user: Pick<typeof users.$inferSelect, "id" | "firstName" | "lastName">;
}) {
    return (
        <div className="flex" key={user.id}>
            <input type="checkbox" value={user.id} id="usersNotInRole" />
            <p>
                {user.firstName} {user.lastName}
            </p>
        </div>
    );
}

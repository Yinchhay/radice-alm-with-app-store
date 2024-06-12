// import { useEffect, useState } from "react";

// import Button from "@/components/Button";
// import InputField from "@/components/InputField";
// import Overlay from "@/components/Overlay";
// import Card from "@/components/Card";

// import { IconPlus } from "@tabler/icons-react";

// import { fetchUsersNotInRole, fetchUsersInRole } from "../../fetch";
// import { users } from "@/drizzle/schema";

// export function RoleUsersOverlay({
//     role,
//     reset,
//     isSubmitted,
//     newRoleUsers,
//     onUpdateUsersRoleChanged,
//     onResetDone,
//     doneSubmission,
// }: {
//     role: number;
//     reset: boolean;
//     isSubmitted: boolean;
//     newRoleUsers: (
//         value: { id: string; firstName: string; lastName: string }[],
//     ) => void;
//     onUpdateUsersRoleChanged: (value: boolean) => void;
//     onResetDone: (value: boolean) => void;
//     doneSubmission: (value: boolean) => void;
// }) {
//     const [isLoading, setIsLoading] = useState(true);
//     const [showOverlay, setShowOverlay] = useState<boolean>(false);

//     const [usersInRole, setUsersInRole] =
//         useState<Awaited<ReturnType<typeof fetchUsersInRole>>>();
//     const [usersNotInRole, setUsersNotInRole] =
//         useState<Awaited<ReturnType<typeof fetchUsersNotInRole>>>();

//     const [initialUsersInRole, setInitialUsersInRole] = useState<
//         { id: string; firstName: string; lastName: string; email: string }[]
//     >([]);
//     const [currentUsersInRole, setCurrentUsersInRole] = useState<
//         { id: string; firstName: string; lastName: string; email: string }[]
//     >([]);

//     const [initialUsersNotInRole, setInitialUsersNotInRole] = useState<
//         { id: string; firstName: string; lastName: string; email: string }[]
//     >([]);
//     const [currentUsersNotInRole, setCurrentUsersNotInRole] = useState<
//         { id: string; firstName: string; lastName: string; email: string }[]
//     >([]);
    
//     const [searchTerm, setSearchTerm] = useState<string>("");

//     useEffect(() => {
//         setIsLoading(true);
//         fetchUsersInRole(role).then((usersInRoleData) => {
//             setUsersInRole(usersInRoleData);
//             setIsLoading(false);
//         });
//         fetchUsersNotInRole(role).then((userNotInRole) =>
//             setUsersNotInRole(userNotInRole),
//         );
//     }, [role]);

//     if (usersInRole && !usersInRole.success) {
//         throw new Error(usersInRole.message);
//     }

//     if (usersNotInRole && !usersNotInRole.success) {
//         throw new Error(usersNotInRole.message);
//     }

//     useEffect(() => {
//         if (usersInRole?.data?.users) {
//             const users = usersInRole.data.users.map((user) => user.user);
//             setCurrentUsersInRole(users);
//             setInitialUsersInRole(users);
//             newRoleUsers(users);
//         }
//         if (usersNotInRole?.data?.users) {
//             const users = usersNotInRole.data.users.map((user) => ({
//                 id: user.id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//             }));
//             setCurrentUsersNotInRole(users);
//             setInitialUsersNotInRole(users);
//         }
//     }, [usersInRole, usersNotInRole]);

//     const [usersRoleChanged, setUsersRoleChanged] = useState(false);

//     const removeUserFromRole = (id: string) => {
//         const user = currentUsersInRole.find((user) => user.id === id);
//         const newCurrentUsersInRole = currentUsersInRole.filter(
//             (user) => user.id !== id,
//         );
//         const newCurrentUsersNotInRole = user
//             ? [...currentUsersNotInRole, user]
//             : [...currentUsersNotInRole];

//         setCurrentUsersInRole(newCurrentUsersInRole);
//         if (user) {
//             setCurrentUsersNotInRole(newCurrentUsersNotInRole);
//         }
//         newRoleUsers(newCurrentUsersInRole);
//     };

//     const addUserToRole = () => {
//         const usersNotInRole =
//             document.querySelectorAll<HTMLInputElement>("#usersNotInRole");
//         const usersToAdd = Array.from(usersNotInRole)
//             .filter((user) => user.checked)
//             .map((user) => user.value);

//         const users = currentUsersNotInRole.filter((user) =>
//             usersToAdd.includes(user.id),
//         );

//         const newCurrentUsersNotInRole = currentUsersNotInRole.filter(
//             (user) => !usersToAdd.includes(user.id),
//         );
//         const newCurrentUsersInRole = [...currentUsersInRole, ...users];

//         setCurrentUsersNotInRole(newCurrentUsersNotInRole);
//         setCurrentUsersInRole(newCurrentUsersInRole);
//         newRoleUsers(newCurrentUsersInRole);
//         setShowOverlay(false);
//     };

//     useEffect(() => {
//         setUsersRoleChanged(
//             JSON.stringify(initialUsersInRole.sort()) !==
//                 JSON.stringify(currentUsersInRole.sort()) &&
//                 JSON.stringify(initialUsersNotInRole.sort()) !==
//                     JSON.stringify(currentUsersNotInRole.sort()),
//         );
//     }, [currentUsersInRole, currentUsersNotInRole]);

//     useEffect(() => {
//         onUpdateUsersRoleChanged(usersRoleChanged);
//     }, [usersRoleChanged, onUpdateUsersRoleChanged]);

//     useEffect(() => {
//         if (reset) {
//             setCurrentUsersInRole(initialUsersInRole);
//             setCurrentUsersNotInRole(initialUsersNotInRole);
//             setUsersRoleChanged(false);
//             onResetDone(false);
//         }

//         if (isSubmitted) {
//             setInitialUsersInRole(currentUsersInRole);
//             setInitialUsersNotInRole(currentUsersNotInRole);
//             setUsersRoleChanged(false);
//             doneSubmission(false);
//         }
//     }, [reset, isSubmitted]);

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);
//     };

//     const filteredUsersNotInRole = currentUsersNotInRole.filter((user) =>
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <>
//             <div className="flex justify-between">
//                 <h3>Users</h3>
//                 <Button
//                     type="button"
//                     data-test="createRole"
//                     onClick={() => setShowOverlay(true)}
//                     square={true}
//                     variant="primary"
//                 >
//                     <IconPlus></IconPlus>
//                 </Button>
//             </div>
//             <div className="flex flex-col gap-2">
//                 {isLoading ? (
//                     <p>Loading Users</p>
//                 ) : currentUsersInRole.length > 0 ? (
//                     currentUsersInRole.map((user) => (
//                         <div
//                             className="flex justify-between bg-gray-300 rounded-md py-2 px-4"
//                             key={user.id}
//                         >
//                             <div className="flex gap-4">
//                                 <p className="my-auto">
//                                     {user.firstName} {user.lastName}
//                                 </p>
//                             </div>

//                             <Button
//                                 data-test="removeUser"
//                                 onClick={() => removeUserFromRole(user.id)}
//                                 type="button"
//                                 variant="danger"
//                             >
//                                 Remove
//                             </Button>
//                         </div>
//                     ))
//                 ) : (
//                     <NoUsersInRole />
//                 )}
//             </div>

//             {showOverlay && (
//                 <div className="font-normal">
//                     <Overlay
//                         onClose={() => {
//                             setShowOverlay(false);
//                         }}
//                     >
//                         <Card className="w-[300px] flex flex-col gap-3">
//                             <div className="flex flex-col items-center gap-2">
//                                 <h1 className="text-2xl font-bold capitalize">
//                                     Add Users to Role
//                                 </h1>
//                             </div>

//                             <InputField
//                                 name="search"
//                                 id="search"
//                                 isSearch
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                             />

//                             <div className="flex flex-col items-start">
//                                 {(filteredUsersNotInRole || []).length > 0 ? (
//                                     (filteredUsersNotInRole || []).map(
//                                         (user) => (
//                                             <User key={user.id} user={user} />
//                                         ),
//                                     )
//                                 ) : (
//                                     <NoUsersNotInRole />
//                                 )}
//                             </div>

//                             <div className="flex justify-end gap-2">
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => {
//                                         setShowOverlay(false);
//                                     }}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     variant="primary"
//                                     type="button"
//                                     onClick={() => {
//                                         addUserToRole();
//                                     }}
//                                 >
//                                     Add
//                                 </Button>
//                             </div>
//                         </Card>
//                     </Overlay>
//                 </div>
//             )}
//         </>
//     );
// }

// function NoUsersInRole() {
//     return <p>No users found in this role</p>;
// }

// function NoUsersNotInRole() {
//     return <p>No users found not in this role</p>;
// }

// function User({
//     user,
// }: {
//     user: {
//         id: string;
//         firstName: string;
//         lastName: string;
//         email: string;
//     };
// }) {
//     const idForCheckBox = "usersNotInRole"+user.id;
//     return (
//         <div className="flex gap-1" key={user.id}>
//             <input type="checkbox" value={user.id} id={idForCheckBox} />

//             <label htmlFor={idForCheckBox}>
//                 {user.firstName} {user.lastName}
//             </label>
//         </div>
//     );
// }

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import FormErrorMessages from "@/components/FormErrorMessages";
import Card from "@/components/Card";
import CheckList from "@/components/CheckList";
import { IconPlus } from "@tabler/icons-react";

import { fetchAddUserToRole, fetchUnlistedUserToRole } from "../../fetch";

export async function CreateAddUserToRoleOverlay({ role }: { role: number }) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchAddUserToRole>>>();
    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);
    
    // console.log(Number(role));
    // const listOfUsers = await fetchUnlistedUserToRole(Number(role));
    // console.log(listOfUsers);
    

    return (
        <>
            <div className="flex">
                <h3>Users</h3>
                <Button
                    data-test="createRole"
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
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
                            <form
                                action={async (formData: FormData) => {
                                    const result = await fetchAddUserToRole({
                                        userId: formData.get("name") as string,
                                    });
                                    setResult(result);
                                }}
                            >
                                <div className="flex flex-col items-start my-1">
                                    <InputField
                                        name="search"
                                        id="search"
                                        isSearch
                                    />
                                    {/* {listOfUsers} */}
                                    {/* <CheckList title="Users" checkList={}/> */}
                                </div>

                                {!result?.success && result?.errors && (
                                    <FormErrorMessages
                                        errors={result?.errors}
                                    />
                                )}
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
                                    <AddUserToRoleBtn />
                                </div>
                            </form>
                        </Card>
                    </Overlay>
                </div>
            )}
        </>
    );
}

function AddUserToRoleBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Adding" : "Add"}
        </Button>
    );
}

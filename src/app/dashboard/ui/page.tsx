"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import ColumName from "@/components/table/ColumnName";
import Table from "@/components/table/Table";
import TableBody from "@/components/table/TableBody";
import Cell from "@/components/table/Cell";
import TableHeader from "@/components/table/TableHeader";
import TableRow from "@/components/table/TableRow";
import { Suspense, useState } from "react";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import Pagination from "@/components/Pagination";
import CheckList from "@/components/CheckList";
import { arrayToCheckList } from "@/lib/array_to_check_list";
import Selector from "@/components/Selector";
import Dropdown from "@/components/Dropdown";
import { arrayToDropdownList } from "@/lib/array_to_dropdown_list";
import ToggleSwitch from "@/components/ToggleSwitch";
import DashboardPageTitle from "@/components/DashboardPageTitle";

export default function Home({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [fieldValue, setFieldValue] = useState("");
    const [fieldSearchValue, setFieldSearchValue] = useState("");
    const [paginationNumber, setPaginationNumber] = useState(
        Number(searchParams?.page) || 1,
    );
    const maxPage = 10;
    const userMessyList = [
        { username: "John", user_id: "32", age: 24 },
        { username: "Sam", user_id: "2", age: 33 },
        { username: "Dan", user_id: "44", age: 23 },
    ];
    const userMessyList2 = [
        { username: "John", user_id: "12", age: 24 },
        { username: "Sam", user_id: "54", age: 33 },
        { username: "Tom", user_id: "2", age: 23 },
    ];
    const userMessyList3 = [
        {
            username: "Ema addsa d adsd adsadas",
            user_id: "7",
            age: 24,
        },
        { username: "Tyler", user_id: "8", age: 33 },
        { username: "Ted", user_id: "9", age: 23 },
    ];
    const messyFruitList = [
        {
            fruit_name: "Apple",
            fruit_id: "ab",
            fruit_price: 1,
        },
        {
            fruit_name: "Banana",
            fruit_id: "ba",
            fruit_price: 2,
        },
        {
            fruit_name: "Mango",
            fruit_id: "man",
            fruit_price: 8,
        },
    ];
    let userList = arrayToCheckList(userMessyList, "username", "user_id");
    userList[0].checked = true; // setting default first selected
    let userList2 = arrayToCheckList(userMessyList2, "username", "user_id");
    userList2[0].checked = true;
    let userList3 = arrayToCheckList(userMessyList3, "username", "user_id");
    userList3[0].checked = true;
    let fruitDropdownList = arrayToDropdownList(
        messyFruitList,
        "fruit_name",
        "fruit_price",
    );

    const [showSelectorOverlay, setShowSelectorOverlay] = useState(false);
    return (
        <div>
            <DashboardPageTitle
                title="Dashboard Page Title"
                className="text-center"
            />
            <div className="w-full h-screen flex p-8 gap-8 flex-wrap justify-center">
                <div className="grid gap-4">
                    <div>
                        <div className="grid gap-2">
                            <h1 className="font-bold">Buttons:</h1>
                            <Button variant="outline">Outline</Button>
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="danger">Danger</Button>
                            <h1 className="font-bold">Buttons (Disabled):</h1>
                            <Button variant="outline" disabled={true}>
                                Outline
                            </Button>
                            <Button variant="primary" disabled={true}>
                                Primary
                            </Button>
                            <Button variant="secondary" disabled={true}>
                                Secondary
                            </Button>
                            <Button variant="danger" disabled={true}>
                                Danger
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold">Card:</h1>
                    <Card>
                        <p>Anything can go in here</p>
                        <Button variant="outline">Button</Button>
                    </Card>
                    <h1 className="font-bold">Card (with custom className):</h1>
                    <Card className="grid place-items-end gap-2">
                        <p>className = grid place-items-end gap-2</p>
                        <Button variant="outline">Button</Button>
                    </Card>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Overlay (Popup):</h1>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowOverlay(true);
                        }}
                    >
                        Show Overlay
                    </Button>
                    {showOverlay && (
                        <Overlay
                            onClose={() => {
                                setShowOverlay(false);
                            }}
                        >
                            <Card className="w-[300px]">
                                <h1 className="text-2xl font-bold capitalize">
                                    My form
                                </h1>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowOverlay(false);
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button variant="primary">Do Sth</Button>
                                </div>
                            </Card>
                        </Overlay>
                    )}
                </div>
                <div>
                    <div className="grid gap-2">
                        <h1 className="font-bold">Input Fields:</h1>
                        <InputField
                            placeholder="Basic Field"
                            id="myId"
                            name="myName"
                        />
                        <InputField disabled={true} placeholder="Disabled" />
                        <InputField
                            placeholder="Reactive Value"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                        />
                        <p>Reactive Value: {fieldValue}</p>
                        <InputField
                            isSearch={true}
                            placeholder="Search Field"
                            value={fieldSearchValue}
                            onChange={(e) =>
                                setFieldSearchValue(e.target.value)
                            }
                        />
                        <p>Search for: {fieldSearchValue}</p>
                    </div>
                </div>
                <div>
                    <div>
                        <h1 className="mb-2 font-bold">Table:</h1>
                        <Table>
                            <TableHeader>
                                <ColumName>Name</ColumName>
                                <ColumName>Description</ColumName>
                                <ColumName className="flex justify-end">
                                    <Button square={true} variant="primary">
                                        <IconPlus></IconPlus>
                                    </Button>
                                </ColumName>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <Cell>EdTech</Cell>
                                    <Cell>EdTech</Cell>
                                    <Cell className="flex gap-2">
                                        <Button square={true}>
                                            <IconEdit></IconEdit>
                                        </Button>
                                        <Button square={true} variant="danger">
                                            <IconX></IconX>
                                        </Button>
                                    </Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell>FinTech</Cell>
                                    <Cell>FinTech</Cell>
                                    <Cell className="flex gap-2">
                                        <Button square={true}>
                                            <IconEdit></IconEdit>
                                        </Button>
                                        <Button square={true} variant="danger">
                                            <IconX></IconX>
                                        </Button>
                                    </Cell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">
                        Page Current: {paginationNumber}
                    </h1>
                    <Suspense>
                        <Pagination
                            page={paginationNumber}
                            maxPage={maxPage}
                            // onSetPage={(pageNumber) => {
                            //     setPaginationNumber(pageNumber);
                            //     console.log(pageNumber);
                            // }}
                        />
                    </Suspense>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Checklist</h1>
                    <CheckList
                        onChange={(updatedList) => {
                            console.log(updatedList);
                        }}
                        title="Users"
                        checkList={userList}
                    />
                    <CheckList
                        atLeastOne={true}
                        onChange={(updatedList) => {
                            console.log(updatedList);
                        }}
                        title="Users (Atleast One)"
                        checkList={userList2}
                    />
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Selector</h1>
                    <Button
                        onClick={() => {
                            setShowSelectorOverlay(true);
                        }}
                    >
                        Show Selector
                    </Button>
                    <div>
                        {showSelectorOverlay && (
                            <Selector
                                className=""
                                selectorTitle="Add Something"
                                searchPlaceholder="Search Something"
                                checkListTitle="Somethings"
                                checkList={userList3}
                                onSearchChange={(searchText) => {
                                    console.log(searchText);
                                }}
                                onCheckChange={(updatedList) => {
                                    console.log(updatedList);
                                }}
                                onCancel={() => {
                                    setShowSelectorOverlay(false);
                                }}
                                onConfirm={() => {
                                    alert(
                                        "User confirmed (this alert is for testing)",
                                    );
                                    console.log("User confirmed");
                                    setShowSelectorOverlay(false);
                                }}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Dropdown:</h1>
                    <div className="w-[128px]">
                        <Dropdown
                            onChange={(selectedElement) => {
                                console.log(selectedElement);
                            }}
                            dropdownList={fruitDropdownList}
                            defaultSelectedElement={fruitDropdownList[1]}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="mb-2 font-bold">Toggle Switch:</h1>
                    <ToggleSwitch
                        onChange={(state) => {
                            console.log(state);
                        }}
                    />
                    <h1 className="my-2 font-bold">
                        Toggle Switch(Default State):
                    </h1>
                    <ToggleSwitch
                        defaultState={true}
                        onChange={(state) => {
                            console.log(state);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

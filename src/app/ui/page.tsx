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
import { useState } from "react";
import {
    IconEdit,
    IconPlus,
    IconSquarePlus,
    IconSquareRoundedPlusFilled,
    IconX,
} from "@tabler/icons-react";

export default function Home() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [fieldValue, setFieldValue] = useState("");

    return (
        <div className="w-screen h-screen flex p-8 gap-8">
            <div className="grid gap-4">
                <div>
                    <div className="grid gap-2">
                        <h1 className="font-bold">Buttons:</h1>
                        <Button styleType="outline">Outline</Button>
                        <Button styleType="primary">Primary</Button>
                        <Button styleType="secondary">Secondary</Button>
                        <Button styleType="danger">Danger</Button>
                        <h1 className="font-bold">Buttons (Disabled):</h1>
                        <Button styleType="outline" disabled={true}>
                            Outline
                        </Button>
                        <Button styleType="primary" disabled={true}>
                            Primary
                        </Button>
                        <Button styleType="secondary" disabled={true}>
                            Secondary
                        </Button>
                        <Button styleType="danger" disabled={true}>
                            Danger
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="font-bold">Card:</h1>
                <Card>
                    <p>Anything can go in here</p>
                    <Button styleType="outline">Button</Button>
                </Card>
                <h1 className="font-bold">Card (with custom className):</h1>
                <Card className="grid place-items-end gap-2">
                    <p>className = grid place-items-end gap-2</p>
                    <Button styleType="outline">Button</Button>
                </Card>
            </div>
            <div>
                <h1 className="mb-2 font-bold">Overlay (Popup):</h1>
                <Button
                    styleType="outline"
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
                                    styleType="outline"
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Close
                                </Button>
                                <Button styleType="primary">Do Sth</Button>
                            </div>
                        </Card>
                    </Overlay>
                )}
            </div>
            <div>
                <div className="grid gap-2">
                    <h1 className="mb-2 font-bold">Input Fields:</h1>
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
                </div>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Description</ColumName>
                        <ColumName className="flex justify-end">
                            <Button square={true} styleType="primary">
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
                                <Button square={true} styleType="danger">
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
                                <Button square={true} styleType="danger">
                                    <IconX></IconX>
                                </Button>
                            </Cell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreatePartnerOverlay } from "./create_partner";
import { users } from "@/drizzle/schema";
import { hasPermission } from "@/lib/IAM";
import { getAuthUser } from "@/auth/lucia";
import { Permissions } from "@/types/IAM";
import { fetchPartners } from "./fetch";
import { DeletePartnerOverlay } from "./delete_partner";

export default async function ManagePartners() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    const result = await fetchPartners();
    if (!result.success) {
        throw new Error(result.message);
    }

    const [createPartnerPermission, deletePartnerPermission] =
        await Promise.all([
            hasPermission(user.id, new Set([Permissions.CREATE_PARTNERS])),
            hasPermission(user.id, new Set([Permissions.DELETE_PARTNERS])),
        ]);

    const canCreatePartner = createPartnerPermission.canAccess;
    const canDeletePartner = deletePartnerPermission.canAccess;
    const PartnerLists = result.data.partners.map((partner) => {
        return (
            <Partner
                key={partner.id}
                partner={partner}
                canDeletePartner={canDeletePartner}
            />
        );
    });

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <h1 className="text-2xl">Partner</h1>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Email</ColumName>
                        <ColumName className="flex justify-end">
                            {canCreatePartner && <CreatePartnerOverlay />}
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.partners.length > 0 ? (
                            PartnerLists
                        ) : (
                            // TODO: style here
                            <NoPartner />
                        )}
                    </TableBody>
                </Table>
            </Suspense>
        </div>
    );
}

function NoPartner() {
    return (
        <>
            <TableRow>
                <Cell>{`No partner found in the system!`}</Cell>
            </TableRow>
        </>
    );
}

function Partner({
    partner,
    canDeletePartner,
}: {
    partner: typeof users.$inferSelect;
    canDeletePartner: boolean;
}) {
    return (
        <TableRow className="text-center align-middle">
            <Cell data-test={`partnerName-${partner.firstName}`}>
                {partner.firstName}
            </Cell>
            <Cell data-test={`partnerEmail-${partner.email}`}>
                {partner.email}
            </Cell>
            <Cell>
                <div className="flex gap-2 justify-end">
                    {canDeletePartner && (
                        <DeletePartnerOverlay partner={partner} />
                    )}
                </div>
            </Cell>
        </TableRow>
    );
}

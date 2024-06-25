import { Suspense } from "react";
import Table from "@/components/table/Table";
import TableHeader from "@/components/table/TableHeader";
import ColumName from "@/components/table/ColumnName";
import TableBody from "@/components/table/TableBody";
import TableRow from "@/components/table/TableRow";
import Cell from "@/components/table/Cell";
import { CreatePartnerOverlay } from "./create_partner";
import { hasPermission } from "@/lib/IAM";
import { getAuthUser } from "@/auth/lucia";
import { Permissions } from "@/types/IAM";
import { fetchPartners } from "./fetch";
import { DeletePartnerOverlay } from "./delete_partner";
import { UserWithoutPassword } from "../projects/[project_id]/settings/project_member";
import NoPartner from "./no_partner";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
export const metadata: Metadata = {
    title: "Manage Partners - Dashboard - Radice",
};
type ManagePartnersProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManagePartners({
    searchParams,
}: ManagePartnersProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchPartners(page, 5, searchParams?.search);
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

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <DashboardPageTitle title="Partners" />
                <div className="mt-4">
                    <SearchBar placeholder="Search partners" />
                </div>
                <Table className="my-4 w-full">
                    <TableHeader>
                        <ColumName>Name</ColumName>
                        <ColumName>Email</ColumName>
                        <ColumName className="flex justify-end font-normal">
                            {canCreatePartner && <CreatePartnerOverlay />}
                        </ColumName>
                    </TableHeader>
                    <TableBody>
                        {result.data.partners.length > 0 ? (
                            PartnerLists
                        ) : (
                            <NoPartner page={page} />
                        )}
                    </TableBody>
                </Table>
                {showPagination && (
                    <div className="float-right mb-4">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function Partner({
    partner,
    canDeletePartner,
}: {
    partner: UserWithoutPassword;
    canDeletePartner: boolean;
}) {
    return (
        <TableRow className="text-center align-middle">
            <Cell data-test={`partnerName-${partner.firstName}`}>
                {`${partner.firstName} ${partner.lastName}`}
            </Cell>
            <Cell data-test={`partnerEmail-${partner.email}`}>
                {partner.email}
            </Cell>
            <Cell>
                <div className="flex gap-2 justify-end" key={partner.id}>
                    {canDeletePartner && (
                        <DeletePartnerOverlay partner={partner} />
                    )}
                </div>
            </Cell>
        </TableRow>
    );
}

import { getAuthUser } from "@/auth/lucia";
import Card from "@/components/Card";
import { applicationForms, ApplicationFormStatus } from "@/drizzle/schema";
import { Suspense } from "react";
import { fetchApplicationForms } from "./fetch";
import { hasPermission } from "@/lib/IAM";
import { Permissions } from "@/types/IAM";
import Pagination from "@/components/Pagination";
import { fileToUrl } from "@/lib/file";
import Link from "next/link";
import { dateToStringDetail } from "@/lib/utils";
import { ApproveApplicationFormOverlay } from "./approve_form";
import { RejectApplicationFormOverlay } from "./reject_form";
import NoApplicationForm from "./no_application_form";
import SearchBar from "@/components/SearchBar";
import { Metadata } from "next";
import DashboardPageTitle from "@/components/DashboardPageTitle";
export const metadata: Metadata = {
    title: "Manage Application Forms - Dashboard - Radice",
};
type ManageApplicationFormsProps = {
    searchParams?: {
        page?: string;
        search?: string;
    };
};

export default async function ManageApplicationForms({
    searchParams,
}: ManageApplicationFormsProps) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("Unauthorized to access this page");
    }

    let page = Number(searchParams?.page) || 1;
    if (page < 1) {
        page = 1;
    }

    const result = await fetchApplicationForms(page, 5, searchParams?.search);
    if (!result.success) {
        throw new Error(result.message);
    }

    const [canApproveAndRejectPermission] = await Promise.all([
        hasPermission(
            user.id,
            new Set([Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS]),
        ),
    ]);

    const canApproveAndReject = canApproveAndRejectPermission.canAccess;

    const ApplicationFormLists = result.data.applicationForms.map((af) => {
        return (
            <ApplicationForm
                key={af.id}
                applicationForm={af}
                canApproveAndReject={canApproveAndReject}
            />
        );
    });

    const showPagination =
        result.data.maxPage >= page && result.data.maxPage > 1;

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <Suspense fallback={"loading..."}>
                <DashboardPageTitle title="Application Forms" />
                <div className="mt-4">
                    <SearchBar placeholder="Search application forms" />
                </div>
                {result.data.applicationForms.length > 0 ? (
                    <div className="my-4 w-full flex gap-4 flex-col">
                        {ApplicationFormLists}
                    </div>
                ) : (
                    <NoApplicationForm page={page} />
                )}
                {showPagination && (
                    <div className="float-right mb-4">
                        <Pagination page={page} maxPage={result.data.maxPage} />
                    </div>
                )}
            </Suspense>
        </div>
    );
}

function ApplicationForm({
    applicationForm,
    canApproveAndReject,
}: {
    applicationForm: typeof applicationForms.$inferSelect;
    canApproveAndReject: boolean;
}) {
    return (
        <Card square>
            <div className="flex flex-row gap-4 relative">
                <div className="flex w-full ">
                    <div className="flex flex-col w-full">
                        <div className="flex gap-2">
                            <h1 className="font-semibold">First name:</h1>
                            <p className="font-normal">
                                {applicationForm.firstName}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Last name:</h1>
                            <p className="font-normal">
                                {applicationForm.lastName}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Email:</h1>
                            <p className="font-normal">
                                {applicationForm.email}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Reason:</h1>
                            <p className="font-normal">
                                {applicationForm.reason}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Curriculum vitae:</h1>
                            <Link
                                href={fileToUrl(applicationForm.cv)}
                                target="_blank"
                                prefetch={false}
                            >
                                <p className="font-normal">
                                    {applicationForm.cv}
                                </p>
                            </Link>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">
                                Request to join at:
                            </h1>
                            <p className="font-normal">
                                {dateToStringDetail(
                                    applicationForm.createdAt as Date,
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <h1 className="font-semibold">Status:</h1>
                            <p className="font-normal">
                                {applicationForm.status}
                            </p>
                        </div>
                        <div
                            className="flex gap-2 justify-end"
                            key={
                                applicationForm.id +
                                new Date(
                                    applicationForm.updatedAt!,
                                ).toISOString()
                            }
                        >
                            {canApproveAndReject &&
                                applicationForm.status ===
                                    ApplicationFormStatus.PENDING && (
                                    <>
                                        <RejectApplicationFormOverlay
                                            key={applicationForm.id}
                                            applicationForm={applicationForm}
                                        />
                                        <ApproveApplicationFormOverlay
                                            key={applicationForm.id}
                                            applicationForm={applicationForm}
                                        />
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

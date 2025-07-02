import { Suspense } from "react"
import { CreateProjectOverlay } from "./create_project"
import Pagination from "@/components/Pagination"
import { fetchAssociatedProjects } from "./fetch"
import Card from "@/components/Card"
import type { SuccessResponse } from "@/lib/response"
import type { FetchAssociatedProjectsData } from "@/app/api/internal/project/associate/route"
import Link from "next/link"
import { checkProjectRole, ProjectRole } from "@/lib/project"
import { getAuthUser } from "@/auth/lucia"
import { hasPermission } from "@/lib/IAM"
import { Permissions } from "@/types/IAM"
import type { User } from "lucia"
import { fileToUrl } from "@/lib/file"
import ImageWithFallback from "@/components/ImageWithFallback"
import Chip from "@/components/Chip"
import NoAssociatedProject from "./no_associated_project"
import SearchBar from "@/components/SearchBar"
import type { Metadata } from "next"
import DashboardPageTitle from "@/components/DashboardPageTitle"
import Loading from "@/components/Loading"

export const metadata: Metadata = {
  title: "Manage Projects - Dashboard - Radice",
}

type ManageAssociatedProps = {
  searchParams?: {
    page?: string
    search?: string
  }
}

export default async function ManageAssociatedProject({ searchParams }: ManageAssociatedProps) {
  const user = await getAuthUser()
  if (!user) throw new Error("Unauthorized")

  let page = Number(searchParams?.page) || 1
  if (page < 1) page = 1

  const result = await fetchAssociatedProjects(page, 4, searchParams?.search)
  if (!result.success) throw new Error(result.message)

  const { canAccess: canCreateProject } = await hasPermission(user.id, new Set([Permissions.CREATE_OWN_PROJECTS]))

  const showPagination = result.data.maxPage >= page && result.data.maxPage > 1

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <Suspense fallback={<Loading />}>
        <div className="flex justify-between items-center">
          <DashboardPageTitle title="Projects" />
          {canCreateProject && <CreateProjectOverlay />}
        </div>

        <div className="mt-4">
          <SearchBar placeholder="Search associated projects" />
        </div>

        {result.data.projects.length > 0 ? (
          <div className="py-4 flex flex-col gap-4">
            {result.data.projects.map((project) => (
              <Project key={project.id} project={project} user={user} />
            ))}
          </div>
        ) : (
          <NoAssociatedProject page={page} />
        )}

        {showPagination && (
          <div className="flex justify-end pb-4">
            <Pagination page={page} maxPage={result.data.maxPage} />
          </div>
        )}
      </Suspense>
    </div>
  )
}

function Project({
  user,
  project,
}: {
  user: User
  project: SuccessResponse<FetchAssociatedProjectsData>["data"]["projects"][number]
}) {
  const { canEdit, projectRole } = checkProjectRole(user.id, project, user.type)
  const canViewSettings = projectRole === ProjectRole.OWNER || projectRole === ProjectRole.SUPER_ADMIN

  return (
    <Card square className="p-6 h-[200px] flex overflow-hidden">
      {/* Project Logo */}
      <div className="h-full aspect-square flex-shrink-0">
        <ImageWithFallback
          className="w-full h-full object-cover bg-white rounded-lg"
          src={fileToUrl(project.logoUrl) || "/placeholder.svg"}
          alt="project logo"
          width={200}
          height={200}
        />
      </div>

      {/* Project Info + Action Buttons */}
      <div className="flex flex-1 pl-6 gap-6">
        {/* Info */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex gap-2 flex-wrap">
            {project.projectCategories.map((catJoin) => (
              <Chip
                key={catJoin.category.id}
                textClassName="text-[#7F56D9] font-bold text-sm"
                bgClassName="bg-transparent"
                className="px-0"
              >
                {catJoin.category.name}
              </Chip>
            ))}
          </div>
          <h1 className="text-black font-semibold text-xl leading-6">{project.name}</h1>
          <p className="text-black/64 text-sm leading-5 line-clamp-3 overflow-hidden">{project.description}</p>
        </div>

        {/* Buttons - Square buttons with auto spacing */}
        <div className="flex flex-col justify-between items-end w-8 h-full">
          {/* View Button */}
          <Link href={`/dashboard/projects/${project.id}`} className="w-full">
            <div
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:brightness-90 transition-all duration-150"
              title="View Project"
            >
              <svg className="w-5 h-5" viewBox="0 0 18 16" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7342 8.00033C11.7342 9.51038 10.5095 10.7342 8.99946 10.7342C7.48941 10.7342 6.26562 9.51038 6.26562 8.00033C6.26562 6.48941 7.48941 5.26562 8.99946 5.26562C10.5095 5.26562 11.7342 6.48941 11.7342 8.00033Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.99827 14.3153C12.2917 14.3153 15.304 11.9473 17 8.00006C15.304 4.05281 12.2917 1.68481 8.99827 1.68481H9.00173C5.70832 1.68481 2.696 4.05281 1 8.00006C2.696 11.9473 5.70832 14.3153 9.00173 14.3153H8.99827Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>

          {/* Settings Button */}
          {canViewSettings && (
            <Link href={`/dashboard/projects/${project.id}/settings`} className="w-full">
              <div
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:brightness-90 transition-all duration-150"
                title="Project Settings"
              >
                <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.1872 5.44952L15.6691 4.55048C15.2308 3.78975 14.2595 3.52731 13.4977 3.96381V3.96381C13.1351 4.17742 12.7024 4.23803 12.295 4.13226C11.8877 4.02649 11.5392 3.76304 11.3263 3.4C11.1893 3.16925 11.1157 2.90642 11.1129 2.6381V2.6381C11.1253 2.20791 10.963 1.79103 10.663 1.48244C10.363 1.17385 9.95092 0.999823 9.52055 1H8.47674C8.05511 0.999995 7.65087 1.16801 7.35344 1.46686C7.05602 1.76571 6.88995 2.17076 6.89198 2.59238V2.59238C6.87948 3.46289 6.1702 4.16199 5.2996 4.1619C5.03128 4.15912 4.76845 4.08553 4.5377 3.94857V3.94857C3.77592 3.51207 2.80458 3.77451 2.36627 4.53524L1.81008 5.44952C1.3723 6.2093 1.63116 7.18004 2.38912 7.62095V7.62095C2.88181 7.9054 3.18532 8.43109 3.18532 9C3.18532 9.56891 2.88181 10.0946 2.38912 10.379V10.379C1.63212 10.817 1.37298 11.7854 1.81008 12.5429V12.5429L2.33579 13.4495C2.54116 13.8201 2.88573 14.0935 3.29325 14.2094C3.70078 14.3252 4.13766 14.2738 4.50722 14.0667V14.0667C4.87052 13.8547 5.30345 13.7966 5.70978 13.9053C6.1161 14.0141 6.46216 14.2806 6.67103 14.6457C6.80798 14.8765 6.88158 15.1393 6.88436 15.4076V15.4076C6.88436 16.2871 7.5973 17 8.47674 17H9.52055C10.397 17 11.1087 16.2917 11.1129 15.4152V15.4152C11.1109 14.9923 11.278 14.5861 11.5771 14.287C11.8762 13.9879 12.2824 13.8208 12.7053 13.8229C12.973 13.83 13.2347 13.9033 13.4672 14.0362V14.0362C14.227 14.474 15.1977 14.2151 15.6386 13.4571V13.4571L16.1872 12.5429C16.3996 12.1784 16.4578 11.7443 16.3492 11.3368C16.2405 10.9292 15.9738 10.5818 15.6082 10.3714V10.3714C15.2426 10.1611 14.9759 9.81367 14.8672 9.4061C14.7585 8.99854 14.8168 8.56446 15.0291 8.2C15.1672 7.95892 15.3671 7.75903 15.6082 7.62095V7.62095C16.3616 7.18028 16.6198 6.21521 16.1872 5.45714V5.45714V5.44952Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9.00239"
                    cy="9.00007"
                    r="2.19429"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          )}

          {/* Builder Button */}
          {canEdit && (
            <Link href={`/dashboard/projects/${project.id}/builder`} className="w-full">
              <div
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:brightness-90 transition-all duration-150"
                title="Project Builder"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 18" fill="none">
                  <path
                    d="M8.27666 14.3645H1.65674"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.3432 14.3645C18.3432 15.82 17.1633 17 15.7077 17C14.2522 17 13.0723 15.82 13.0723 14.3645C13.0723 12.9079 14.2522 11.729 15.7077 11.729C17.1633 11.729 18.3432 12.9079 18.3432 14.3645Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.7222 3.63546H18.3432"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.65625 3.63548C1.65625 5.0921 2.83619 6.27096 4.29173 6.27096C5.74728 6.27096 6.92721 5.0921 6.92721 3.63548C6.92721 2.17994 5.74728 1 4.29173 1C2.83619 1 1.65625 2.17994 1.65625 3.63548Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          )}

          {/* App Builder Button - Now Last */}
          <Link href={`/dashboard/projects/${project.id}/app-builder`} className="w-full">
            <div
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:brightness-90 transition-all duration-150 cursor-pointer"
              title="App Builder"
            >
              <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
                <path
                  d="M1.04736 12.1666C1.04736 12.1666 1.17196 13.6916 1.20091 14.1724C1.23952 14.8174 1.48871 15.5377 1.90462 16.0379C2.49162 16.7468 3.18304 16.9969 4.1061 16.9987C5.19148 17.0004 13.084 17.0004 14.1694 16.9987C15.0924 16.9969 15.7839 16.7468 16.3709 16.0379C16.7868 15.5377 17.036 14.8174 17.0754 14.1724C17.1035 13.6916 17.2281 12.1666 17.2281 12.1666"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.04199 3.2629V2.93737C6.04199 1.8669 6.9089 1 7.97937 1H10.2449C11.3145 1 12.1823 1.8669 12.1823 2.93737L12.1832 3.2629"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.11206 13.2206V12.0852"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 5.94747V8.98954C2.68292 10.0995 4.69926 10.8769 6.91215 11.1849C7.17713 10.2188 8.04842 9.51073 9.10749 9.51073C10.1499 9.51073 11.0387 10.2188 11.2862 11.1936C13.5078 10.8857 15.5321 10.1083 17.2237 8.98954V5.94747C17.2237 4.4611 16.0278 3.26428 14.5414 3.26428H3.69109C2.20472 3.26428 1 4.4611 1 5.94747Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  )
}
'use client'

import Image from "next/image";
import { projectSetting } from "@/actions/member";
import { PartnerLevel, PartnerType } from "@/types";

type componentProps = {
    project_id: string
}

export function ProjectSettingForm({ project_id }: componentProps) {
    return (
        <>
            <div>
                <h1>Project Setting</h1>
                <form action={projectSetting}>
                    <div>
                        <label htmlFor="name">name</label>
                        <input type="text" name="name" id="name" placeholder="name" />
                    </div>
                    <div>
                        <label htmlFor="description">description</label>
                        <input type="text" name="description" id="description" placeholder="description" />
                    </div>
                    <div>
                        <label htmlFor="year">year</label>
                        <input type="text" name="year" id="year" placeholder="year" />
                    </div>
                    <input type="hidden" name="project_id" value={project_id} />
                    {/* <div>
                        <label htmlFor="image">image</label>
                        <input type="image" name="image" id="image" placeholder="image" />
                    </div> */}
                    <button>Update</button>
                </form>
            </div>
        </>
    );
}

// export function TeamMemberForm({ project_id }: componentProps) {
//     return (
//     <>
//         <div>
//             <h1>Team member</h1>
//             <div>
//                 <span>Add member</span>
//                 <input type="text" name="search" id="search"/>
//             </div>
//             <form>

//             </form>
//         </div>
//     </>
//     )
// }

export function SponsorForm({ project_id }: componentProps) {
    return (
        <>
            <div>
                <h1>Sponsor</h1>
                <div>
                    <div>
                        <Image src="/app/favicon.ico" alt="partner" width={100} height={100} />
                        <span>Radi</span>
                    </div>
                </div>
                <div className="">
                    <form>
                        <div className="">
                            <label htmlFor="partnerLevel">Level</label>
                            <select name="partnerLevel" id="partnerLevel" placeholder="partner level">
                                {
                                    Object.keys(PartnerLevel).map((level, index) => (
                                        <option key={index} value={level}>{level}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="partnerType">Level</label>
                            <select name="partnerType" id="partnerType" placeholder="sponsor level">
                                {
                                    Object.keys(PartnerType).map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sponsorLink">Sponsor link</label>
                            <input type="text" name="sponsorLink" id="sponsorLink" />
                        </div>
                        <input type="submit" value={"Remove"} />      <input type="submit" value={"Remove"} />
                    </form>
                </div>
            </div>
        </>
    )
}

export default function ProjectSetting({ project_id }: componentProps) {

    return (
        <>
            <ProjectSettingForm project_id={project_id} />
            <SponsorForm project_id={project_id} />
        </>
    );
}
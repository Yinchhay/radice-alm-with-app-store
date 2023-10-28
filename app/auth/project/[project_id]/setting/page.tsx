import Form from "@/components/Form";
import { SponsorLevel, SponsorType } from "@/types";
import Image from "next/image";

interface IParams {
    project_id: string
}

export default function page({ params }: { params: IParams }) {

    const classes = {
        label: 'block text-gray-700 text-sm font-bold mb-2',
        input: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
        inputContainer: "flex max-w-xl",
        button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
    }

    return (
        <>
            {/* Project setting */}
            <div className="">
                Project setting
                <Form action={`/api/v1/auth/project/${params.project_id}/setting`}>
                    <div className={classes.inputContainer}>
                        <label className={classes.label} htmlFor="projectName">Project name</label>
                        <input type="text" className={classes.input} name="projectName" id="projectName" />
                    </div>
                    <div className={classes.inputContainer}>
                        <label className={classes.label} htmlFor="projectDescription">Project description</label>
                        <input type="text" className={classes.input} name="projectDescription" id="projectDescription" />
                    </div>
                    <div className={classes.inputContainer}>
                        <label className={classes.label} htmlFor="projectLogo">Project logo</label>
                        <input type="file" className={classes.input} name="projectLogo" id="projectLogo" />
                    </div>
                    <input type="submit" className={classes.button} />
                </Form>
            </div>
            {/* Team member */}
            <div className="">
                Team members
                {/* TODO: love u bro */}
                <button>Add members</button>
            </div>
            {/* Sponsors */}
            <div className="bg-slate-500">
                sponsors
                <div className="bg-gray-800 flex">
                    <div className="">
                        <Image src="/app/favicon.ico" alt="sponsor" width={100} height={100} />
                        <span>Radi</span>
                    </div>
                    <div className="">
                        <Form action={`/api/v1/auth/project/${params.project_id}/sponsor`}>
                            <div className="">
                                <label htmlFor="sponsorLevel">Level</label>
                                <select name="sponsorLevel" id="sponsorLevel" placeholder="sponsor level">
                                    {
                                        Object.keys(SponsorLevel).map((level, index) => (
                                            <option key={index} value={level}>{level}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="">
                                <label htmlFor="sponsorType">Level</label>
                                <select name="sponsorType" id="sponsorType" placeholder="sponsor level">
                                    {
                                        Object.keys(SponsorType).map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className={classes.inputContainer}>
                                <label className={classes.label} htmlFor="sponsorLink">Sponsor link</label>
                                <input type="text" className={classes.input} name="sponsorLink" id="sponsorLink" />
                            </div>
                            <input type="submit" className={classes.button} value={"Remove"} />
                        </Form>
                    </div>
                </div>
                <button>Add Sponsors</button>
            </div>
            {/* Make project public */}
            <div className="">
                <Form action={`/api/v1/auth/project/${params.project_id}/public`}>
                    <div className={classes.inputContainer}>
                        <label className={classes.label} htmlFor="projectPublicity">Make this project public</label>
                        <input type="checkbox" name="projectPublicity" id="projectPublicity" />
                    </div>
                </Form>
                <Form action={`/api/v1/auth/project/${params.project_id}/delete`}>
                    <div className={classes.inputContainer}>
                        <label className={classes.label} htmlFor="projectDelete">Delete this project</label>
                        <input type="submit" className={classes.input} name="projectDelete" id="projectDelete" value={"Delete project"}/>
                    </div>
                </Form>
            </div>
        </>
    )
}
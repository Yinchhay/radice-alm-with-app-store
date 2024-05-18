import Builder from "./builder";

type Params = {
    project_id: string;
};

export default function ProjectBuilderPage({ params }: { params: Params }) {
    return (
        <div>
            <Builder />
        </div>
    );
}

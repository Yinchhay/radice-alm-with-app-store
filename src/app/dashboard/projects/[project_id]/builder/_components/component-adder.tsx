import Button from "@/components/Button";
import Card from "@/components/Card";
import Tooltip from "@/components/Tooltip";

export default function ComponentAdder({
    onAddHeading,
    onAddImage,
    onAddParagraph,
    onAddList,
}: {
    onAddHeading: () => void;
    onAddImage: () => void;
    onAddParagraph: () => void;
    onAddList: () => void;
}) {
    return (
        <Card>
            <h1 className="font-bold text-lg mb-2">Components</h1>
            <div className="grid grid-cols-3 gap-4">
                <Tooltip title="Heading" className="w-full" position="bottom">
                    <Button
                        className="w-full text-lg font-bold"
                        square={true}
                        onClick={onAddHeading}
                    >
                        H
                    </Button>
                </Tooltip>
                <Tooltip title="Image" className="w-full" position="bottom">
                    <Button
                        className="w-full text-lg font-bold"
                        square={true}
                        onClick={onAddImage}
                    >
                        I
                    </Button>
                </Tooltip>
                <Tooltip title="Paragraph" className="w-full" position="bottom">
                    <Button
                        className="w-full text-lg font-bold"
                        square={true}
                        onClick={onAddParagraph}
                    >
                        P
                    </Button>
                </Tooltip>
                <Tooltip title="List" className="w-full" position="bottom">
                    <Button
                        className="w-full text-lg font-bold"
                        square={true}
                        onClick={onAddList}
                    >
                        L
                    </Button>
                </Tooltip>
            </div>
        </Card>
    );
}

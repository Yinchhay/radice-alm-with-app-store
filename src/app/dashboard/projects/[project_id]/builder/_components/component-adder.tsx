import Button from "@/components/Button";
import Card from "@/components/Card";

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
            <h1 className="font-bold text-lg mb-4">Components</h1>
            <div className="grid grid-cols-3 gap-4 font-bold">
                <Button className="w-12" square={true} onClick={onAddHeading}>
                    H
                </Button>
                <Button className="w-12" square={true} onClick={onAddImage}>
                    I
                </Button>
                <Button className="w-12" square={true} onClick={onAddParagraph}>
                    P
                </Button>
                <Button className="w-12" square={true} onClick={onAddList}>
                    L
                </Button>
            </div>
        </Card>
    );
}

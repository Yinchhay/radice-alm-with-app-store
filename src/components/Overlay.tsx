export default function Overlay({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen grid place-items-center z-50">
            <button
                onClick={onClose}
                className="fixed top-0 left-0 z-10 h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20"
            ></button>
            <div className="z-20">{children}</div>
        </div>
    );
}

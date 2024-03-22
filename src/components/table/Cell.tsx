import { forwardRef } from "react";

type TableCell = React.TdHTMLAttributes<HTMLTableCellElement> & {
    children: React.ReactNode;
    className?: string;
};

const Cell = forwardRef<HTMLTableCellElement, TableCell>(
    ({ className, children, ...props }, ref) => {
        let cellStyle = "text-black px-6 py-4 rounded-md";
        return (
            <td
                ref={ref}
                className={[cellStyle, className].join(" ")}
                {...props}
            >
                {children}
            </td>
        );
    },
);

export default Cell;

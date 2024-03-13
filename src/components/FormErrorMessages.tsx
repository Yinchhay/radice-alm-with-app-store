import { T_ZodErrorFormatted } from "@/lib/form";

export default function FormErrorMessages<T>({ errors }: {
    errors: T_ZodErrorFormatted<T>;
}) {
    return (
        <div className="flex flex-col items-start my-1">
            {Object.entries(errors).map(([key, value]: [string, unknown]) => (
                <p key={key}>{value as string}</p>
            ))}
        </div>
    );
};
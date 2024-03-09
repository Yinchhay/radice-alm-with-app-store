import { T_ZodErrorFormatted } from "@/lib/form";

export default function FormErrorMessages<T>({ errors }: {
    errors: T_ZodErrorFormatted<T>;
}) {
    return (
        <div>
            {Object.entries(errors).map(([key, value]) => (
                <p key={key}>{value as string}</p>
            ))}
        </div>
    );
};
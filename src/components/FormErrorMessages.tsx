import { T_ZodErrorFormatted } from "@/lib/form";

export default function FormErrorMessages<T>({
    errors,
}: {
    errors: T_ZodErrorFormatted<T>;
}) {
    return (
        <div className="my-2 py-1 px-3 rounded-sm bg-red-100 ">
            {Object.entries(errors).map(([key, value]: [string, unknown]) => (
                <p key={key} className="text-red-500">
                    {value as string}
                </p>
            ))}
        </div>
    );
}

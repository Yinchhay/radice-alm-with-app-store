import { z } from "zod";

export const skillSetLevelSchema = z.enum(["Know", "Do", "Teach"], {
    required_error: "Skill level is required",
    invalid_type_error: "Skill level must be one of 'Know', 'Do', 'Teach'",
});
export const skillSetSchema = z.object({
    label: z
        .string()
        .trim()
        .min(1, {
            message: "Label is required",
        })
        .max(75, {
            message: "Label must be less than or equal to 75 characters",
        }),
    level: skillSetLevelSchema,
});

export const updateProfileInformationFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, {
            message: "First name is required",
        })
        .max(50, {
            message: "First name must be less than or equal to 50 characters",
        }),
    lastName: z
        .string()
        .trim()
        .min(1, {
            message: "Last name is required",
        })
        .max(50, {
            message: "Last name must be less than or equal to 50 characters",
        }),
    description: z.string().trim().max(255, {
        message: "Description must be less than or equal to 255 characters",
    }),
    // for fallback if no profile is being updated
    currentProfileLogo: z.string().trim().optional(),
    profileLogo: z
        .string()
        .trim()
        .max(2083, {
            message: "Logo is too long, max 2083 characters",
        })
        .optional(),
    // no duplicate skillSet label
    skillSet: z.array(skillSetSchema).refine(
        (value) => {
            const labels = value.map((v) => v.label);
            return new Set(labels).size === labels.length;
        },
        {
            message: "Duplicate skill set label(s) are not allowed",
        },
    ),
});

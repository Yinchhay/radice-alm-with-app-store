import { z } from "zod";


export const skillSetSchema = z.object({
    skill: z
        .string()
        .trim()
        .min(1, {
            message: "Skill is required",
        })
        .max(75, {
            message: "Skill must be less than or equal to 75 characters",
        }),
    proficiency: z.array(z.number()),
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
    description: z.string().trim().max(500, {
        message: "Description must be less than or equal to 500 characters",
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
    skillSet: z.array(skillSetSchema).refine(
        (value) => {
            const skills = value.map((v) => v.skill);
            return new Set(skills).size === skills.length;
        },
        {
            message: "Duplicate skill(s) are not allowed",
        },
    ),
});

export const changePasswordSchema = z
    .object({
        oldPassword: z
            .string()
            .trim()
            .min(8, {
                message: "Old password must be at least 8 characters long",
            })
            .max(255, {
                message: "Old password must be less than 255 characters",
            }),
        newPassword: z
            .string()
            .trim()
            .min(8, {
                message: "New password must be at least 8 characters long",
            })
            .max(255, {
                message: "New password must be less than 255 characters",
            }),
        newConfirmPassword: z
            .string()
            .trim()
            .min(8, {
                message:
                    "Confirm new password must be at least 8 characters long",
            })
            .max(255, {
                message:
                    "Confirm new password must be less than 255 characters",
            }),
    })
    .refine((value) => value.newPassword === value.newConfirmPassword, {
        message: "New password and confirm new password does not match",
        path: ["newConfirmPassword"],
    })
    .refine((value) => value.oldPassword !== value.newPassword, {
        message: "Old password and new password must be different",
        path: ["newPassword"],
    });

export const changeEmailSchema = z.object({
    currentEmail: z
        .string()
        .email({
            message: "Current Email is invalid",
        })
        .trim()
        .min(1, {
            message: "Current Email is required",
        })
        .max(255, {
            message:
                "Current Email must be less than or equal to 255 characters",
        }),
});

export const verifyCurrentEmailCodeSchema = z
    .object({
        code: z
            .string()
            .trim()
            .min(8, {
                message: "Verification code must be 8 characters",
            })
            .max(8, {
                message: "Verification code must be 8 characters",
            }),
        newEmail: z
            .string()
            .email({
                message: "New Email is invalid",
            })
            .trim()
            .min(1, {
                message: "New Email is required",
            })
            .max(255, {
                message:
                    "New Email must be less than or equal to 255 characters",
            }),
        currentEmail: z
            .string()
            .email({
                message: "Current Email is invalid",
            })
            .trim()
            .min(1, {
                message: "Current Email is required",
            })
            .max(255, {
                message:
                    "Current Email must be less than or equal to 255 characters",
            }),
    })
    .refine((value) => value.newEmail !== value.currentEmail, {
        message: "New email and current email must be different",
    });

export const verifyNewEmailCodeSchema = z.object({
    code: z
        .string()
        .trim()
        .min(8, {
            message: "Verification code must be 8 characters",
        })
        .max(8, {
            message: "Verification code must be 8 characters",
        }),
});

export const validateNewEmailSchema = z
    .string({
        required_error: "New Email is required",
    })
    .email({
        message: "New Email is invalid",
    })
    .trim()
    .min(1, {
        message: "New Email is required",
    })
    .max(255, {
        message: "New Email must be less than or equal to 255 characters",
    });

export const changeGithubSchema = z.object({
    oldPassword: z
        .string()
        .trim()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .max(255, {
            message: "Password must be less than 255 characters",
        }),
});
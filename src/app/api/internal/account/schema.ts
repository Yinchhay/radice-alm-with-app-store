import { UserSkillSetLevel } from "@/drizzle/schema";
import { z } from "zod";

export const skillSetLevelSchema = z.nativeEnum(UserSkillSetLevel, {
    required_error: "Skill level is required",
    invalid_type_error: "Skill level invalid",
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

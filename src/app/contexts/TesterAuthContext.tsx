"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================

export interface Tester {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    profileUrl: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PasswordResetTokenPayload {
    id: string;
    email: string;
    type: "password-reset";
    iat?: number;
    exp?: number;
}

export interface TesterAuthContextType {
    tester: Tester | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    register: (
        data: RegisterData,
    ) => Promise<{ success: boolean; error?: string }>;
    updateProfile: (
        data: Partial<Tester>,
    ) => Promise<{ success: boolean; error?: string }>;
    changePassword: (
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
    ) => Promise<{ success: boolean; error?: string }>;
    forgotPassword: (
        email: string,
    ) => Promise<{ success: boolean; error?: string; message?: string }>;
    resetPassword: (
        token: string,
        newPassword: string,
        confirmPassword: string,
    ) => Promise<{ success: boolean; error?: string; message?: string }>;
    refreshTester: () => Promise<void>;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
}

// ============================================================================
// CONTEXT
// ============================================================================

const TesterAuthContext = createContext<TesterAuthContextType | undefined>(
    undefined,
);

// ============================================================================
// PROVIDER
// ============================================================================

interface TesterAuthProviderProps {
    children: ReactNode;
}

export function TesterAuthProvider({ children }: TesterAuthProviderProps) {
    const [tester, setTester] = useState<Tester | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check if tester is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/tester/profile", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setTester(data.tester);
            } else {
                setTester(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setTester(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("/api/tester/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setTester(data.tester);
                return { success: true };
            } else {
                return { success: false, error: data.error || "Login failed" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await fetch("/api/tester/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.error || "Registration failed",
                };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const logout = async () => {
        try {
            const response = await fetch("/api/tester/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            setTester(null);

            router.push("/testers/login");
        } catch (error) {
            console.error("Logout error:", error);
            setTester(null);
            router.push("/testers/login");
        }
    };

    const updateProfile = async (data: Partial<Tester>) => {
        try {
            const response = await fetch("/api/tester/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setTester(result.tester);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.error || "Profile update failed",
                };
            }
        } catch (error) {
            console.error("Profile update error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const changePassword = async (
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
    ) => {
        try {
            const response = await fetch("/api/tester/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmNewPassword: confirmPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.error || "Password change failed",
                };
            }
        } catch (error) {
            console.error("Password change error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            const response = await fetch("/api/tester/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                return { 
                    success: true, 
                    message: result.message || "Password reset email sent" 
                };
            } else {
                return {
                    success: false,
                    error: result.error || "Failed to send reset email",
                };
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const resetPassword = async (
        token: string,
        newPassword: string,
        confirmPassword: string,
    ) => {
        try {
            const response = await fetch("/api/tester/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                return { 
                    success: true, 
                    message: result.message || "Password reset successfully" 
                };
            } else {
                return {
                    success: false,
                    error: result.error || "Failed to reset password",
                };
            }
        } catch (error) {
            console.error("Reset password error:", error);
            return {
                success: false,
                error: "Network error. Please try again.",
            };
        }
    };

    const refreshTester = async () => {
        await checkAuth();
    };

    const contextValue: TesterAuthContextType = {
        tester,
        isLoading,
        isAuthenticated: !!tester,
        login,
        logout,
        register,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        refreshTester,
    };

    return (
        <TesterAuthContext.Provider value={contextValue}>
            {children}
        </TesterAuthContext.Provider>
    );
}

// ============================================================================
// HOOK
// ============================================================================

export function useTesterAuth() {
    const context = useContext(TesterAuthContext);
    if (context === undefined) {
        throw new Error(
            "useTesterAuth must be used within a TesterAuthProvider",
        );
    }
    return context;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to require tester authentication - redirects to login if not authenticated
 */
export function useRequireTesterAuth() {
    const { tester, isLoading } = useTesterAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !tester) {
            router.push("/testers/login");
        }
    }, [tester, isLoading, router]);

    return { tester, isLoading, isAuthenticated: !!tester };
}

/**
 * Hook to redirect authenticated testers away from auth pages
 */
export function useRedirectIfAuthenticated(
    redirectTo: string = "/testers/dashboard",
) {
    const { tester, isLoading } = useTesterAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && tester) {
            router.push(redirectTo);
        }
    }, [tester, isLoading, router, redirectTo]);

    return { isLoading };
}

// ============================================================================
// HIGHER-ORDER COMPONENTS
// ============================================================================

/**
 * HOC to protect pages that require tester authentication
 */
export function withTesterAuth<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function AuthenticatedComponent(props: P) {
        const { tester, isLoading } = useRequireTesterAuth();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (!tester) {
            return null; // Will redirect in useRequireTesterAuth
        }

        return <Component {...props} />;
    };
}

/**
 * HOC to redirect authenticated testers away from auth pages
 */
export function withTesterGuest<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function GuestComponent(props: P) {
        const { isLoading } = useRedirectIfAuthenticated();

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        return <Component {...props} />;
    };
}
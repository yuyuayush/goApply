"use client"

import {createContext, useContext, useState, useEffect, ReactNode} from 'react'
import {User, UserProfile} from '@/models/user'
import axios from "axios";


interface AuthContextType {
    user: User | null
    token: String | null
    profile: UserProfile | null
    isAuthenticated: boolean
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
    signOut: () => void
    updateProfile: (profileData: Partial<UserProfile>) => Promise<void>
    resumeRegistration: () => number // Returns step to resume from
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing session on mount
        const checkSession = async () => {
            try {
                // Prevent re-fetch if profile is already loaded
                if (profile) return;

                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("⚠️ No token found in localStorage");
                    setIsLoading(false);
                    return;
                }

                // Fetch user session from backend
                const res = await axios.get("http://localhost:8080/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Update user and profile if received
                const fetchedUser = res.data?.data || null;
                const fetchedProfile = res.data?.data || null;

                if (fetchedUser) {
                    setUser(fetchedUser);
                    localStorage.setItem("user", JSON.stringify(fetchedUser));
                }

                if (fetchedProfile) {
                    setProfile(fetchedProfile);
                    localStorage.setItem("profile", JSON.stringify(fetchedProfile));
                }

                // If backend didn’t return anything, fallback to localStorage
                if (!fetchedUser) {
                    const savedUser = localStorage.getItem("user");
                    if (savedUser) setUser(JSON.parse(savedUser));
                }

                if (!fetchedProfile) {
                    const savedProfile = localStorage.getItem("profile");
                    if (savedProfile) setProfile(JSON.parse(savedProfile));
                }

            } catch (error) {
                console.error("❌ Error checking session:", error);

                // Handle expired/invalid tokens
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        console.warn("⚠️ Session expired or invalid token. Clearing user data...");
                    } else {
                        console.warn("⚠️ Unexpected error while validating session.");
                    }
                }

                // Clear corrupted or invalid session data
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("profile");
                setUser(null);
                setProfile(null);

            } finally {
                setIsLoading(false);
            }
        };


        checkSession()
    }, [])

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // 🔹 Call backend login API
            const res = await fetch(`http://localhost:8080/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            // 🔹 Parse response JSON once
            const data = await res.json();

            // 🔹 Handle backend errors
            if (!res.ok) {
                throw new Error(data.error || data.message || "Login failed");
            }

            // ✅ Correctly extract nested data
            const {token, user} = data.data;

            // 🔹 Save user and token locally
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem(`profile_${user._id}`, JSON.stringify(user));

            setUser(user);
            setProfile(user);

            console.log("✅ Login successful", user);

            return user;
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Sign in error:", err.message);
                throw new Error(err.message);
            } else {
                console.error("Unknown sign in error:", err);
                throw new Error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        setIsLoading(true);
        try {
            // 🔹 Send signup request to backend
            const res = await fetch(`http://localhost:8080/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            // 🔹 Parse response once
            const data = await res.json();

            // 🔹 Handle backend errors
            if (!res.ok) {
                throw new Error(data.error || data.message || "Signup failed");
            }

            // ✅ Extract token + user properly
            const {token, user} = data.data;

            // 🔹 Store user + token locally
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            // (Optional) track registered users locally
            const existingUsers = localStorage.getItem("registeredUsers");
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            users.push(user);
            localStorage.setItem("registeredUsers", JSON.stringify(users));

            console.log("✅ Signup successful:", user);
            return user;
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Signup error:", err.message);
                throw new Error(err.message);
            } else {
                console.error("Unknown signup error:", err);
                throw new Error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const signOut = () => {
        setUser(null)
        setProfile(null)
        localStorage.removeItem('user')
        localStorage.removeItem('profile')
    }


    const updateProfile = async (profileData: Partial<UserProfile>) => {
        if (!user) return;

        try {
            const updatedProfile: UserProfile = {
                userId: user.id,
                ...profile,
                ...profileData,
                updatedAt: new Date(),
                createdAt: profile?.createdAt || new Date(),
            };

            const updatedUser: User = {
                ...user,
                firstName: (profileData as any).firstName || user.firstName,
                lastName: (profileData as any).lastName || user.lastName,
                profileCompleted: true,
                registrationStep: 8,
                updatedAt: new Date(),
            };

            // 🟢 1. Send to backend
            const token = localStorage.getItem("token"); // if you’re storing JWT in localStorage
            const headers = token ? {Authorization: `Bearer ${token}`} : {};

            // Update profile in DB
            await axios.put(`http://localhost:8080/api/auth/profile`, updatedProfile, {headers});

            // // Update basic user info if necessary
            // await axios.patch(`/api/user/${user.id}`, {
            //     firstName: updatedUser.firstName,
            //     lastName: updatedUser.lastName,
            //     profileCompleted: true,
            //     registrationStep: 8,
            // }, { headers });

            // 🟡 2. Update frontend state
            setProfile(updatedProfile);
            setUser(updatedUser);

            // 🟠 3. Update localStorage
            localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            const existingUsers = localStorage.getItem("registeredUsers");
            if (existingUsers) {
                const users = JSON.parse(existingUsers);
                const userIndex = users.findIndex((u: User) => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = updatedUser;
                    localStorage.setItem("registeredUsers", JSON.stringify(users));
                }
            }
        } catch (error) {
            console.error("Profile update error:", error);
            throw error;
        }
    };

    const resumeRegistration = (): number => {
        return user?.registrationStep || 1
    }

    const token = localStorage.getItem("token");


    const value = {
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        resumeRegistration, token,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
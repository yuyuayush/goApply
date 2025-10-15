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
                if (profile) return;
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("⚠️ No token found in localStorage");
                    setIsLoading(false);
                    return;
                }

                // ✅ Await the axios call and handle the response
                const res = await axios.get("http://localhost:3000/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // ✅ Update user and profile from backend first
                if (res.data?.user) setUser(res.data.user);
                if (res.data?.profile) setProfile(res.data.profile);

                // ✅ Also update localStorage to keep them in sync
                if (res.data?.user) localStorage.setItem("user", JSON.stringify(res.data.user));
                if (res.data?.profile) localStorage.setItem("profile", JSON.stringify(res.data.profile));

                // ✅ Fallback: load from localStorage if API didn’t return anything
                const savedUser = localStorage.getItem("user");
                const savedProfile = localStorage.getItem("profile");

                if (savedUser && !res.data?.user) setUser(JSON.parse(savedUser));
                if (savedProfile && !res.data?.profile) setProfile(JSON.parse(savedProfile));

            } catch (error) {
                console.error("❌ Error checking session:", error);

                // ✅ Handle unauthorized user (token invalid or expired)
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.warn("⚠️ Session expired or invalid token. Clearing user data...");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("profile");
                    setUser(null);
                    setProfile(null);
                }
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
            const res = await fetch(`http://localhost:3000/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            // 🔹 Handle backend errors
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Login failed");
            }

            const data = await res.json();
            const {user, token} = data;

            // 🔹 Save user and token locally
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            setUser(user);

            // (Optional) Fetch user profile from backend (if available)
            const profileRes = await fetch(
                `http://localhost:3000/api/auth/profile`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setProfile(profileData.profile);
                localStorage.setItem(`profile_${user._id}`, JSON.stringify(profileData.profile));
            }

            console.log("✅ Login successful");
            return user;
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string
    }) => {
        setIsLoading(true);
        try {
            // Send signup request to backend
            const res = await fetch(`http://localhost:3000/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Signup failed");
            }

            const data = await res.json();
            const {user, token} = data;

            // ✅ Store user + token locally
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            // (Optional) Keep track of all registered users — still local for demo/testing
            const existingUsers = localStorage.getItem("registeredUsers");
            const users = existingUsers ? JSON.parse(existingUsers) : [];
            users.push(user);
            localStorage.setItem("registeredUsers", JSON.stringify(users));

            console.log("Signup successful ✅");
            return user;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
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
            await axios.put(`/api/auth/profile`, updatedProfile, {headers});

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
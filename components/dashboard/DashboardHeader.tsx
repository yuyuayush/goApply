"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function DashboardHeader() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    // --- Search State ---
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<{ universities: any[], programs: any[] }>({ universities: [], programs: [] })
    const [searchLoading, setSearchLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false)
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // --- Debounced search ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ universities: [], programs: [] })
            return
        }

        const timeout = setTimeout(async () => {
            setSearchLoading(true)
            try {
                const [uniRes, progRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/search/universities?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
                    fetch(`http://localhost:8080/api/search/programs?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
                ])
                setSearchResults({ universities: uniRes.universities || [], programs: progRes.programs || [] })
                setShowDropdown(true)
            } catch (err) {
                console.error("Search error", err)
            } finally {
                setSearchLoading(false)
            }
        }, 300) // debounce 300ms

        return () => clearTimeout(timeout)
    }, [searchQuery])

    const handleLogout = () => {
        signOut()
        router.push('/')
    }

    const getUserInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        }
        return user?.email?.[0]?.toUpperCase() || 'U'
    }

    const getUserDisplayName = () => {
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
        return user?.email || 'User'
    }

    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-6 flex items-center justify-between relative z-50">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search programs, universities..."
                        className="pl-10 w-64 bg-background/50 backdrop-blur border-border/50"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => searchResults.universities.length > 0 || searchResults.programs.length > 0 ? setShowDropdown(true) : null}
                    />

                    {/* Dropdown */}
                    {showDropdown && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-auto bg-card border border-border rounded-lg shadow-lg z-50"
                        >
                            <div className="p-2">
                                {searchLoading && <p className="text-sm text-muted-foreground">Searching...</p>}

                                {!searchLoading && (
                                    <>
                                        {searchResults.universities.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">Universities</p>
                                                {searchResults.universities.map(u => (
                                                    <button
                                                        key={u._id}
                                                        className="w-full text-left px-2 py-1 hover:bg-accent rounded"
                                                        onClick={() => {
                                                            router.push(`/dashboard/university/${u._id}`)
                                                            setShowDropdown(false)
                                                        }}
                                                    >
                                                        {u.name} ({u.country})
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.programs.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">Programs</p>
                                                {searchResults.programs.map(p => (
                                                    <button
                                                        key={p._id}
                                                        className="w-full text-left px-2 py-1 hover:bg-accent rounded"
                                                        onClick={() => {
                                                            router.push(`/dashboard/program/${p._id}`)
                                                            setShowDropdown(false)
                                                        }}
                                                    >
                                                        {p.name} ({p.degreeType})
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.universities.length === 0 && searchResults.programs.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No results found</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                </Button>

                {/* User Profile Menu */}
                <div className="relative z-[999998]" ref={profileMenuRef}>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 p-2 hover:bg-accent"
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", profileMenuOpen && "rotate-180")} />
                    </Button>

                    <div className={cn(
                        "absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top-right z-[999999]",
                        profileMenuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                    )}>
                        <div className="p-4 border-b border-border">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    router.push('/dashboard/profile')
                                    setProfileMenuOpen(false)
                                }}
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Button>
                            <div className="border-t border-border my-2" />
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive hover:text-destructive"
                                onClick={() => {
                                    handleLogout()
                                    setProfileMenuOpen(false)
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

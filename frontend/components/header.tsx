"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Globe, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()
    const isHomePage = pathname === "/"

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        })
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled || !isHomePage ? "bg-white border-b shadow-sm" : "bg-transparent",
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <svg
                            className="text-rose-500 h-8 w-8"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="presentation"
                            focusable="false"
                        >
                            <path
                                d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.615l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 6.083-12.989 7.707-16.034C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.692l-.345.836c-.427 1.071-.573 1.655-.605 2.24l-.009.33v.206c0 2.329 1.607 4.39 4.5 4.39.897 0 1.937-.353 3.242-1.174 1.081-.68 2.185-1.613 3.243-2.622l.022-.022c1.116 1.06 2.25 2.01 3.352 2.68 1.322.79 2.375 1.118 3.28 1.118 2.893 0 4.5-2.061 4.5-4.39 0-.656-.162-1.438-.704-2.76l-.24-.6-.238-.58c-1.043-2.552-5.284-11.493-7.057-14.812l-.25-.513C18.053 3.539 17.24 3 16 3zm0 10.5c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        <div className="text-rose-500 font-bold text-2xl ml-1">airbnb</div>
                    </Link>

                    {/* Compact Search Bar - Hidden on home page */}
                    {!isHomePage && (
                        <div className="hidden md:flex items-center border rounded-full py-2 px-2 shadow-sm hover:shadow-md transition cursor-pointer">
                            <div className="px-3 font-medium">Anywhere</div>
                            <div className="h-4 border-r border-gray-300"></div>
                            <div className="px-3 font-medium">Any week</div>
                            <div className="h-4 border-r border-gray-300"></div>
                            <div className="px-3 text-gray-500">Add guests</div>
                            <div className="bg-rose-500 rounded-full p-2 ml-2">
                                <Search className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" className="hidden md:flex rounded-full font-medium">
                            Airbnb your home
                        </Button>
                        <Button variant="ghost" className="hidden md:flex rounded-full p-2">
                            <Globe className="h-5 w-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full border-gray-300 flex items-center gap-2">
                                    <Menu className="h-4 w-4" />
                                    <User className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem className="cursor-pointer font-medium">Sign up</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Log in</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">Host your home</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Help Center</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}


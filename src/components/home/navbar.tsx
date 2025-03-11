import { Camera, LogOut, UserCircleIcon } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout } from "@/app/(public)/auth/auth";
import { SidebarTrigger } from '../ui/sidebar';

export default function Navbar() {

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-300 flex items-center px-2 pr-5 z-50 " >
            <div className="flex items-center justify-between w-full" >
                {/* Menu and Logo */}
                < div className="flex items-center flex-shrink-0" >
                    <SidebarTrigger></SidebarTrigger>
                    <Link href="/" >
                        <Camera color="black" size={32} className="ml-4" />
                    </Link>
                </div>
                {/* Login/User buttons */}

                <div className="flex-shrink-0 items-center flex gap-4" >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="px-4 py-2 text-sm font-medium">
                                <UserCircleIcon className="mr-2" />
                                My Account
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <form action={logout}>
                                <DropdownMenuItem >
                                    <button>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </button>
                                </DropdownMenuItem>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button variant='outline' className="px-4 py-2 text-sm font-medium">
                        <UserCircleIcon className="mr-2" />
                        Sign in
                    </Button> */}
                </div>
            </div>
        </nav>
    )
}
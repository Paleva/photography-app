'use client'

import { Camera, UserCircleIcon } from 'lucide-react';
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Navbar() {

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-300 flex items-center px-2 pr-5 z-50" >
            <div className="flex items-center justify-between w-full" >
                {/* Menu and Logo */}
                < div className="flex items-center flex-shrink-0" >
                    <SidebarTrigger />
                    <Link href="/" >
                        <Camera color="black" size={32} className="ml-4" />
                    </Link>
                </div>
                {/* Log in button */}
                <div className="flex-shrink-0 items-center flex gap-4" >
                    <Link href="/login" >
                        <Button variant='outline' className="px-4 py-2 text-sm font-medium">
                            <UserCircleIcon />
                            Sign in
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
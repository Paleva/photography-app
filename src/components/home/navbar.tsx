import { Camera, UserCircleIcon } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout, verifySession } from "@/app/(public)/auth/session";
import { SidebarTrigger } from '../ui/sidebar';


export default async function Navbar({ sidebarTrigger }: { sidebarTrigger?: boolean }) {

    const session = await verifySession();


    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-300 flex items-center px-2 pr-5 z-50 " >
            <div className="flex items-center justify-between w-full" >
                {/* Menu and Logo */}
                < div className="flex items-center flex-shrink-0" >
                    {sidebarTrigger ?
                        <SidebarTrigger></SidebarTrigger>
                        : null
                    }
                    <Link href="/" >
                        <Camera color="black" size={35} className="ml-4" />
                    </Link>
                </div>
                {/* Login/User buttons */}
                {session ?
                    <div className="flex-shrink-0 items-center flex gap-4" >
                        <DropdownMenu modal={false} >
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="px-4 py-2 text-md font-medium ">
                                    <UserCircleIcon />
                                    {session.username}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <Link href='/[username]' as={`/${session.username}`}>
                                    <DropdownMenuItem className="text-lg">Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="text-lg">Settings</DropdownMenuItem>
                                <form action={async () => {
                                    "use server"
                                    await logout()
                                }}>
                                    <DropdownMenuItem className="text-lg" >
                                        <button >
                                            {/* <LogOut className="mr-2 h-4 w-4 ml-4" /> */}
                                            <span>Log out</span>
                                        </button>
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div> :
                    <div>
                        <Link href="/login">
                            <Button variant='outline' className="px-4 py-2 text-sm font-medium">
                                <UserCircleIcon className="mr-2" />
                                Sign in
                            </Button>
                        </Link>
                    </div>
                }
            </div>
        </nav>
    )
}
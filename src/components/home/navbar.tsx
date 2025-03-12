import { Camera, LogOut, UserCircleIcon } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logout, getSession } from "@/app/(public)/auth/session";
import { SidebarTrigger } from '../ui/sidebar';


export default async function Navbar() {

    const session = await getSession();
    console.log(session)
    const username = session?.username as string

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-300 flex items-center px-2 pr-5 z-50 " >
            <div className="flex items-center justify-between w-full" >
                {/* Menu and Logo */}
                < div className="flex items-center flex-shrink-0" >

                    <SidebarTrigger></SidebarTrigger>

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
                                    {username}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-lg">Profile</DropdownMenuItem>
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
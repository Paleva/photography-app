import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./navbar";
import HomeSidebar from "./sidebar";
import React from "react";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <SidebarProvider className="">
            <div className='w-full'>
                <Navbar />
                <div className="flex min-h-screen pt-[4rem]">
                    <HomeSidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
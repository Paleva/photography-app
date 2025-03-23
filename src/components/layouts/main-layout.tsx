import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/home/navbar";
import HomeSidebar from "@/components/home/sidebar";
import React from "react";



export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider >
            <div className='w-full'>
                <Navbar sidebarTrigger={true} />
                <div className="flex pt-[4rem]">
                    <HomeSidebar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
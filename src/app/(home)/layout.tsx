import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./navbar";
import React from "react";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <SidebarProvider>
            <div>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    {children}
                    <footer className="w-full bg-gray-300 text-white p-4 mt-auto fixed bottom-0 left-0">
                        <p className="text-black text-center"> 2025 MY web</p>
                    </footer>
                </div>
            </div>
        </SidebarProvider>
    )
}
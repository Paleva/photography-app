import { SidebarTrigger } from "@/components/ui/sidebar";

export function HomeNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-o=0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            <div className="flex items-center gap-4 w-full">
                <SidebarTrigger />
            </div>
        </nav>
    )
}
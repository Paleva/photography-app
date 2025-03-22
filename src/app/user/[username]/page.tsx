import Navbar from "@/components/home/navbar"
import HomeSidebar from "@/components/home/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


export default async function UserPage({ params }: { params: { username: string } }) {
    const { username } = await params

    return (
        <div>
            <Navbar sidebarTrigger={false} />
        </div>
    )

}
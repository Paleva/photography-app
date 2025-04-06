
import { verifySession } from '@/app/(public)/auth/session'
import { MainSection } from '@/components/home/MainSection'
import { PersonalSection } from '@/components/home/PersonalSection'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'


export default async function HomeSidebar() {

    const user = await verifySession()

    return (
        <Sidebar className='pt-16 z-40' collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSection username={user?.username || ''} />
                <Separator />
                <PersonalSection username={user?.username || ''} />
            </SidebarContent>
        </Sidebar>
    )
}





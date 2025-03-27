
import { verifySession } from '@/app/(public)/auth/session'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { HomeIcon, Image, ImagePlus, ThumbsUp, UserCircleIcon } from 'lucide-react'
import Link from 'next/link'

export default function HomeSidebar() {
    return (
        <Sidebar className='pt-16 z-40' collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSection />
                <Separator />
                <PersonalSection />
            </SidebarContent>
        </Sidebar>
    )
}


async function MainSection() {


    const user = await verifySession()


    const items = [
        {
            title: "Home",
            url: "/",
            icon: HomeIcon
        },
        {
            title: "Profile",
            url: `/user/${user.username}`,
            icon: UserCircleIcon,
            auth: true
        }
    ]

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} >
                            <SidebarMenuButton tooltip={item.title}
                                asChild
                                isActive={false}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className='text-md font-medium'>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

async function PersonalSection() {

    let user = await verifySession()

    const items = [
        {
            title: "Liked photos",
            url: `/user/${user.username}/liked`,
            icon: ThumbsUp,
            auth: true
        },
        {
            title: "Uploads",
            url: `/user/${user.username}/uploads`,
            icon: Image,
            auth: true
        },
        {
            title: "Upload photo",
            url: '/upload',
            icon: ImagePlus,
            auth: true
        }
    ]


    return (
        <SidebarGroup >
            <SidebarGroupLabel> YOU </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}
                                asChild
                                isActive={false}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className='text-sm'>{item.title}</span>
                                </Link >
                            </SidebarMenuButton >
                        </SidebarMenuItem >
                    ))
                    }
                </SidebarMenu >
            </SidebarGroupContent >
        </SidebarGroup >
    )
}
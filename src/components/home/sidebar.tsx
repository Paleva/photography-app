'use client'

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


function MainSection() {

    const items = [
        {
            title: "Home",
            url: "/",
            icon: HomeIcon
        },
        {
            title: "Profile",
            url: "/profile",
            icon: UserCircleIcon,
            auth: true
        }
    ]

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}
                                asChild
                                isActive={false}
                                onClick={() => { }}>
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className='text-sm'>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

function PersonalSection() {

    const items = [
        {
            title: "Liked photos",
            url: '/user/liked',
            icon: ThumbsUp,
            auth: true
        },
        {
            title: "Uploads",
            url: '/user/uploads',
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
                                onClick={() => { }}>
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
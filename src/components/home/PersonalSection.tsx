'use client'

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Image, ImagePlus, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export function PersonalSection({ username }: { username: string }) {
    const pathname = usePathname()
    const items = [
        {
            title: "Liked photos",
            url: username ? `/user/${username}/liked` : '/user',
            icon: ThumbsUp,
            auth: true
        },
        {
            title: "Uploads",
            url: username ? `/user/${username}/uploads` : '/user',
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
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
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

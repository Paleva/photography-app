'use client'

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { HomeIcon, UserCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainSection({ username }: { username: string }) {

    const pathname = usePathname()

    const items = [
        {
            title: "Home",
            url: "/",
            icon: HomeIcon
        },
        {
            title: "Profile",
            url: username ? `/user/${username}` : '/login',
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
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
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
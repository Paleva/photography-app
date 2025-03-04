
import { SidebarProvider } from '@/components/ui/sidebar';
import { HomeNavbar } from './homenavbar';
interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <SidebarProvider>
            <div>
                <HomeNavbar></HomeNavbar>
                {children}
            </div>
        </SidebarProvider >
    );
}
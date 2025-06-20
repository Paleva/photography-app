import MainLayout from "@/components/layouts/main-layout"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    )
}
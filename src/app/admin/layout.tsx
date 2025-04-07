import MainLayout from "@/components/layouts/main-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    )
}
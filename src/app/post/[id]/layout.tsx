import MainLayout from "@/components/layouts/main-layout";

export default function PostLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <div className="w-full h-full flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
                {children}
            </div>
        </MainLayout>
    )
}
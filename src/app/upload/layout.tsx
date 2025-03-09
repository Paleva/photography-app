interface UploadLayoutProps {
    children: React.ReactNode;
}

export default function UploadLayout({ children }: UploadLayoutProps) {
    return (
        <div className="w-full">
            <div className="flex min-h-screen">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )

}
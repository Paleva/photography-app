import AdminDashboard from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function Page() {
    return (
        <div>
            <div>
                <Link href='/admin/dashboard'>
                    <Button type='button' size='lg' className="m-4">
                        Dashboard
                    </Button>
                </Link>
                <Link href='/admin/moderation'>
                    <Button type='button' size='lg' className="m-4">
                        Moderation
                    </Button>
                </Link>
            </div>
            <AdminDashboard />
        </div>
    )
}
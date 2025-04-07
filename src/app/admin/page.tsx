import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-2'>
            <h1 className='text-2xl font-bold'>Admin</h1>
            <div className="flex-row">
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
        </div >
    )
}
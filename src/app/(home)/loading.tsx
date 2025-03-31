'use client'

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="pt-4 flex flex-col space-y-3 items-center justify-center ">
            <Skeleton className="h-[200px] w-[250px] rounded-xl" />
            <Skeleton className="h-4 w-2/4" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    )
}
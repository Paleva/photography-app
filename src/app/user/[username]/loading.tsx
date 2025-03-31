'use client'

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col space-y-3">
            <div className="flex-row items-center space-x-4">
                <Skeleton className="h-[75px] w-[75px] rounded-full" />
                <Skeleton className="h-8 w-1/4" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-2 m-2 w-1/4" />
                <Skeleton className="h-8 m-2" />
                <Skeleton className="h-2 m-2 w-1/4" />
                <Skeleton className="h-8 m-2" />
                <Skeleton className="h-2 m-2 w-1/4" />
                <Skeleton className="h-8 m-2" />
            </div>
        </div>
    )
}
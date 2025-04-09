import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto py-6">
            {/* Categories filter skeletons */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>

            {/* Masonry grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* First column */}
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-[280px] w-full rounded-xl" />
                    <Skeleton className="h-[180px] w-full rounded-xl" />
                    <Skeleton className="h-[240px] w-full rounded-xl" />
                </div>

                {/* Second column */}
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-[220px] w-full rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                </div>

                {/* Third column - only shows on md screens and up */}
                <div className="hidden md:flex flex-col gap-6">
                    <Skeleton className="h-[260px] w-full rounded-xl" />
                    <Skeleton className="h-[190px] w-full rounded-xl" />
                    <Skeleton className="h-[280px] w-full rounded-xl" />
                </div>

                {/* Fourth column - only shows on lg screens and up */}
                <div className="hidden lg:flex flex-col gap-6">
                    <Skeleton className="h-[320px] w-full rounded-xl" />
                    <Skeleton className="h-[210px] w-full rounded-xl" />
                    <Skeleton className="h-[240px] w-full rounded-xl" />
                </div>
            </div>

            {/* Loading spinner at bottom */}
            <div className="w-full flex justify-center my-12">
                <div className="h-8 w-8 rounded-full border-t-2 border-primary animate-spin"></div>
            </div>
        </div>
    );
}
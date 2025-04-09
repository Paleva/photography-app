import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardTitle } from "@/components/ui/card";

export default function PostLoading() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4  md:items-start justify-center">
                <div className="flex flex-col">
                    <Card className="overflow-hidden rounded-lg relative group">
                        {/* Image skeleton container */}
                        <div className="w-[700px] h-[500px] bg-muted">
                            <Skeleton className="w-full h-full" />
                        </div>

                        {/* Top gradient overlay skeleton */}
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center text-white">
                            <div className="flex items-center gap-3">
                                {/* Avatar skeleton */}
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    {/* Username skeleton */}
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    {/* Handle skeleton */}
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom gradient overlay skeleton */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                            <div className="mb-3">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-full mb-1" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                            <div className="border-t pt-2">
                                <Skeleton className="h-8 w-20 rounded-md" />
                            </div>
                        </div>
                    </Card>

                    {/* Delete button area skeleton */}
                </div>

                {/* Comments card skeleton */}
                <Card className="flex-1 w-full md:max-w-[40%] max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
                    <CardTitle className="text-lg font-semibold p-2">Comments</CardTitle>
                    <div className="p-4 space-y-4">
                        {/* Generate multiple comment skeletons */}
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-3 w-24 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
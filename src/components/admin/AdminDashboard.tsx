// Example analytics dashboard component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, users, posts, comments, likes } from "@/db/schema";
import { count } from "drizzle-orm";

async function getAnalyticsData() {
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalPosts = await db.select({ count: count() }).from(posts);
    const totalComments = await db.select({ count: count() }).from(comments);
    const totalLikes = await db.select({ count: count() }).from(likes);

    // You could add more complex queries here

    return {
        users: totalUsers[0].count,
        posts: totalPosts[0].count,
        comments: totalComments[0].count,
        likes: totalLikes[0].count
    };
}

export default async function AdminDashboard() {
    const stats = await getAnalyticsData();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 m-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.users}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.posts}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.comments}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total likes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.likes}</div>
                </CardContent>
            </Card>
            {/* Similar cards for posts, comments, likes */}
        </div>
    );
}
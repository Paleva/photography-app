// Example analytics dashboard component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AdminCharts from "./Charts";

type postsOverTime = {
    month: string;
    count: string;
}

type commentsOverTime = {
    month: string;
    count: string;
}
type likesOverTime = {
    month: string;
    count: string;
}

type usersOverTime = {
    month: string;
    count: string;
}

type topUsers = {
    userId: number;
    username: string;
    postCount: number;
}

type popularPosts = {
    postId: number;
    title?: string | null;
    likeCount: number;
}
type commentDistribution = {
    commentCount: number;
    postCount: number;
}
type engagementRatio = {
    totalPosts?: number;
    totalComments?: number;
    totalLikes?: number;
}

export interface ChartData {
    postsOverTime: postsOverTime[];
    commentsOverTime: commentsOverTime[];
    likesOverTime: likesOverTime[];
    usersOverTime: usersOverTime[];
    topUsers: topUsers[];
    popularPosts: popularPosts[];
    commentDistribution: commentDistribution[];
    engagementRatio: engagementRatio[];
}

export default async function AdminDashboard({
    postsOverTime,
    commentsOverTime,
    likesOverTime,
    usersOverTime,
    topUsers,
    popularPosts,
    commentDistribution,
    engagementRatio
}: ChartData) {

    // Calculate totals for the stats cards
    const totalUsers = usersOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalPosts = postsOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalComments = commentsOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalLikes = likesOverTime.reduce((sum, item) => sum + Number(item.count), 0);

    // Prepare data for activity over time chart
    interface ActivityDataPoint {
        month: string;
        posts: number;
        comments: number;
        likes: number;
        users: number;
    }

    const activityData: ActivityDataPoint[] = [];
    const allMonths = new Set();

    // Collect all months from all datasets
    postsOverTime.forEach(item => allMonths.add(item.month));
    commentsOverTime.forEach(item => allMonths.add(item.month));
    likesOverTime.forEach(item => allMonths.add(item.month));
    usersOverTime.forEach(item => allMonths.add(item.month));

    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort();

    // Create combined dataset
    sortedMonths.forEach(month => {
        const postData = postsOverTime.find(item => item.month === month);
        const commentData = commentsOverTime.find(item => item.month === month);
        const likeData = likesOverTime.find(item => item.month === month);
        const userData = usersOverTime.find(item => item.month === month);

        activityData.push({
            month: new Date(month as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            posts: postData ? Number(postData.count) : 0,
            comments: commentData ? Number(commentData.count) : 0,
            likes: likeData ? Number(likeData.count) : 0,
            users: userData ? Number(userData.count) : 0,
        });
    });

    // Format data for engagement ratio pie chart
    const engagementData = [
        { name: 'Posts', value: totalPosts },
        { name: 'Comments', value: totalComments },
        { name: 'Likes', value: totalLikes },
    ];

    // Prepare data for the client component
    const chartProps = {
        activityData,
        topUsers: topUsers.map(user => ({
            name: user.username,
            posts: Number(user.postCount)
        })),
        popularPosts: popularPosts.slice(0, 5).map(post => ({
            name: post.title?.substring(0, 20) + (post.title?.length ?? 0 > 20 ? '...' : '') || 'Untitled',
            likes: Number(post.likeCount),
            id: post.postId
        })),
        commentDistribution: commentDistribution.slice(0, 10),
        engagementData
    };

    return (
        <div className="flex flex-col gap-6 m-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                    </CardContent>
                </Card>
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPosts}</div>
                    </CardContent>
                </Card>
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalComments}</div>
                    </CardContent>
                </Card>
                <Card className="py-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLikes}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts - moved to client component */}
            <AdminCharts {...chartProps} />
        </div>
    );
}
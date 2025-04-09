// Example analytics dashboard component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, users, posts, comments, likes } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import AdminCharts from "./Charts";

async function getChartData() {
    // 1. Activity over time (posts, comments, likes, users by month)
    const postsOverTime = await db
        .select({
            month: sql`DATE_TRUNC('month', ${posts.uploaded_at})::date`,
            count: count(),
        })
        .from(posts)
        .groupBy(sql`DATE_TRUNC('month', ${posts.uploaded_at})::date`)
        .orderBy(sql`DATE_TRUNC('month', ${posts.uploaded_at})::date`);

    const commentsOverTime = await db
        .select({
            month: sql`DATE_TRUNC('month', ${comments.created_at})::date`,
            count: count(),
        })
        .from(comments)
        .groupBy(sql`DATE_TRUNC('month', ${comments.created_at})::date`)
        .orderBy(sql`DATE_TRUNC('month', ${comments.created_at})::date`);

    const likesOverTime = await db
        .select({
            month: sql`DATE_TRUNC('month', ${likes.created_at})::date`,
            count: count(),
        })
        .from(likes)
        .groupBy(sql`DATE_TRUNC('month', ${likes.created_at})::date`)
        .orderBy(sql`DATE_TRUNC('month', ${likes.created_at})::date`);

    const usersOverTime = await db
        .select({
            month: sql`DATE_TRUNC('month', ${users.created_at})::date`,
            count: count(),
        })
        .from(users)
        .groupBy(sql`DATE_TRUNC('month', ${users.created_at})::date`)
        .orderBy(sql`DATE_TRUNC('month', ${users.created_at})::date`);

    // 2. Top 5 most active users
    const topUsers = await db
        .select({
            userId: users.id,
            username: users.username,
            postCount: count(posts.id),
        })
        .from(users)
        .leftJoin(posts, eq(users.id, posts.user_id))
        .groupBy(users.id)
        .orderBy(desc(count(posts.id)))
        .limit(5);

    // 3. Most popular posts (by likes)
    const popularPosts = await db
        .select({
            postId: posts.id,
            title: posts.title,
            likeCount: count(likes.post_id),
        })
        .from(posts)
        .leftJoin(likes, eq(posts.id, likes.post_id))
        .groupBy(posts.id)
        .orderBy(desc(count(likes.post_id)))
        .limit(10);

    // 4. User engagement distribution (comments per post)
    const commentDistribution = await db
        .select({
            commentCount: count(comments.id),
            postCount: count(posts.id),
        })
        .from(posts)
        .leftJoin(comments, eq(posts.id, comments.post_id))
        .groupBy(posts.id)
        .orderBy(desc(count(comments.id)));

    // 5. Content engagement ratio
    const engagementRatio = await db
        .select({
            totalPosts: count(posts.id),
            totalComments: count(comments.id),
            totalLikes: count(likes.post_id),
        })
        .from(posts)
        .leftJoin(comments, eq(posts.id, comments.post_id))
        .leftJoin(likes, eq(posts.id, likes.post_id));

    return {
        postsOverTime,
        commentsOverTime,
        likesOverTime,
        usersOverTime,
        topUsers,
        popularPosts,
        commentDistribution,
        engagementRatio,
    };
}

export default async function AdminDashboard() {
    const stats = await getChartData();

    // Calculate totals for the stats cards
    const totalUsers = stats.usersOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalPosts = stats.postsOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalComments = stats.commentsOverTime.reduce((sum, item) => sum + Number(item.count), 0);
    const totalLikes = stats.likesOverTime.reduce((sum, item) => sum + Number(item.count), 0);

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
    stats.postsOverTime.forEach(item => allMonths.add(item.month));
    stats.commentsOverTime.forEach(item => allMonths.add(item.month));
    stats.likesOverTime.forEach(item => allMonths.add(item.month));
    stats.usersOverTime.forEach(item => allMonths.add(item.month));

    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort();

    // Create combined dataset
    sortedMonths.forEach(month => {
        const postData = stats.postsOverTime.find(item => item.month === month);
        const commentData = stats.commentsOverTime.find(item => item.month === month);
        const likeData = stats.likesOverTime.find(item => item.month === month);
        const userData = stats.usersOverTime.find(item => item.month === month);

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
        topUsers: stats.topUsers.map(user => ({
            name: user.username,
            posts: Number(user.postCount)
        })),
        popularPosts: stats.popularPosts.slice(0, 5).map(post => ({
            name: post.title?.substring(0, 20) + (post.title?.length ?? 0 > 20 ? '...' : '') || 'Untitled',
            likes: Number(post.likeCount)
        })),
        commentDistribution: stats.commentDistribution.slice(0, 10),
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
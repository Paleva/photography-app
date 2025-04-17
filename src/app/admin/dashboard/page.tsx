
import AdminDashboard, { ChartData } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db, users, posts, comments, likes } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

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



export default async function Page() {

    const rawStats = await getChartData();

    // Transform the data to match expected types
    const stats: ChartData = {
        postsOverTime: rawStats.postsOverTime.map(item => ({
            month: String(item.month),
            count: String(item.count)
        })),
        commentsOverTime: rawStats.commentsOverTime.map(item => ({
            month: String(item.month),
            count: String(item.count)
        })),
        likesOverTime: rawStats.likesOverTime.map(item => ({
            month: String(item.month),
            count: String(item.count)
        })),
        usersOverTime: rawStats.usersOverTime.map(item => ({
            month: String(item.month),
            count: String(item.count)
        })),
        topUsers: rawStats.topUsers,
        popularPosts: rawStats.popularPosts,
        commentDistribution: rawStats.commentDistribution,
        engagementRatio: rawStats.engagementRatio
    };

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
            <AdminDashboard {...stats} />
        </div>
    )
}
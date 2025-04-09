"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Type definitions for better type safety
type ActivityDataPoint = {
    month: string;
    posts: number;
    comments: number;
    likes: number;
    users: number;
};

type UserData = {
    name: string;
    posts: number;
};

type PostData = {
    name: string;
    likes: number;
};

type CommentDistributionData = {
    commentCount: number;
    postCount: number;
};

type EngagementDataPoint = {
    name: string;
    value: number;
};

interface AdminChartsProps {
    activityData: ActivityDataPoint[];
    topUsers: UserData[];
    popularPosts: PostData[];
    commentDistribution: CommentDistributionData[];
    engagementData: EngagementDataPoint[];
}

export default function AdminCharts({
    activityData,
    topUsers,
    popularPosts,
    commentDistribution,
    engagementData
}: AdminChartsProps) {
    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <>
            {/* Activity Over Time Charts - 4 separate charts in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Posts Activity Chart */}
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Posts Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="posts" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Comments Activity Chart */}
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Comments Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="comments" stroke="#82ca9d" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Likes Activity Chart */}
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Likes Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="likes" stroke="#ffc658" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Users Activity Chart */}
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Users Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#ff8042" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Users & Popular Posts Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Top 5 Users By Post Count</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topUsers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="posts" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Top 5 Popular Posts</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularPosts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip />
                                <Bar dataKey="likes" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Comment Distribution & Engagement Ratio */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Comment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={commentDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="commentCount" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="postCount" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="py-4">
                    <CardHeader>
                        <CardTitle>Engagement Ratio</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={engagementData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
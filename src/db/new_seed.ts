import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { seed } from "drizzle-seed";
import * as schema from "./schema";

async function main() {

    const db = drizzle(process.env.DATABASE_URL!);

    // Insert Multiple Users
    // const insertedUsers = await seed(db, users, { count: 50 } Array.from({ length: 50 }, (_, i) => ({
    //     name: `User${i + 1}`,
    //     email: `user${i + 1}@example.com`,
    //     password: "hashedpassword",
    //     role: i % 3 === 0 ? "Photographer" : "Viewer",
    //     profile_picture: `https://example.com/user${i + 1}.jpg`,
    //     bio: "Photography lover",
    // })));

    const insertedUsers = await seed(db, schema).refine((f) => ({
        users: {
            columns: {
                username: f.fullName(),
            }
        }
    }))

    // Insert Categories
    const insertedCategories = await seed(db, categories, [
        { name: "Nature" },
        { name: "Portrait" },
        { name: "Street" }
    ]);

    const categoryIds = insertedCategories.map(cat => cat.id);

    // Insert Multiple Posts (500 total)
    const insertedPosts = await seed(db, posts, Array.from({ length: 500 }, (_, i) => ({
        title: `Photo ${i + 1}`,
        filename: `photo${i + 1}.jpg`,
        description: `Description for photo ${i + 1}`,
        user_id: insertedUsers[i % insertedUsers.length].id,
        file_path: `https://example.com/photo${i + 1}.jpg`,
        category_id: categoryIds[i % categoryIds.length],
        isVertical: i % 2 === 0,
    })));

    // Insert Likes (Each post gets likes from random users)
    const likeData = [];
    insertedPosts.forEach((post) => {
        const shuffledUsers = [...insertedUsers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 10) + 1);
        shuffledUsers.forEach((user) => {
            likeData.push({ user_id: user.id, post_id: post.id });
        });
    });

    await seed(db, likes, likeData);

    console.log("✅ Database seeded with 50 users, 500 posts, and likes successfully!");
    await client.end();
}

main().catch(console.error);

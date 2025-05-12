import { text, pgTable, varchar, serial, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { drizzle } from "drizzle-orm/postgres-js"

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(process.env.DATABASE_URL);

export const users = pgTable("users", {
    id: serial().primaryKey(),
    username: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 50 }).notNull(),
    profile_picture: text().default('/default-profile-picture.png').notNull(),
    bio: text(),
    created_at: timestamp().defaultNow().notNull(),
});

export const categories = pgTable("categories", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
})

export const posts = pgTable("posts", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }),
    filename: varchar({ length: 255 }),
    description: text().default('No description'),
    user_id: integer().references(() => users.id).notNull(),
    file_path: text().notNull(),
    real_path: text().notNull(),
    category_id: integer().references(() => categories.id).notNull(),
    likes: integer().default(0),
    isvertical: boolean().default(false),
    uploaded_at: timestamp().defaultNow(),
})

export const likes = pgTable("likes", {
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    post_id: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    post_id: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    comment_text: text("comment_text").notNull(),
    created_at: timestamp("created_at").defaultNow()
});


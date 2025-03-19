import { text, pgTable, varchar, serial, timestamp, integer } from 'drizzle-orm/pg-core'
import { drizzle } from "drizzle-orm/postgres-js"

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(process.env.DATABASE_URL);

export const userTable = pgTable("users", {
    id: serial().primaryKey(),
    username: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 50 }).notNull(),
    profile_picture: text(),
    bio: text(),
    created_at: timestamp().defaultNow(),
});


export const photos = pgTable("photos", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }),
    filename: varchar({ length: 255 }),
    description: text(),
    user_id: integer().references(() => userTable.id).notNull(),
    file_path: text().notNull(),
    category_id: integer().references(() => categories.id).notNull(),
    views: integer().default(0),
    likes: integer().default(0),
    uploaded_at: timestamp().defaultNow(),
})

export const categories = pgTable("categories", {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
})

export const likes = pgTable("likes", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    photo_id: integer("photo_id").notNull().references(() => photos.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    photo_id: integer("photo_id").notNull().references(() => photos.id, { onDelete: "cascade" }),
    user_id: integer("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    created_at: timestamp("created_at").defaultNow()
});


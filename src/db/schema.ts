

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

export const sessions = pgTable("sessions", {
    session_id: serial().primaryKey(),
    user_id: integer().references(() => userTable.id).notNull(),
    created_at: timestamp().defaultNow(),
    expires_at: timestamp().notNull(),
})

export const photos = pgTable("photos", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }),
    file_path: text(),
    views: integer().default(0),
    likes: integer().default(0),
    uploaded_at: timestamp().defaultNow(),
    user_id: integer()
})


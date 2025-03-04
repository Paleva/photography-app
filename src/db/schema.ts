
import { text, pgTable, varchar, serial, timestamp } from 'drizzle-orm/pg-core'

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
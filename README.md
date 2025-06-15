This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Overview

A fullstack webapp that is basically an instagram clone. This means that users can upload posts, comment on them and like them. The webapp provides an infinite scroll feed using a masonry grid layout for an interesting look. Users can filter posts based on categories, if they have liked it or check specific users posts.

# Tech stack
- NextJS 14 is used for a fullstack experience utilizing React Server Components with server actions for simpler development
- For UI Shadcn with tailwind is used for responsive and uniform styling
- For database interactions Drizzle ORM is used
- Authentication is a basic implementation of session-based auth system

# Key features
- Masonry grid layout
- Infinite scroll
- Commenting and liking funcionality
- Post filtering (by user, liked posts, category)

# Deployment 
To deploy this project a VM was used meaning I was doing my own deployment. Postgres is used for database and nginx as a reverse proxy for NextJS. To improve the deployment it should be dockerized.
Deployment scripts can be found in [hosting](hosting)

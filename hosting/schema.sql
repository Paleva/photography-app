DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- USERS table: Stores user accounts (Photographers, Viewers, Admins)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashed password
    role VARCHAR(50),
    profile_picture TEXT DEFAULT '/default-profile-picture.png' NOT NULL,  -- URL to profile image
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES table: Stores different photo categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
-- PHOTOS table: Stores uploaded photos
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT REFERENCES users(id),
    file_path TEXT NOT NULL,  -- API file location
    real_path TEXT NOT NULL, -- Real file location on the system
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    likes INT DEFAULT 0, 
    isvertical BOOLEAN,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMMENTS table: Stores user comments on photos
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes(
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY( post_id, user_id)
);

CREATE TABLE IF NOT EXISTS roles(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- TRIGGER FOR posts.likes SUM TO CHANGE EVERY INSERT OR DELETE ON LIKES TABLE
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts
        SET likes = likes + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts
        SET likes = likes - 1
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_likes
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION update_likes_count();

CREATE TRIGGER trigger_decrement_likes
AFTER DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_likes_count();


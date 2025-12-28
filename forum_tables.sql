-- Script SQL untuk membuat tabel-tabel forum di PostgreSQL
-- Jalankan script ini di Navicat atau pgAdmin

-- Tabel kategori forum
CREATE TABLE forum_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    thread_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel pengguna forum (extend dari users table jika ada)
CREATE TABLE forum_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Jika ada tabel users
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    reputation INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'member', -- 'member', 'moderator', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel thread/forum posts
CREATE TABLE forum_threads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    is_sticky BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    last_reply_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel balasan/replies
CREATE TABLE forum_replies (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE, -- Untuk nested replies
    vote_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel voting pada thread
CREATE TABLE forum_thread_votes (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- 'up', 'down'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id)
);

-- Tabel voting pada reply
CREATE TABLE forum_reply_votes (
    id SERIAL PRIMARY KEY,
    reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- 'up', 'down'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reply_id, user_id)
);

-- Tabel like/dislike pada thread
CREATE TABLE forum_thread_likes (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    like_type VARCHAR(10) NOT NULL, -- 'like', 'dislike'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id)
);

-- Tabel like/dislike pada reply
CREATE TABLE forum_reply_likes (
    id SERIAL PRIMARY KEY,
    reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    like_type VARCHAR(10) NOT NULL, -- 'like', 'dislike'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reply_id, user_id)
);

-- Tabel view tracking
CREATE TABLE forum_thread_views (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL, -- NULL untuk anonymous views
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id, ip_address, DATE(viewed_at))
);

-- Tabel bookmarks/favorites
CREATE TABLE forum_bookmarks (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id)
);

-- Tabel reports/pelaporan
CREATE TABLE forum_reports (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- 'spam', 'offensive', 'inappropriate', etc
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
    moderator_id INTEGER REFERENCES forum_users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel tags untuk thread
CREATE TABLE forum_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#6B7280',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel relasi thread dengan tags (many-to-many)
CREATE TABLE forum_thread_tags (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES forum_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, tag_id)
);

-- Tabel notifications
CREATE TABLE forum_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'reply', 'mention', 'like', 'follow', etc
    title VARCHAR(255) NOT NULL,
    content TEXT,
    related_thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE,
    related_reply_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
    related_user_id INTEGER REFERENCES forum_users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk performa
CREATE INDEX idx_threads_category_id ON forum_threads(category_id);
CREATE INDEX idx_threads_author_id ON forum_threads(author_id);
CREATE INDEX idx_threads_created_at ON forum_threads(created_at DESC);
CREATE INDEX idx_threads_last_reply_at ON forum_threads(last_reply_at DESC);
CREATE INDEX idx_threads_vote_count ON forum_threads(vote_count DESC);
CREATE INDEX idx_threads_is_sticky ON forum_threads(is_sticky) WHERE is_sticky = true;

CREATE INDEX idx_replies_thread_id ON forum_replies(thread_id);
CREATE INDEX idx_replies_author_id ON forum_replies(author_id);
CREATE INDEX idx_replies_parent_reply_id ON forum_replies(parent_reply_id);
CREATE INDEX idx_replies_created_at ON forum_replies(created_at DESC);

CREATE INDEX idx_thread_votes_thread_id ON forum_thread_votes(thread_id);
CREATE INDEX idx_thread_votes_user_id ON forum_thread_votes(user_id);

CREATE INDEX idx_reply_votes_reply_id ON forum_reply_votes(reply_id);
CREATE INDEX idx_reply_votes_user_id ON forum_reply_votes(user_id);

CREATE INDEX idx_thread_likes_thread_id ON forum_thread_likes(thread_id);
CREATE INDEX idx_thread_likes_user_id ON forum_thread_likes(user_id);

CREATE INDEX idx_reply_likes_reply_id ON forum_reply_likes(reply_id);
CREATE INDEX idx_reply_likes_user_id ON forum_reply_likes(reply_id);

CREATE INDEX idx_thread_views_thread_id ON forum_thread_views(thread_id);
CREATE INDEX idx_thread_views_user_id ON forum_thread_views(user_id);
CREATE INDEX idx_thread_views_viewed_at ON forum_thread_views(viewed_at DESC);

CREATE INDEX idx_bookmarks_user_id ON forum_bookmarks(user_id);

CREATE INDEX idx_reports_status ON forum_reports(status);
CREATE INDEX idx_reports_thread_id ON forum_reports(thread_id);
CREATE INDEX idx_reports_reply_id ON forum_reports(reply_id);

CREATE INDEX idx_thread_tags_thread_id ON forum_thread_tags(thread_id);
CREATE INDEX idx_thread_tags_tag_id ON forum_thread_tags(tag_id);

CREATE INDEX idx_notifications_user_id ON forum_notifications(user_id);
CREATE INDEX idx_notifications_is_read ON forum_notifications(is_read);
CREATE INDEX idx_notifications_created_at ON forum_notifications(created_at DESC);

-- Trigger untuk update updated_at
CREATE OR REPLACE FUNCTION update_forum_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_forum_categories_updated_at BEFORE UPDATE ON forum_categories FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at_column();
CREATE TRIGGER update_forum_users_updated_at BEFORE UPDATE ON forum_users FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON forum_threads FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at_column();
CREATE TRIGGER update_forum_reports_updated_at BEFORE UPDATE ON forum_reports FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at_column();

-- Function untuk update thread stats
CREATE OR REPLACE FUNCTION update_thread_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update reply count
    UPDATE forum_threads
    SET reply_count = (SELECT COUNT(*) FROM forum_replies WHERE thread_id = NEW.thread_id),
        last_reply_at = GREATEST(
            COALESCE((SELECT MAX(created_at) FROM forum_replies WHERE thread_id = NEW.thread_id), created_at),
            created_at
        )
    WHERE id = NEW.thread_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk update thread stats saat reply ditambah/dihapus
CREATE TRIGGER update_thread_stats_on_reply_insert AFTER INSERT ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_thread_stats();
CREATE TRIGGER update_thread_stats_on_reply_delete AFTER DELETE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_thread_stats();

-- Function untuk update vote counts
CREATE OR REPLACE FUNCTION update_thread_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE forum_threads
    SET vote_count = (
        SELECT COUNT(*) FROM forum_thread_votes
        WHERE thread_id = COALESCE(NEW.thread_id, OLD.thread_id)
        AND vote_type = 'up'
    ) - (
        SELECT COUNT(*) FROM forum_thread_votes
        WHERE thread_id = COALESCE(NEW.thread_id, OLD.thread_id)
        AND vote_type = 'down'
    )
    WHERE id = COALESCE(NEW.thread_id, OLD.thread_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger untuk update vote count
CREATE TRIGGER update_thread_vote_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON forum_thread_votes
    FOR EACH ROW EXECUTE FUNCTION update_thread_vote_count();

-- Function untuk update like counts
CREATE OR REPLACE FUNCTION update_thread_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE forum_threads
    SET like_count = (
        SELECT COUNT(*) FROM forum_thread_likes
        WHERE thread_id = COALESCE(NEW.thread_id, OLD.thread_id)
        AND like_type = 'like'
    ),
    dislike_count = (
        SELECT COUNT(*) FROM forum_thread_likes
        WHERE thread_id = COALESCE(NEW.thread_id, OLD.thread_id)
        AND like_type = 'dislike'
    )
    WHERE id = COALESCE(NEW.thread_id, OLD.thread_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger untuk update like count
CREATE TRIGGER update_thread_like_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON forum_thread_likes
    FOR EACH ROW EXECUTE FUNCTION update_thread_like_count();

-- Insert data awal untuk kategori
INSERT INTO forum_categories (name, description, icon, color, sort_order) VALUES
('Diskusi Umum', 'Diskusi umum tentang inovasi dan perkembangan', 'chat', '#3B82F6', 1),
('Teknologi', 'Diskusi tentang teknologi dan inovasi digital', 'cpu', '#10B981', 2),
('Pelayanan Publik', 'Inovasi dalam pelayanan publik', 'users', '#F59E0B', 3),
('Inovasi Digital', 'Transformasi digital dan inovasi teknologi', 'smartphone', '#8B5CF6', 4),
('Pengembangan SDM', 'Pengembangan sumber daya manusia', 'graduation-cap', '#EF4444', 5);
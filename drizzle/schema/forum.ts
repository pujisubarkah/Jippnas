import { pgTable, serial, varchar, text, boolean, timestamp, integer, inet, pgEnum } from 'drizzle-orm/pg-core';

export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 20 }).default('#3B82F6'),
  sortOrder: integer('sort_order').default(0),
  threadCount: integer('thread_count').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumUsers = pgTable('forum_users', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  reputation: integer('reputation').default(0),
  postCount: integer('post_count').default(0),
  joinDate: timestamp('join_date', { withTimezone: true }).defaultNow(),
  lastActive: timestamp('last_active', { withTimezone: true }).defaultNow(),
  isActive: boolean('is_active').default(true),
  role: varchar('role', { length: 20 }).default('member'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumThreads = pgTable('forum_threads', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  categoryId: integer('category_id').references(() => forumCategories.id, { onDelete: 'cascade' }),
  authorId: integer('author_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  slug: varchar('slug', { length: 255 }),
  viewCount: integer('view_count').default(0),
  replyCount: integer('reply_count').default(0),
  voteCount: integer('vote_count').default(0),
  likeCount: integer('like_count').default(0),
  dislikeCount: integer('dislike_count').default(0),
  isSticky: boolean('is_sticky').default(false),
  isLocked: boolean('is_locked').default(false),
  isFeatured: boolean('is_featured').default(false),
  lastReplyAt: timestamp('last_reply_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumReplies = pgTable('forum_replies', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  authorId: integer('author_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentReplyId: integer('parent_reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  voteCount: integer('vote_count').default(0),
  likeCount: integer('like_count').default(0),
  dislikeCount: integer('dislike_count').default(0),
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumThreadVotes = pgTable('forum_thread_votes', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  voteType: varchar('vote_type', { length: 10 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumReplyVotes = pgTable('forum_reply_votes', {
  id: serial('id').primaryKey(),
  replyId: integer('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  voteType: varchar('vote_type', { length: 10 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumThreadLikes = pgTable('forum_thread_likes', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  likeType: varchar('like_type', { length: 10 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumReplyLikes = pgTable('forum_reply_likes', {
  id: serial('id').primaryKey(),
  replyId: integer('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  likeType: varchar('like_type', { length: 10 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumThreadViews = pgTable('forum_thread_views', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'setNull' }),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow(),
});

export const forumBookmarks = pgTable('forum_bookmarks', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumReports = pgTable('forum_reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  replyId: integer('reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  reportType: varchar('report_type', { length: 50 }).notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  moderatorId: integer('moderator_id').references(() => forumUsers.id, { onDelete: 'setNull' }),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumTags = pgTable('forum_tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 20 }).default('#6B7280'),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumThreadTags = pgTable('forum_thread_tags', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').references(() => forumTags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumNotifications = pgTable('forum_notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  relatedThreadId: integer('related_thread_id').references(() => forumThreads.id, { onDelete: 'cascade' }),
  relatedReplyId: integer('related_reply_id').references(() => forumReplies.id, { onDelete: 'cascade' }),
  relatedUserId: integer('related_user_id').references(() => forumUsers.id, { onDelete: 'cascade' }),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
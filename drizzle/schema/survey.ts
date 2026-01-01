import { pgTable, serial, varchar, text, boolean, timestamp, integer, pgEnum, numeric } from 'drizzle-orm/pg-core';

export const surveyInstruments = pgTable('survey_instruments', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const instrumentAspects = pgTable('instrument_aspects', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id').references(() => surveyInstruments.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const instrumentQuestions = pgTable('instrument_questions', {
  id: serial('id').primaryKey(),
  aspectId: integer('aspect_id').references(() => instrumentAspects.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 20 }).default('single'),
  isRequired: boolean('is_required').default(true),
  requireEvidence: boolean('require_evidence').default(false),
  evidenceLabel: varchar('evidence_label', { length: 255 }),
  weight: numeric('weight', { precision: 5, scale: 2 }).default('1.00'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const questionOptions = pgTable('question_options', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => instrumentQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  score: integer('score').default(0),
  optionValue: varchar('option_value', { length: 10 }),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const instrumentResponses = pgTable('instrument_responses', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id').references(() => surveyInstruments.id, { onDelete: 'cascade' }),
  instansi: varchar('instansi', { length: 255 }).notNull(),
  totalScore: integer('total_score').default(0),
  verificationStatus: varchar('verification_status', { length: 20 }).default('pending'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const responseAnswers = pgTable('response_answers', {
  id: serial('id').primaryKey(),
  responseId: integer('response_id').references(() => instrumentResponses.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').references(() => instrumentQuestions.id, { onDelete: 'cascade' }),
  selectedOptionIds: integer('selected_option_ids').array(),
  selectedOptionId: integer('selected_option_id').references(() => questionOptions.id),
  evidence: text('evidence'),
  originalScore: integer('original_score').default(0),
  verifiedScore: integer('verified_score').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const answerVerifications = pgTable('answer_verifications', {
  id: serial('id').primaryKey(),
  answerId: integer('answer_id').references(() => responseAnswers.id, { onDelete: 'cascade' }),
  verifiedOptionIds: integer('verified_option_ids').array(),
  verifiedOptionId: integer('verified_option_id').references(() => questionOptions.id),
  verificationStatus: varchar('verification_status', { length: 20 }).default('pending'),
  verificationNote: text('verification_note'),
  verifiedBy: integer('verified_by'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }).defaultNow(),
});
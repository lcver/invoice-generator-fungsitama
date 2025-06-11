import { pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const activityInCore = pgTable('test', {
  id: varchar({ length: 36 })
    .primaryKey()
    .notNull()
    .default('gen_random_uuid()'),
  createdAt: timestamp('created_at', { precision: 6, mode: 'string' }).default(
    '2025-03-04 09:11:01.26378'
  ),
  updatedAt: timestamp('updated_at', { precision: 6, mode: 'string' }),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at', { precision: 6, mode: 'string' }),
  createdBy: varchar('created_by', { length: 255 }),
  updatedBy: varchar('updated_by', { length: 255 }),
  deletedBy: varchar('deleted_by', { length: 255 }),
});

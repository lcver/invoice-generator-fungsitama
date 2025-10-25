import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  numeric,
  integer,
  text,
  date,
} from 'drizzle-orm/pg-core';

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

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey().notNull(),
  invoice_number: varchar('invoice_number', { length: 255 }).notNull(),
  client_name: varchar('client_name', { length: 255 }).notNull(),
  client_address: text('client_address').notNull(),
  issue_date: date('issue_date').notNull(),
  due_date: date('due_date').notNull(),
  total_amount: numeric('total_amount', { precision: 20, scale: 2 }).default(
    '0.00'
  ),
  status: varchar('status').notNull(),
  createdAt: timestamp('created_at', {
    precision: 6,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, mode: 'string' }),
});

export const invoiceItems = pgTable('invoice_items', {
  id: text('id').primaryKey().notNull(),
  invoice_id: varchar('invoice_id').notNull(),
  description: varchar('description', { length: 255 }),
  quantity: integer('quantity').default(1),
  unit_price: numeric('unit_price', { precision: 20, scale: 2 }).default(
    '0.00'
  ),
  line_total: numeric('line_total', { precision: 20, scale: 2 }).default(
    '0.00'
  ),
});

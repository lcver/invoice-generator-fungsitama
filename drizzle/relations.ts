import { relations } from 'drizzle-orm';
import { invoiceItems, invoices } from './schema';

// Relasi (opsional, untuk ORM)
export const invoiceRelations = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItemRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

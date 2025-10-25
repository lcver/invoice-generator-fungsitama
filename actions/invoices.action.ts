'use server';

import { invoiceItems, invoices } from '@/drizzle/schema';
import { InvoiceInterface, PayloadInvoiceInterface } from '@/entity/invoice';
import { db } from '@/lib/db';
import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  InferInsertModel,
  like,
  or,
} from 'drizzle-orm';
import * as uuid from 'uuid';
import jsPdf from 'jspdf';

type InvoiceInsert = InferInsertModel<typeof invoices>;
export const createInvoice = async ({
  invoice_number,
  client_name,
  client_address,
  issue_date,
  due_date,
  status,
  items,
}: PayloadInvoiceInterface) => {
  if (!items) return null;

  const total = `${items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)}.00`;

  const newInvoiceData: InvoiceInsert = {
    id: uuid.v4(),
    invoice_number,
    client_name,
    client_address,
    issue_date: new Date(issue_date).toISOString().split('T')[0],
    due_date: new Date(due_date).toISOString().split('T')[0],
    total_amount: total,
    status,
  };

  const [newInvoice] = await db
    .insert(invoices)
    .values(newInvoiceData)
    .returning();

  const itemRows = items.map((item) => ({
    id: `${uuid.v4()}`,
    invoice_id: newInvoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: `${item.unit_price}.00`,
    line_total: `${item.quantity * item.unit_price}.00`,
  }));

  await db.insert(invoiceItems).values(itemRows);

  return { ...newInvoice, items: itemRows };
};

export async function getAllInvoices() {
  let invs = await db.select().from(invoices);

  const invoicesWithItems = await Promise.all(
    invs.map(async (inv) => {
      const items = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoice_id, inv.id));

      return { ...inv, items };
    })
  );

  return invoicesWithItems;
}

export async function getInvoiceById(id: string) {
  const [inv] = await db.select().from(invoices).where(eq(invoices.id, id));
  if (!inv) return null;

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoice_id, id));

  return { ...inv, items };
}

export async function updateInvoice(
  id: string,
  {
    invoice_number,
    client_name,
    client_address,
    issue_date,
    due_date,
    status,
    items,
  }: PayloadInvoiceInterface
) {
  if (!items) return null;

  const total = items
    .reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
    .toFixed(2);

  const [updatedInvoice] = await db
    .update(invoices)
    .set({
      invoice_number,
      client_name,
      client_address,
      issue_date: new Date(issue_date).toISOString().split('T')[0],
      due_date: new Date(due_date).toISOString().split('T')[0],
      total_amount: total,
      status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(invoices.id, id))
    .returning();

  if (!updatedInvoice) return null;

  await db.delete(invoiceItems).where(eq(invoiceItems.invoice_id, id));
  const itemRows = items.map((item) => {
    const unitPrice =
      typeof item.unit_price === 'string'
        ? parseFloat(item.unit_price)
        : item.unit_price;

    const lineTotal = item.quantity * unitPrice;
    return {
      id: `${uuid.v4()}`,
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: unitPrice.toFixed(2),
      line_total: lineTotal.toFixed(2),
    };
  });

  console.log(items);
  console.log(itemRows);

  await db.insert(invoiceItems).values(itemRows);

  return { ...updatedInvoice, items: itemRows };
}

export async function deleteInvoiceItems(ids: string[]) {
  if (!ids || ids.length === 0) return;

  await db.delete(invoiceItems).where(inArray(invoiceItems.id, ids));
}

export async function searchInvoices(searchText: string) {
  const invs = await db
    .select()
    .from(invoices)
    .where(
      or(
        ilike(invoices.client_name, `%${searchText}%`),
        ilike(invoices.invoice_number, `%${searchText}%`)
      )
    )
    .execute();

  const invoicesWithItems = await Promise.all(
    invs.map(async (inv) => {
      const items = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoice_id, inv.id));

      return { ...inv, items };
    })
  );

  return invoicesWithItems;
}

export async function generateInvoiceNumber() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();

  // Pattern prefix
  const prefix = `INV${dd}${mm}${yyyy}`;

  const lastInvoice = await db
    .select()
    .from(invoices)
    .where(like(invoices.invoice_number, `${prefix}%`))
    .orderBy(desc(invoices.invoice_number))
    .limit(1);

  let nextNumber = 1;

  if (lastInvoice) {
    const lastNumber =
      parseInt(lastInvoice[0].invoice_number.slice(prefix.length)) || 0;
    nextNumber = lastNumber + 1;
  }

  const formattedNumber = String(nextNumber).padStart(5, '0');
  const invoiceNumber = `${prefix}${formattedNumber}`;

  return invoiceNumber;
}

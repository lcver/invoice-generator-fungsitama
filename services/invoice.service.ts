import { invoiceItems, invoices } from '@/drizzle/schema';
import { PayloadInvoiceInterface } from '@/entity/invoice';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import * as uuid from 'uuid';

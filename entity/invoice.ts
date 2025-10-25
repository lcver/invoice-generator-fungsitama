import { BaseEntity } from './Base';

export interface InvoiceInterface extends BaseEntity {
  invoice_number: string;
  client_name: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  items?: InvoiceItemInterface[];
}
export interface InvoiceDetailInterface extends BaseEntity {
  invoice_number: string;
  client_name: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  items?: InvoiceItemInterface[];
}

export interface InvoiceItemInterface {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface PayloadInvoiceInterface {
  id?: string;
  invoice_number: string;
  client_name: string;
  client_address: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
  items?: InvoiceItemInterface[];
}

export interface PayloadInvoiceItemInterface {
  invoice_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

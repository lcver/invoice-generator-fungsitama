'use client';

import { Button } from '@/components/ui/button';
import { InvoiceInterface } from '@/entity/invoice';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Printer } from 'lucide-react';

const exportInvoiceToPDF = (invoice: InvoiceInterface) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text(`Invoice: ${invoice.invoice_number}`, 14, 20);
  doc.setFontSize(12);
  doc.text(`Client: ${invoice.client_name}`, 14, 30);
  doc.text(`Address: ${invoice.client_address}`, 14, 36);
  doc.text(`Issue Date: ${invoice.issue_date}`, 14, 42);
  doc.text(`Due Date: ${invoice.due_date}`, 14, 48);
  doc.text(`Status: ${invoice.status}`, 14, 54);

  // Table
  const tableColumn = ['Description', 'Qty', 'Unit Price', 'Line Total'];
  if (!invoice.items) return;

  const tableRows = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    item.unit_price,
    item.line_total,
  ]);

  autoTable(doc, { startY: 60, head: [tableColumn], body: tableRows });

  const finalY = (doc as any).lastAutoTable?.finalY || 60;
  doc.text(`Total: ${invoice.total_amount}`, 14, finalY + 10);

  // Trigger download
  doc.save(`Invoice-${invoice.invoice_number}.pdf`);

  return `Invoice-${invoice.invoice_number}.pdf`;
};

export const ButtonDownloadPDF = ({ item }: { item: InvoiceInterface }) => {
  const { toast } = useToast();
  return (
    <Button
      size="icon"
      onClick={() => {
        try {
          const result = exportInvoiceToPDF(item);

          toast({
            title: 'Export success',
            description: `Open file ${result}`,
          });
        } catch (error) {
          console.log(error);
          toast({
            variant: 'destructive',
            title: 'Export Failed',
          });
        }
      }}
      variant="secondary"
    >
      <Printer />
    </Button>
  );
};

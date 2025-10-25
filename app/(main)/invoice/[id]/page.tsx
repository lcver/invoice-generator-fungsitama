'use client';

import MainLayout from './layout';
import { useEffect, useState } from 'react';
import {
  InvoiceDetailInterface,
  InvoiceInterface,
  PayloadInvoiceInterface,
} from '@/entity/invoice';
import { useParams, useRouter } from 'next/navigation';

import { getInvoiceById, updateInvoice } from '@/actions/invoices.action';
import { FormInvoice } from '@/services/form-invoice';
import { ArrowLeft } from 'lucide-react';

export default function InvoiceDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState<InvoiceInterface>();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const fetchInvoice = await getInvoiceById(`${id}`);
      const data: InvoiceDetailInterface = fetchInvoice ? fetchInvoice : {};
      if (!data) return;

      setData(data);
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: PayloadInvoiceInterface) => {
    await updateInvoice(`${id}`, {
      client_address: data.client_address,
      client_name: data.client_name,
      invoice_number: data.invoice_number,
      due_date: data.due_date,
      issue_date: data.issue_date,
      total_amount: data.total_amount,
      items: data.items,
      status: data.status,
    });

    router.push('/');
  };

  return (
    <MainLayout>
      <div className="relative flex min-h-screen flex-col items-center px-4 py-10">
        <div className="w-4/5 flex flex-col">
          <a
            href="/"
            className="flex items-center gap-x-2 hover:text-blue-600 mb-3"
          >
            <ArrowLeft />
            Back to Home
          </a>
          <h1 className="text-2xl font-bold">Invoice</h1>

          {data && (
            <FormInvoice
              editable={false}
              invoice_number={data.invoice_number}
              client_name={data.client_name}
              client_address={data.client_address}
              issue_date={data.issue_date}
              due_date={data.due_date}
              total_amount={data.total_amount}
              status={data.status}
              items={data.items}
              actionTitle="Simpan Invoice"
              cb={(data) => handleSubmit(data)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

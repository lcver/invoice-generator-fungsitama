'use client';

import MainLayout from './layout';
import { useEffect, useState } from 'react';
import {
  InvoiceDetailInterface,
  InvoiceInterface,
  PayloadInvoiceInterface,
} from '@/entity/invoice';
import { useParams, useRouter } from 'next/navigation';

import { getInvoiceById, submitInvoice } from '@/actions/invoices.action';
import { FormInvoice } from '@/services/form-invoice';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function InvoiceDetail() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async () => {
    if (!id || !data) return;
    setIsLoading(true);

    try {
      await submitInvoice(`${id}`, {
        status: 'cancelled',
      });

      toast({
        title: 'Cancelled invoice',
        description: `Invoice Number ${data.invoice_number}`,
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fail to submit invoice',
        description: `${error}`,
      });
      setIsLoading(false);
    } finally {
      router.push('/');
    }
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
              data={data}
              actionTitle="Simpan Invoice"
              // cb={(data) => handleSubmit(data)}
            />
          )}
          {data?.status && (
            <div className="flex justify-end mt-10">
              {data?.status == 'submited' && (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => handleSubmit()}
                >
                  Cancel Invoice
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

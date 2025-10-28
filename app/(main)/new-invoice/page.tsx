'use client';

import MainLayout from './layout';

import { useEffect, useState } from 'react';
import { PayloadInvoiceInterface } from '@/entity/invoice';

import { useRouter } from 'next/navigation';
import { FormInvoice } from '@/services/form-invoice';
import {
  createInvoice,
  generateInvoiceNumber,
} from '@/actions/invoices.action';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CreatInvoice() {
  const router = useRouter();
  const { toast } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PayloadInvoiceInterface) => {
    try {
      setIsLoading(true);
      await createInvoice(data);
      toast({
        title: 'Success created invoice',
        description: `Invoice Number ${invoiceNumber}`,
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fail to created invoice',
        description: `${error}`,
      });
      setIsLoading(false);
    } finally {
      router.push('/');
    }
  };

  useEffect(() => {
    (async () => {
      const number = await generateInvoiceNumber();
      setInvoiceNumber(number);
    })();
  }, []);

  return (
    <MainLayout>
      {isLoading && (
        <div className="z-50 absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black/60">
          <p className="text-white">Loading . . .</p>
        </div>
      )}
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

          <FormInvoice
            invoiceNumber={invoiceNumber}
            editable={true}
            actionTitle="Generate Invoice"
            cb={(data) => handleSubmit(data)}
          />
        </div>
      </div>
    </MainLayout>
  );
}

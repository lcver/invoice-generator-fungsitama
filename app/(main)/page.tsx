'use client';

import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from './layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { InvoiceInterface } from '@/entity/invoice';
import { getAllInvoices, searchInvoices } from '@/actions/invoices.action';
import { CircleXIcon, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ButtonDownloadPDF } from '@/services/download-pdf';

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<InvoiceInterface[]>([]);

  const [querySearch, setQuerySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchInvoices = await getAllInvoices();

        const invoices: InvoiceInterface[] = Array.isArray(fetchInvoices)
          ? fetchInvoices
          : [];
        console.log(invoices);

        setData(invoices);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await searchInvoices(querySearch);

        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [querySearch]);
  return (
    <MainLayout>
      <div className="relative flex min-h-screen flex-col items-center px-4 py-10">
        <div className="w-4/5 flex flex-col gap-y-10">
          <h1 className="text-2xl font-bold">List Invoice</h1>

          <div className="flex flex-col gap-y-5">
            <div className="flex items-center justify-end gap-x-2">
              <div className="relative">
                {querySearch && (
                  <Button
                    variant="icon"
                    className="!px-2 absolute right-0 hover:text-red-600"
                    onClick={() => {
                      setQuerySearch('');
                    }}
                  >
                    <CircleXIcon size={20} />
                  </Button>
                )}
                <Input
                  placeholder="Search"
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                />
              </div>
              <a
                href="/new-invoice"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              >
                Create New Invoice
              </a>
            </div>
            <div className="shadow-lg pb-4 rounded-lg overflow-hidden ">
              <Table>
                <TableHeader className="bg-slate-500">
                  <TableRow>
                    <TableHead className="text-white w-[200px]">
                      Invoice Number
                    </TableHead>
                    <TableHead className="text-white">Client</TableHead>
                    <TableHead className="text-white">Issue Date</TableHead>
                    <TableHead className="text-white">Due Date</TableHead>
                    <TableHead className="text-white text-right">
                      Total Amount
                    </TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0
                    ? data.map((item, index) => {
                        return (
                          <TableRow key={index} className="hover:bg-black/10">
                            <TableCell className="font-medium">
                              {item.invoice_number}
                            </TableCell>
                            <TableCell>{item.client_name}</TableCell>
                            <TableCell>{item.issue_date}</TableCell>
                            <TableCell>{item.due_date}</TableCell>
                            <TableCell className="text-right">
                              {item.total_amount}
                            </TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell className="flex gap-x-2">
                              <Button
                                size="icon"
                                onClick={() => {
                                  router.push(`/invoice/${item.id}`);
                                }}
                              >
                                <Eye />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  router.push(`/invoice/${item.id}/edit`);
                                }}
                              >
                                <Pencil />
                              </Button>
                              <ButtonDownloadPDF item={item} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : isLoading &&
                      [0, 0, 0].map((item, index) => {
                        return (
                          <TableRow key={index} className="hover:bg-black/10">
                            <TableCell className="font-medium">
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                            <TableCell className="flex gap-x-2">
                              <Skeleton className="h-5 w-full" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>

              {data.length == 0 && !isLoading && (
                <div className="flex justify-center items-center h-40">
                  <p className="text-black/60 text-lg font-semibold">
                    No Data founded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </MainLayout>
  );
}

function WellcomeSkeleton() {
  return (
    <div className="grid justify-items-center space-y-2">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  );
}

function WorksapceSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}

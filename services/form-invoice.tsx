import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateItemComponent } from '@/services/dialog-invoice-item.service';
import { useEffect, useState } from 'react';
import {
  InvoiceDetailInterface,
  InvoiceInterface,
  InvoiceItemInterface,
  PayloadInvoiceInterface,
  PayloadInvoiceItemInterface,
} from '@/entity/invoice';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { DatePicker } from '@/components/ui/date-picker';

interface FormInvoiceInteface {
  actionTitle: string;
  invoiceNumber?: string;
  editable: boolean;
  data?: InvoiceDetailInterface;
  cb?: (data: PayloadInvoiceInterface) => void;
}
export const FormInvoice = (props: FormInvoiceInteface) => {
  const [errors, setErrors] = useState({
    clientName: '',
    clientAddress: '',
    issueDate: '',
    dueDate: '',
    items: '',
  });
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [items, setItems] = useState<InvoiceItemInterface[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [status, setStatus] = useState('draft');

  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [total, setTotal] = useState(0);

  const [selectionModeItem, setSelectionModeItem] = useState<string[]>([]);

  function validateForm() {
    const newErrors: any = {};

    if (!clientName || !clientName.trim()) {
      newErrors.clientName = 'Nama tidak boleh kosong';
    }

    if (!clientAddress || !clientAddress.trim()) {
      newErrors.clientAddress = 'Alamat tidak boleh kosong';
    }

    if (!issueDate) {
      newErrors.issueDate = 'Issu date tidak boleh kosong';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date tidak boleh kosong';
    }

    if (!items || !Array.isArray(items) || items.length == 0) {
      newErrors.items = 'Tambahkan item terlebih dahulu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    let totalAmount = 0;
    items.map((item) => {
      const lineTotal = parseInt(`${item.line_total}`);
      totalAmount += lineTotal;
    });

    setTotal(totalAmount);
  }, [items]);

  useEffect(() => {
    setIsEditable(props.editable);
    setInvoiceNumber(
      props.data ? props.data.invoice_number : props.invoiceNumber || ''
    );

    if (!props.data) return;

    setItems(props.data.items || []);
    setClientName(props.data.client_name);
    setClientAddress(props.data.client_address);
    setIssueDate(props.data.issue_date);
    setDueDate(props.data.due_date);
    setTotal(props.data.total_amount);
    setStatus(props.data.status || status);
  }, [props]);

  return (
    <div className="flex flex-col gap-y-5 mt-10">
      <div className="flex justify-between">
        <div
          className={clsx(
            status == 'draft' && 'bg-slate-900/40',
            status == 'sent' && 'bg-blue-700',
            status == 'paid' && 'bg-green-700',
            status == 'cancelled' && 'bg-red-700',
            'h-7 px-2 flex flex-row justify-center items-center rounded-lg'
          )}
        >
          <p className=" text-white text-sm font-bold">{status}</p>
        </div>
        {isEditable && (
          <button
            onClick={() => {
              if (!validateForm()) return;

              props?.cb?.({
                client_address: clientAddress,
                client_name: clientName,
                invoice_number: invoiceNumber,
                due_date: dueDate,
                issue_date: issueDate,
                total_amount: total,
                items: items,
                status: 'draft',
              });
            }}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          >
            {props?.actionTitle}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2">
          <div>
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input
              id="invoice-number"
              type="text"
              readOnly
              className="bg-slate-200 text-black/60"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="invoice-date">Invoice date</Label>
            <Input
              id="invoice-date"
              type="text"
              readOnly={true}
              className="bg-slate-200 text-black/60"
              value={
                props.data
                  ? new Date(props.data?.createdAt).toLocaleDateString()
                  : ''
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="client-name">Client Name</Label>
          <Input
            id="client-name"
            type="text"
            readOnly={!isEditable}
            className={clsx(
              !isEditable && 'bg-slate-200 text-black/60',
              errors.clientName && 'border-red-600'
            )}
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="client-address">Client Address</Label>
          <Textarea
            id="client-address"
            readOnly={!isEditable}
            className={clsx(
              !isEditable && 'bg-slate-200 text-black/60',
              errors.clientAddress && 'border-red-600'
            )}
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
        </div>
        <div className="flex gap-x-2">
          <DatePicker
            label="Issue Date"
            setDate={setIssueDate}
            date={issueDate}
            className={clsx(
              !isEditable && 'bg-slate-200 text-black/60',
              errors.issueDate && 'border-red-600'
            )}
          />
          <DatePicker
            label="Due Date"
            setDate={setDueDate}
            date={dueDate}
            className={clsx(
              !isEditable && 'bg-slate-200 text-black/60',
              errors.dueDate && 'border-red-600'
            )}
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-5">
          <div className="flex items-center justify-end gap-x-2">
            <div className="w-full">
              {errors.items && (
                <span className="font-bold text-red-600">{errors.items}</span>
              )}
            </div>
            {isEditable && (
              <>
                <CreateItemComponent
                  onAdd={(item) =>
                    setItems((prev) => [
                      ...prev,
                      {
                        id: '',
                        description: item.description,
                        invoice_id: item.invoice_id || '',
                        line_total: item.line_total,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                      },
                    ])
                  }
                />
                <Button
                  disabled={selectionModeItem.length === 0}
                  variant="destructive"
                  onClick={() => {
                    const splitDeletedItems = items.filter(
                      (item) => !selectionModeItem.includes(item.id)
                    );

                    setItems([...splitDeletedItems]);
                  }}
                >
                  Delete Item
                </Button>
              </>
            )}
          </div>
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-500">
                <TableRow>
                  <TableHead className="text-white w-[200px]">
                    Description
                  </TableHead>
                  <TableHead className="text-white">Qty</TableHead>
                  <TableHead className="text-white">Unit Price</TableHead>
                  <TableHead className="text-white">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  return (
                    <TableRow
                      onDoubleClick={() => {
                        if (selectionModeItem.length > 0) return;
                        setSelectionModeItem((prev) => [...prev, item.id]);
                      }}
                      onClick={() => {
                        if (selectionModeItem.length > 0) {
                          let selected = selectionModeItem;
                          if (selectionModeItem.includes(item.id)) {
                            selected = selected.filter((select) => {
                              return select !== item.id;
                            });
                          } else {
                            selected = [...selected, item.id];
                          }

                          setSelectionModeItem([...selected]);
                        }
                      }}
                      key={index}
                      className={clsx(
                        selectionModeItem.includes(item.id) &&
                          'bg-slate-400 hover:bg-slate-400/60'
                      )}
                    >
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit_price}</TableCell>
                      <TableCell>{item.line_total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-end gap-y-2">
            <div className="w-[300px]">
              <p>Total Amount</p>
              <div className="py-2 px-4 border border-black/10 rounded-lg">
                <p>{total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

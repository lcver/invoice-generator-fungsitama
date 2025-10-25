import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PayloadInvoiceItemInterface } from '@/entity/invoice';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export const CreateItemComponent = ({
  onAdd,
}: {
  onAdd: (item: PayloadInvoiceItemInterface) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState<string>('');
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState({
    desc: '',
    qty: '',
    price: '',
  });

  function validateForm() {
    const newErrors: any = {};

    if (!desc || !desc.trim()) {
      newErrors.desc = 'Deskripsi tidak boleh kosong';
    }

    if (!qty || isNaN(qty) || qty <= 0) {
      newErrors.qty = 'Kuantitas harus lebih dari 0';
    }

    if (!price || isNaN(price) || price < 0) {
      newErrors.price = 'Harga tidak boleh negatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;

    const total = qty * price;
    onAdd({
      description: desc,
      quantity: qty,
      unit_price: price,
      line_total: total,
    });

    setOpen(false);
  }

  useEffect(() => {
    setDesc('');
    setQty(1);
    setPrice(0);
  }, [open]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-slate-900/80 bg-slate-900 px-4 py-1 rounded-lg text-white"
          onClick={() => setOpen(true)}
        >
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Item</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Label htmlFor="item-name">Item Name</Label>

            <Input
              id="item-name"
              type="text"
              value={desc}
              className={clsx(errors.desc && 'border-2 border-red-500 ')}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="item-qty">Qty</Label>
            <Input
              id="item-qty"
              type="number"
              value={parseInt(`${qty}`)}
              className={clsx(errors.qty && 'border-2 border-red-500 ')}
              onChange={(e) => setQty(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="item-price">Unit Price</Label>
            <Input
              id="item-price"
              type="number"
              value={parseInt(`${price}`)}
              className={clsx(errors.price && 'border-2 border-red-500 ')}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="item-total">Unit Price</Label>
            <Input
              id="item-total"
              type="number"
              readOnly
              value={qty * price}
              className="bg-slate-200 text-black/60"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>

          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Circle } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

type ProductData = {
  id: string;
  sku: string;
  name: string;
  price: number;
  images: string[];
};

type OrderItemData = {
  quantity: number;
  product: ProductData;
}; 

type BuyerData = {
  email: string;
  name: string;

};

type coupon = {
  id: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
};

export type OrderData = {
  id: string;
  buyer: BuyerData;
  orderItems: OrderItemData[];
  sku: string;
  totalAmount: number;
  shippingMethod?: string;
  shippingCost?: number;
  coupon: coupon | null;
};

interface CheckoutClientFormProps {
  order: OrderData;
}

const CheckoutClientForm: React.FC<CheckoutClientFormProps> = ({ order }) => {
  const [formData, setFormData] = useState({
    name: order.buyer.name,
    email: order.buyer.email,
    mobile: '',
    city: '',
    zip: '',
    stateText: '',
    stateDropdown: '',
    address: '',
  });

  const [scheduleDelivery, setScheduleDelivery] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [quantities, setQuantities] = useState(
    order.orderItems.map((item) => item.quantity)
  );


const baseTotal = order.orderItems.reduce(
  (acc, item, idx) => acc + item.product.price * quantities[idx],
  0
);

const discount = order.coupon
  ? order.coupon.discountType === 'fixed'
    ? order.coupon.discountValue
    : order.coupon.discountType === 'percentage'
    ? baseTotal * (order.coupon.discountValue / 100)
    : 0
  : 0;

const subtotal = baseTotal - discount;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const paymentMethods = ['Pix', 'Cartão de crédito', 'Boleto'];

  return (
    <div className="bg-background min-h-screen p-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input name="mobile" value={formData.mobile} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label>City</Label>
                <Input name="city" value={formData.city} onChange={handleInputChange} />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input name="zip" value={formData.zip} onChange={handleInputChange} />
              </div>
              <div>
                <Label>State (text)</Label>
                <Input
                  name="stateText"
                  value={formData.stateText}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Delivery */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Schedule Delivery</CardTitle>
              <Switch checked={scheduleDelivery} onCheckedChange={setScheduleDelivery} />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  className="rounded-md border"
                />
                {deliveryDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(deliveryDate, 'PPP')}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Note</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(method)}
                  className="flex items-center justify-center gap-2"
                >
                  {paymentMethod === method ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  {method}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                  <p className="text-sm">${item.product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 text-sm space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envio:</span>
                <span>{formatter.format(order.shippingCost ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>{formatter.format(discount ?? 0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base text-foreground">
                <span>Total:</span>
                <span>{formatter.format(order.totalAmount)}</span>
              </div>
            </div>

            <Button className="w-full mt-4">Confirm Order</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutClientForm;

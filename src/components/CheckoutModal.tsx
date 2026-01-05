import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type CheckoutModalProps = {
  total: number;
  onConfirm: (orderData: OrderData) => void;
  onClose: () => void;
};

export type OrderData = {
  address: string;
  apartment: string;
  entrance: string;
  floor: string;
  deliveryTime: 'asap' | 'scheduled';
  scheduledTime?: string;
  comment: string;
  paymentMethod: 'cash' | 'card';
};

export default function CheckoutModal({ total, onConfirm, onClose }: CheckoutModalProps) {
  const [formData, setFormData] = useState<OrderData>({
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    deliveryTime: 'asap',
    comment: '',
    paymentMethod: 'card',
  });

  const handleSubmit = () => {
    if (!formData.address.trim()) {
      toast.error('Укажите адрес доставки');
      return;
    }

    if (formData.deliveryTime === 'scheduled' && !formData.scheduledTime) {
      toast.error('Укажите время доставки');
      return;
    }

    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Оформление заказа</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-base font-semibold">
                Адрес доставки *
              </Label>
              <Input
                id="address"
                placeholder="Улица, дом"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="apartment" className="text-sm">Квартира</Label>
                <Input
                  id="apartment"
                  placeholder="000"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="entrance" className="text-sm">Подъезд</Label>
                <Input
                  id="entrance"
                  placeholder="0"
                  value={formData.entrance}
                  onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="floor" className="text-sm">Этаж</Label>
                <Input
                  id="floor"
                  placeholder="0"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Время доставки</Label>
            <RadioGroup
              value={formData.deliveryTime}
              onValueChange={(value) => setFormData({ ...formData, deliveryTime: value as 'asap' | 'scheduled' })}
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="asap" id="asap" />
                <Label htmlFor="asap" className="flex-1 cursor-pointer font-normal">
                  Как можно скорее (30-40 минут)
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled" className="flex-1 cursor-pointer font-normal">
                  Ко времени
                </Label>
              </div>
            </RadioGroup>

            {formData.deliveryTime === 'scheduled' && (
              <Input
                type="time"
                value={formData.scheduledTime || ''}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="comment" className="text-base font-semibold">
              Комментарий к заказу
            </Label>
            <Textarea
              id="comment"
              placeholder="Пожелания к заказу, уточнения по доставке..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="mt-2 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Способ оплаты</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as 'cash' | 'card' })}
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer font-normal flex items-center gap-2">
                  <Icon name="CreditCard" size={18} />
                  Картой онлайн
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer font-normal flex items-center gap-2">
                  <Icon name="Wallet" size={18} />
                  Наличными курьеру
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Итого:</span>
              <span className="text-2xl font-bold text-primary">{total} ₽</span>
            </div>
            <Button onClick={handleSubmit} className="w-full" size="lg">
              Оформить заказ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

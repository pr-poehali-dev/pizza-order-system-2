import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type AuthModalProps = {
  onAuth: (phone: string, name: string) => void;
  onClose: () => void;
};

export default function AuthModal({ onAuth, onClose }: AuthModalProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+7 (${numbers}`;
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handlePhoneSubmit = () => {
    if (phone.replace(/\D/g, '').length === 11) {
      toast.success('Код отправлен на ваш номер');
      setStep('code');
    } else {
      toast.error('Введите корректный номер телефона');
    }
  };

  const handleCodeSubmit = () => {
    if (code.length === 4) {
      setStep('name');
    } else {
      toast.error('Введите код из 4 цифр');
    }
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      onAuth(phone, name);
      toast.success(`Добро пожаловать, ${name}!`);
      onClose();
    } else {
      toast.error('Введите ваше имя');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
              <CardDescription className="mt-2">
                {step === 'phone' && 'Введите номер телефона'}
                {step === 'code' && 'Введите код из СМС'}
                {step === 'name' && 'Как вас зовут?'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' && (
            <>
              <Input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                className="text-lg"
                maxLength={18}
              />
              <Button onClick={handlePhoneSubmit} className="w-full" size="lg">
                Получить код
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Код отправлен на номер<br />
                  <span className="font-semibold text-foreground">{phone}</span>
                </p>
              </div>
              <Input
                type="text"
                placeholder="____"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                className="text-center text-2xl tracking-widest font-bold"
                maxLength={4}
              />
              <Button onClick={handleCodeSubmit} className="w-full" size="lg">
                Подтвердить
              </Button>
              <Button variant="ghost" onClick={() => setStep('phone')} className="w-full">
                Изменить номер
              </Button>
            </>
          )}

          {step === 'name' && (
            <>
              <Input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                className="text-lg"
              />
              <Button onClick={handleNameSubmit} className="w-full" size="lg">
                Продолжить
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Promo = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  code?: string;
  color: string;
};

const promos: Promo[] = [
  {
    id: 1,
    title: 'Скидка 50% на вторую пиццу!',
    description: 'При заказе двух пицц — вторая со скидкой 50%',
    emoji: '🍕🍕',
    code: 'GAME50',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 2,
    title: 'Бесплатная доставка!',
    description: 'При заказе от 1000₽ доставка бесплатная',
    emoji: '🚚',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 3,
    title: 'Новое комбо за 650₽!',
    description: 'Пицца + напиток + закуска = выгода!',
    emoji: '🎁',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 4,
    title: 'Счастливые часы 14:00-16:00',
    description: 'Скидка 20% на все пиццы каждый день',
    emoji: '⏰',
    code: 'PIZZA20',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 5,
    title: 'Бонусы x2 при заказе!',
    description: 'Двойные бонусы за каждый заказ сегодня',
    emoji: '🪙',
    color: 'from-purple-500 to-pink-500',
  },
];

type PromoNotificationProps = {
  onCopyPromoCode?: (code: string) => void;
};

export default function PromoNotification({ onCopyPromoCode }: PromoNotificationProps) {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || isDismissed) return;

    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed]);

  const handleCopyCode = () => {
    const promo = promos[currentPromo];
    if (promo.code && onCopyPromoCode) {
      onCopyPromoCode(promo.code);
    }
  };

  if (!isVisible || isDismissed) return null;

  const promo = promos[currentPromo];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <Card className={`bg-gradient-to-r ${promo.color} text-white shadow-2xl max-w-sm overflow-hidden animate-bounce-in`}>
        <div className="p-4 relative">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 text-white hover:bg-white/20"
            onClick={() => setIsDismissed(true)}
          >
            <Icon name="X" size={16} />
          </Button>

          <div className="flex items-start gap-4 pr-8">
            <div className="text-5xl animate-bounce">{promo.emoji}</div>
            <div className="flex-1">
              <h3 className="text-xl font-black mb-2">{promo.title}</h3>
              <p className="text-sm opacity-90 mb-3">{promo.description}</p>
              
              {promo.code && (
                <div className="flex gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 font-mono font-bold text-sm">
                    {promo.code}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCopyCode}
                    className="font-bold"
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Скопировать
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-1 mt-4">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentPromo ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="h-1 bg-white/30 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-white animate-[progress_8s_linear_infinite]"
            style={{
              animation: 'progress 8s linear infinite',
            }}
          />
        </div>
      </Card>

      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

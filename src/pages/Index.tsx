import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import PizzaConstructor from '@/components/PizzaConstructor';
import AuthModal from '@/components/AuthModal';
import CheckoutModal, { OrderData } from '@/components/CheckoutModal';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: 'pizza' | 'snack' | 'drink' | 'combo';
  rating?: number;
  popular?: boolean;
};

type CartItem = MenuItem & { quantity: number };

type Order = {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
  status: 'delivered' | 'preparing' | 'cancelled' | 'cooking' | 'on-the-way';
  orderData?: OrderData;
};

type User = {
  phone: string;
  name: string;
  bonus: number;
};

const menuItems: MenuItem[] = [
  { id: 1, name: 'Маргарита', description: 'Томаты, моцарелла, базилик', price: 450, emoji: '🍕', category: 'pizza', rating: 4.8, popular: true },
  { id: 2, name: 'Пепперони', description: 'Пепперони, моцарелла, томатный соус', price: 520, emoji: '🍕', category: 'pizza', rating: 4.9, popular: true },
  { id: 3, name: 'Четыре сыра', description: 'Моцарелла, пармезан, горгонзола, чеддер', price: 580, emoji: '🍕', category: 'pizza', rating: 4.7 },
  { id: 4, name: 'Гавайская', description: 'Ветчина, ананасы, моцарелла', price: 500, emoji: '🍕', category: 'pizza', rating: 4.5 },
  { id: 5, name: 'Мексиканская', description: 'Острая говядина, халапеньо, кукуруза', price: 550, emoji: '🍕', category: 'pizza', rating: 4.6 },
  { id: 6, name: 'Вегетарианская', description: 'Шампиньоны, томаты, перец, оливки', price: 480, emoji: '🍕', category: 'pizza', rating: 4.4 },
  { id: 7, name: 'Мясная', description: 'Говядина, бекон, курица, ветчина', price: 620, emoji: '🍕', category: 'pizza', rating: 4.9 },
  { id: 8, name: 'Морская', description: 'Креветки, кальмары, мидии, лосось', price: 680, emoji: '🍕', category: 'pizza', rating: 4.7 },
  { id: 9, name: 'Барбекю', description: 'Курица, соус барбекю, красный лук', price: 540, emoji: '🍕', category: 'pizza', rating: 4.6 },
  { id: 10, name: 'Цезарь', description: 'Курица, салат романо, соус цезарь', price: 560, emoji: '🍕', category: 'pizza', rating: 4.5 },
  { id: 11, name: 'Грибная', description: 'Шампиньоны, белые грибы, трюфель', price: 590, emoji: '🍕', category: 'pizza', rating: 4.8 },
  { id: 12, name: 'Дьябола', description: 'Острая салями, перец чили, халапеньо', price: 570, emoji: '🍕', category: 'pizza', rating: 4.7 },
  { id: 13, name: 'Карбонара', description: 'Бекон, сливочный соус, пармезан, яйцо', price: 600, emoji: '🍕', category: 'pizza', rating: 4.8 },
  
  { id: 14, name: 'Куриные крылышки', description: 'Острые крылышки с соусом BBQ', price: 280, emoji: '🍗', category: 'snack', rating: 4.7 },
  { id: 15, name: 'Картофель фри', description: 'Хрустящий картофель с соусом', price: 180, emoji: '🍟', category: 'snack', rating: 4.5 },
  { id: 16, name: 'Чесночные гренки', description: 'Хрустящие гренки с чесночным соусом', price: 150, emoji: '🥖', category: 'snack', rating: 4.6 },
  { id: 17, name: 'Моцарелла стики', description: 'Жареные палочки из моцареллы', price: 250, emoji: '🧀', category: 'snack', rating: 4.8 },
  { id: 18, name: 'Нагетсы', description: 'Куриные нагетсы с соусом на выбор', price: 220, emoji: '🍗', category: 'snack', rating: 4.4 },
  
  { id: 19, name: 'Coca-Cola', description: 'Освежающий напиток 0.5л', price: 120, emoji: '🥤', category: 'drink', rating: 4.9 },
  { id: 20, name: 'Сок апельсиновый', description: 'Свежевыжатый сок 0.3л', price: 150, emoji: '🍊', category: 'drink', rating: 4.7 },
  { id: 21, name: 'Лимонад', description: 'Домашний лимонад 0.5л', price: 140, emoji: '🍋', category: 'drink', rating: 4.8 },
  { id: 22, name: 'Морс', description: 'Клюквенный морс 0.5л', price: 130, emoji: '🫐', category: 'drink', rating: 4.6 },
  { id: 23, name: 'Чай', description: 'Зеленый или черный чай', price: 100, emoji: '☕', category: 'drink', rating: 4.5 },
  
  { id: 24, name: 'Комбо Классик', description: 'Пицца Маргарита + напиток + картофель фри', price: 650, emoji: '🎁', category: 'combo', popular: true },
  { id: 25, name: 'Комбо Мясное', description: 'Пицца Мясная + крылышки + 2 напитка', price: 950, emoji: '🎁', category: 'combo', popular: true },
  { id: 26, name: 'Комбо Острое', description: 'Пицца Пепперони + острые крылышки + напиток', price: 850, emoji: '🎁', category: 'combo' },
  { id: 27, name: 'Комбо Вегги', description: 'Пицца Вегетарианская + сок + гренки', price: 700, emoji: '🎁', category: 'combo' },
  { id: 28, name: 'Комбо на двоих', description: '2 пиццы на выбор + закуска + 2 напитка', price: 1400, emoji: '🎁', category: 'combo' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showConstructor, setShowConstructor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percent' | 'fixed' } | null>(null);
  const [useBonuses, setUseBonuses] = useState(false);

  const promoCodes = [
    { code: 'PIZZA20', discount: 20, type: 'percent' as const, description: 'Скидка 20% на всё' },
    { code: 'NEWUSER', discount: 300, type: 'fixed' as const, description: 'Скидка 300₽ для новых' },
    { code: 'GAME50', discount: 50, type: 'percent' as const, description: 'Игровая скидка 50%' },
    { code: 'COMBO10', discount: 10, type: 'percent' as const, description: 'Скидка 10% на комбо' },
  ];

  const addToCart = (item: MenuItem | { name: string; price: number; description: string; emoji: string }) => {
    const menuItem = 'id' in item ? item : {
      ...item,
      id: Date.now(),
      category: 'pizza' as const,
    };
    
    const existingItem = cart.find(i => i.id === menuItem.id);
    if (existingItem) {
      setCart(cart.map(i => i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }]);
    }
    toast.success(`${menuItem.name} добавлен в корзину!`);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info('Товар удален из корзины');
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      toast.success(`Промокод ${promo.code} применён!`);
      setPromoCode('');
    } else {
      toast.error('Промокод не найден');
    }
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percent') {
      return Math.round(cartSubtotal * (appliedPromo.discount / 100));
    }
    return Math.min(appliedPromo.discount, cartSubtotal);
  };

  const bonusDiscount = useBonuses && user ? Math.min(user.bonus, cartSubtotal) : 0;
  const promoDiscount = calculateDiscount();
  const cartTotal = Math.max(0, cartSubtotal - promoDiscount - bonusDiscount);

  const handleAuth = (phone: string, name: string) => {
    setUser({ phone, name, bonus: 450 });
  };

  const handleCheckout = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderConfirm = (orderData: OrderData) => {
    const earnedBonus = Math.round(cartTotal * 0.1);
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      status: 'preparing',
      orderData,
    };

    setOrders([newOrder, ...orders]);
    
    if (user) {
      const updatedBonus = useBonuses ? user.bonus - bonusDiscount + earnedBonus : user.bonus + earnedBonus;
      setUser({ ...user, bonus: updatedBonus });
    }

    toast.success(`Заказ оформлен! Начислено ${earnedBonus} бонусов`);
    setCart([]);
    setAppliedPromo(null);
    setUseBonuses(false);
    setPromoCode('');
    setShowCheckout(false);
    setActiveTab('orders');
  };

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} className="hover:shadow-md transition-shadow border-border group">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center text-6xl">
          {item.emoji}
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">{item.name}</h3>
            {item.popular && (
              <Badge variant="secondary" className="text-xs">Хит</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold">{item.price} ₽</span>
            <Button onClick={() => addToCart(item)} size="sm">
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🍕</div>
              <h1 className="text-2xl font-bold">Синица</h1>
            </div>
            <div className="flex gap-2">
              {user ? (
                <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                  <Icon name="User" size={20} className="mr-2" />
                  {user.name}
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => setShowAuth(true)}>
                  <Icon name="User" size={20} className="mr-2" />
                  Войти
                </Button>
              )}
              <Button
                variant="default"
                onClick={() => setActiveTab('cart')}
                className="relative"
              >
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Меню</h2>
              <Button variant="outline" onClick={() => setShowConstructor(true)}>
                <Icon name="Sparkles" size={18} className="mr-2" />
                Создать свою пиццу
              </Button>
            </div>

            <Tabs defaultValue="pizza" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="pizza" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Пиццы
                </TabsTrigger>
                <TabsTrigger value="snack" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Закуски
                </TabsTrigger>
                <TabsTrigger value="drink" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Напитки
                </TabsTrigger>
                <TabsTrigger value="combo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Комбо
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pizza" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.filter(item => item.category === 'pizza').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="snack" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.filter(item => item.category === 'snack').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="drink" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.filter(item => item.category === 'drink').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="combo" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.filter(item => item.category === 'combo').map(renderMenuItem)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Корзина</h2>
            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-lg text-muted-foreground mb-4">Корзина пуста</p>
                <Button onClick={() => setActiveTab('menu')}>
                  Перейти в меню
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.emoji}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8"
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8"
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                          <span className="text-lg font-bold w-20 text-right">
                            {item.price * item.quantity} ₽
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Separator />

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
                      />
                      <Button onClick={applyPromoCode} disabled={!promoCode} variant="secondary">
                        Применить
                      </Button>
                    </div>

                    {appliedPromo && (
                      <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
                        <span className="font-semibold text-sm">{appliedPromo.code}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAppliedPromo(null)}
                          className="h-7"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    )}

                    {user && user.bonus > 0 && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">Списать бонусы</p>
                            <p className="text-xs text-muted-foreground">Доступно: {user.bonus} ₽</p>
                          </div>
                          <Switch
                            checked={useBonuses}
                            onCheckedChange={setUseBonuses}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Сумма:</span>
                      <span>{cartSubtotal} ₽</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Скидка:</span>
                        <span>-{promoDiscount} ₽</span>
                      </div>
                    )}
                    {bonusDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Бонусы:</span>
                        <span>-{bonusDiscount} ₽</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого:</span>
                      <span>{cartTotal} ₽</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Заказы</h2>
            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg text-muted-foreground">Заказов пока нет</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                          <CardDescription>{new Date(order.date).toLocaleDateString('ru-RU')}</CardDescription>
                        </div>
                        <Badge>
                          {order.status === 'delivered' && 'Доставлен'}
                          {order.status === 'cooking' && 'Готовится'}
                          {order.status === 'on-the-way' && 'В пути'}
                          {order.status === 'preparing' && 'Принят'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{item.price * item.quantity} ₽</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between font-bold">
                        <span>Итого:</span>
                        <span>{order.total} ₽</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            {user ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.phone}</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Бонусы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{user.bonus} ₽</div>
                    <p className="text-sm text-muted-foreground mt-2">Доступно для списания</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-lg text-muted-foreground mb-4">Войдите в аккаунт</p>
                <Button onClick={() => setShowAuth(true)}>
                  Войти
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('menu')}
              className={`flex-col h-auto py-2 ${activeTab === 'menu' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name="Home" size={20} />
              <span className="text-xs mt-1">Меню</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('cart')}
              className={`flex-col h-auto py-2 relative ${activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name="ShoppingCart" size={20} />
              <span className="text-xs mt-1">Корзина</span>
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-6 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('orders')}
              className={`flex-col h-auto py-2 ${activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name="Package" size={20} />
              <span className="text-xs mt-1">Заказы</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('profile')}
              className={`flex-col h-auto py-2 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name="User" size={20} />
              <span className="text-xs mt-1">Профиль</span>
            </Button>
          </div>
        </div>
      </nav>

      {showConstructor && (
        <PizzaConstructor
          onAddToCart={(pizza) => {
            addToCart(pizza);
          }}
          onClose={() => setShowConstructor(false)}
          cartItemsCount={cartItemsCount}
          onOpenCart={() => {
            setShowConstructor(false);
            setActiveTab('cart');
          }}
        />
      )}

      {showAuth && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          total={cartTotal}
          onConfirm={handleOrderConfirm}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

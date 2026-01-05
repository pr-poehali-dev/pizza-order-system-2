import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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
  estimatedTime?: number;
  courierPosition?: { lat: number; lng: number };
};

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

const menuItems: MenuItem[] = [
  { id: 1, name: 'Маргарита', description: 'Классическая пицца с томатами и моцареллой', price: 450, emoji: '🍕', category: 'pizza', rating: 4.8, popular: true },
  { id: 2, name: 'Пепперони', description: 'Острая пицца с колбасой пепперони', price: 520, emoji: '🌶️', category: 'pizza', rating: 4.9, popular: true },
  { id: 3, name: 'Четыре сыра', description: 'Моцарелла, пармезан, горгонзола, чеддер', price: 580, emoji: '🧀', category: 'pizza', rating: 4.7 },
  { id: 4, name: 'Гавайская', description: 'Ветчина, ананасы, сыр моцарелла', price: 500, emoji: '🍍', category: 'pizza', rating: 4.5 },
  { id: 5, name: 'Мексиканская', description: 'Острая говядина, перец халапеньо, кукуруза', price: 550, emoji: '🌮', category: 'pizza', rating: 4.6 },
  { id: 6, name: 'Вегетарианская', description: 'Шампиньоны, томаты, перец, оливки', price: 480, emoji: '🥗', category: 'pizza', rating: 4.4 },
  { id: 7, name: 'Мясная', description: 'Говядина, бекон, курица, ветчина', price: 620, emoji: '🥩', category: 'pizza', rating: 4.9 },
  { id: 8, name: 'Морская', description: 'Креветки, кальмары, мидии, лосось', price: 680, emoji: '🦐', category: 'pizza', rating: 4.7 },
  { id: 9, name: 'Барбекю', description: 'Курица, соус барбекю, красный лук', price: 540, emoji: '🍗', category: 'pizza', rating: 4.6 },
  { id: 10, name: 'Цезарь', description: 'Курица, салат романо, соус цезарь', price: 560, emoji: '🥬', category: 'pizza', rating: 4.5 },
  { id: 11, name: 'Грибная', description: 'Шампиньоны, белые грибы, трюфель', price: 590, emoji: '🍄', category: 'pizza', rating: 4.8 },
  { id: 12, name: 'Дьябола', description: 'Острая салями, перец чили, халапеньо', price: 570, emoji: '🔥', category: 'pizza', rating: 4.7 },
  { id: 13, name: 'Карбонара', description: 'Бекон, сливочный соус, пармезан, яйцо', price: 600, emoji: '🥓', category: 'pizza', rating: 4.8 },
  
  { id: 14, name: 'Куриные крылышки', description: 'Острые крылышки с соусом BBQ', price: 280, emoji: '🍗', category: 'snack', rating: 4.7 },
  { id: 15, name: 'Картофель фри', description: 'Хрустящий картофель с соусом', price: 180, emoji: '🍟', category: 'snack', rating: 4.5 },
  { id: 16, name: 'Чесночные гренки', description: 'Хрустящие гренки с чесночным соусом', price: 150, emoji: '🧄', category: 'snack', rating: 4.6 },
  { id: 17, name: 'Моцарелла стики', description: 'Жареные палочки из моцареллы', price: 250, emoji: '🧀', category: 'snack', rating: 4.8 },
  { id: 18, name: 'Нагетсы', description: 'Куриные нагетсы с соусом на выбор', price: 220, emoji: '🍗', category: 'snack', rating: 4.4 },
  
  { id: 19, name: 'Coca-Cola', description: 'Освежающий напиток 0.5л', price: 120, emoji: '🥤', category: 'drink', rating: 4.9 },
  { id: 20, name: 'Сок апельсиновый', description: 'Свежевыжатый сок 0.3л', price: 150, emoji: '🍊', category: 'drink', rating: 4.7 },
  { id: 21, name: 'Лимонад', description: 'Домашний лимонад 0.5л', price: 140, emoji: '🍋', category: 'drink', rating: 4.8 },
  { id: 22, name: 'Морс', description: 'Клюквенный морс 0.5л', price: 130, emoji: '🫐', category: 'drink', rating: 4.6 },
  { id: 23, name: 'Чай', description: 'Зеленый или черный чай', price: 100, emoji: '🍵', category: 'drink', rating: 4.5 },
  
  { id: 24, name: 'Комбо Классик', description: 'Пицца Маргарита + напиток + картофель фри', price: 650, emoji: '🎁', category: 'combo', popular: true },
  { id: 25, name: 'Комбо Мясное', description: 'Пицца Мясная + крылышки + 2 напитка', price: 950, emoji: '🎁', category: 'combo', popular: true },
  { id: 26, name: 'Комбо Острое', description: 'Пицца Пепперони + острые крылышки + напиток', price: 850, emoji: '🎁', category: 'combo' },
  { id: 27, name: 'Комбо Вегги', description: 'Пицца Вегетарианская + сок + гренки', price: 700, emoji: '🎁', category: 'combo' },
  { id: 28, name: 'Комбо на двоих', description: '2 пиццы на выбор + закуска + 2 напитка', price: 1400, emoji: '🎁', category: 'combo' },
];

const mockOrders: Order[] = [
  {
    id: 1,
    date: '2024-01-15',
    items: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[13], quantity: 1 }
    ],
    total: 1180,
    status: 'delivered'
  },
  {
    id: 2,
    date: '2024-01-10',
    items: [
      { ...menuItems[1], quantity: 1 },
      { ...menuItems[18], quantity: 1 }
    ],
    total: 640,
    status: 'delivered'
  },
  {
    id: 3,
    date: new Date().toISOString().split('T')[0],
    items: [
      { ...menuItems[6], quantity: 1 },
      { ...menuItems[14], quantity: 1 }
    ],
    total: 900,
    status: 'on-the-way',
    estimatedTime: 15,
    courierPosition: { lat: 55.7558, lng: 37.6173 }
  }
];

const mockReviews: Review[] = [
  { id: 1, userName: 'Алексей М.', rating: 5, comment: 'Отличная пицца! Доставили быстро и горячую 🔥', date: '2024-01-15' },
  { id: 2, userName: 'Мария К.', rating: 5, comment: 'Очень вкусно, особенно понравилась Маргарита!', date: '2024-01-14' },
  { id: 3, userName: 'Дмитрий П.', rating: 4, comment: 'Хорошая пицца, но можно побольше начинки', date: '2024-01-12' },
  { id: 4, userName: 'Елена С.', rating: 5, comment: 'Лучшая пиццерия в городе! Комбо очень выгодное 🎉', date: '2024-01-10' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userBonus, setUserBonus] = useState(450);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [trackingOrderId, setTrackingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status === 'on-the-way' && order.estimatedTime && order.estimatedTime > 0) {
            const newTime = order.estimatedTime - 1;
            if (newTime === 0) {
              toast.success('🎉 Ваш заказ доставлен! Приятного аппетита!');
              return { ...order, status: 'delivered' as const, estimatedTime: 0 };
            }
            return { ...order, estimatedTime: newTime };
          }
          return order;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.emoji} ${item.name} добавлена в корзину!`);
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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderMenuItem = (item: MenuItem) => (
    <Card key={item.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="text-5xl mb-2">{item.emoji}</div>
          {item.popular && (
            <Badge className="bg-accent text-accent-foreground">🔥 Хит</Badge>
          )}
        </div>
        <CardTitle className="text-xl">{item.name}</CardTitle>
        <CardDescription className="text-sm">{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
          {item.rating && (
            <div className="flex items-center gap-1">
              <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
              <span className="text-sm font-semibold">{item.rating}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart(item)} className="w-full font-semibold" size="lg">
          <Icon name="ShoppingCart" size={18} className="mr-2" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b-4 border-primary shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-bounce-in">🍕</div>
              <div>
                <h1 className="text-3xl font-black text-primary">PizzaGame</h1>
                <p className="text-xs text-muted-foreground">Вкусно играем!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'cart' ? 'default' : 'outline'}
                onClick={() => setActiveTab('cart')}
                className="relative"
              >
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-card border-b-2 border-border sticky top-[88px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'menu', label: 'Меню', icon: 'UtensilsCrossed' },
              { id: 'orders', label: 'Заказы', icon: 'Package' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
              { id: 'reviews', label: 'Отзывы', icon: 'Star' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 font-semibold whitespace-nowrap"
              >
                <Icon name={tab.icon as any} size={18} />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-black mb-4">Горячая пицца за 30 минут! 🚀</h2>
                <p className="text-xl mb-6 opacity-90">Или пицца бесплатно! Играй и выигрывай бонусы</p>
                <Button size="lg" variant="secondary" className="text-lg font-bold" onClick={() => setActiveTab('menu')}>
                  Выбрать пиццу
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
                <span>🔥</span> Популярные позиции
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.popular).map(renderMenuItem)}
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
                <span>🎁</span> Комбо-наборы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.filter(item => item.category === 'combo').slice(0, 3).map(renderMenuItem)}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black mb-8">Меню 🍕</h2>
            <Tabs defaultValue="pizza" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 h-auto">
                <TabsTrigger value="pizza" className="text-lg font-semibold py-3">🍕 Пиццы</TabsTrigger>
                <TabsTrigger value="snack" className="text-lg font-semibold py-3">🍟 Закуски</TabsTrigger>
                <TabsTrigger value="drink" className="text-lg font-semibold py-3">🥤 Напитки</TabsTrigger>
                <TabsTrigger value="combo" className="text-lg font-semibold py-3">🎁 Комбо</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pizza">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(item => item.category === 'pizza').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="snack">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(item => item.category === 'snack').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="drink">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(item => item.category === 'drink').map(renderMenuItem)}
                </div>
              </TabsContent>
              
              <TabsContent value="combo">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(item => item.category === 'combo').map(renderMenuItem)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black mb-8">Корзина 🛒</h2>
            {cart.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-xl text-muted-foreground mb-6">Корзина пуста</p>
                <Button size="lg" onClick={() => setActiveTab('menu')}>
                  Перейти в меню
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{item.emoji}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                          <span className="text-2xl font-bold text-primary w-24 text-right">
                            {item.price * item.quantity} ₽
                          </span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Separator />
                
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center text-2xl font-black">
                      <span>Итого:</span>
                      <span>{cartTotal} ₽</span>
                    </div>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full mt-4 text-lg font-bold"
                      onClick={() => {
                        toast.success('🎉 Заказ оформлен! Доставим через 30 минут');
                        setCart([]);
                      }}
                    >
                      Оформить заказ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in space-y-6">
            <Card className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-3xl">👤</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-black mb-2">Игрок #1234</h2>
                    <p className="text-lg opacity-90">+7 (999) 123-45-67</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span>🎮</span> Система лояльности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-2">Ваши бонусы</p>
                  <p className="text-5xl font-black text-primary">{userBonus} 🪙</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Заказов</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold">5.0</p>
                    <p className="text-sm text-muted-foreground">Рейтинг</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">⚙️ Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-lg">
                  <Icon name="MapPin" size={20} className="mr-3" />
                  Адреса доставки
                </Button>
                <Button variant="outline" className="w-full justify-start text-lg">
                  <Icon name="CreditCard" size={20} className="mr-3" />
                  Способы оплаты
                </Button>
                <Button variant="outline" className="w-full justify-start text-lg">
                  <Icon name="Bell" size={20} className="mr-3" />
                  Уведомления
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black mb-8">История заказов 📦</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">Заказ #{order.id}</CardTitle>
                        <CardDescription>{new Date(order.date).toLocaleDateString('ru-RU')}</CardDescription>
                      </div>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="animate-pulse">
                        {order.status === 'delivered' && '✅ Доставлен'}
                        {order.status === 'cooking' && '👨‍🍳 Готовится'}
                        {order.status === 'on-the-way' && '🚚 В пути'}
                        {order.status === 'preparing' && '📋 Принят'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {order.status === 'on-the-way' && order.estimatedTime && (
                      <div className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border-2 border-primary animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl animate-bounce">🚚</div>
                            <div>
                              <p className="text-lg font-bold">Курьер в пути!</p>
                              <p className="text-sm text-muted-foreground">Заказ доставляется</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-primary">{order.estimatedTime}</p>
                            <p className="text-sm text-muted-foreground">минут</p>
                          </div>
                        </div>
                        
                        <div className="relative bg-muted rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold">Маршрут доставки</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setTrackingOrderId(trackingOrderId === order.id ? null : order.id)}
                            >
                              <Icon name={trackingOrderId === order.id ? "ChevronUp" : "MapPin"} size={16} />
                            </Button>
                          </div>
                          
                          {trackingOrderId === order.id && (
                            <div className="mt-4 space-y-3 animate-fade-in">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                  <Icon name="Home" className="text-white" size={16} />
                                </div>
                                <div>
                                  <p className="font-semibold">Пиццерия PizzaGame</p>
                                  <p className="text-xs text-muted-foreground">ул. Пушкина, 15</p>
                                </div>
                              </div>
                              
                              <div className="relative pl-4 border-l-2 border-dashed border-primary ml-4 py-2">
                                <div className="absolute -left-2 top-1/2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                                <p className="text-sm font-semibold">🚚 Курьер Иван</p>
                                <p className="text-xs text-muted-foreground">Движется к вам</p>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                  <Icon name="MapPin" className="text-white" size={16} />
                                </div>
                                <div>
                                  <p className="font-semibold">Ваш адрес</p>
                                  <p className="text-xs text-muted-foreground">ул. Ленина, 42, кв. 15</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 bg-background rounded-lg p-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>🏠 Пиццерия</span>
                              <span>📍 Вы</span>
                            </div>
                            <div className="relative h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                                style={{ width: `${100 - (order.estimatedTime / 30 * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Icon name="Phone" size={16} className="mr-2" />
                            Позвонить курьеру
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Icon name="MessageSquare" size={16} className="mr-2" />
                            Написать
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <span className="text-2xl">{item.emoji}</span>
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">x{item.quantity}</span>
                          </span>
                          <span className="font-semibold">{item.price * item.quantity} ₽</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{order.total} ₽</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                      order.items.forEach(item => addToCart(item));
                      setActiveTab('cart');
                    }}>
                      <Icon name="RotateCcw" size={18} className="mr-2" />
                      Повторить заказ
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-black mb-8">Отзывы ⭐</h2>
            <div className="space-y-4">
              {mockReviews.map(review => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="text-xl">👤</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{review.userName}</CardTitle>
                        <CardDescription>{new Date(review.date).toLocaleDateString('ru-RU')}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={18}
                            className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-card border-t-4 border-primary mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🍕</div>
          <p className="text-xl font-bold mb-2">PizzaGame</p>
          <p className="text-muted-foreground">Вкусно играем с 2024 года!</p>
        </div>
      </footer>
    </div>
  );
}
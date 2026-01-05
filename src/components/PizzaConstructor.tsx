import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type PizzaSize = 'small' | 'medium' | 'large';
type DoughType = 'thin' | 'thick';

type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'sauce' | 'cheese' | 'meat' | 'vegetable' | 'other';
};

const ingredients: Ingredient[] = [
  { id: 'tomato-sauce', name: 'Томатный соус', emoji: '�番', price: 0, category: 'sauce' },
  { id: 'white-sauce', name: 'Сливочный соус', emoji: '🥛', price: 50, category: 'sauce' },
  { id: 'bbq-sauce', name: 'Соус BBQ', emoji: '🍖', price: 50, category: 'sauce' },
  
  { id: 'mozzarella', name: 'Моцарелла', emoji: '🧀', price: 100, category: 'cheese' },
  { id: 'parmesan', name: 'Пармезан', emoji: '🧀', price: 120, category: 'cheese' },
  { id: 'cheddar', name: 'Чеддер', emoji: '🧀', price: 110, category: 'cheese' },
  { id: 'gorgonzola', name: 'Горгонзола', emoji: '🧀', price: 130, category: 'cheese' },
  
  { id: 'pepperoni', name: 'Пепперони', emoji: '🌶️', price: 150, category: 'meat' },
  { id: 'bacon', name: 'Бекон', emoji: '🥓', price: 140, category: 'meat' },
  { id: 'chicken', name: 'Курица', emoji: '🍗', price: 130, category: 'meat' },
  { id: 'beef', name: 'Говядина', emoji: '🥩', price: 160, category: 'meat' },
  { id: 'ham', name: 'Ветчина', emoji: '🥓', price: 120, category: 'meat' },
  { id: 'sausage', name: 'Колбаски', emoji: '🌭', price: 140, category: 'meat' },
  
  { id: 'mushrooms', name: 'Шампиньоны', emoji: '🍄', price: 80, category: 'vegetable' },
  { id: 'tomatoes', name: 'Томаты', emoji: '🍅', price: 60, category: 'vegetable' },
  { id: 'peppers', name: 'Болгарский перец', emoji: '🫑', price: 70, category: 'vegetable' },
  { id: 'onion', name: 'Красный лук', emoji: '🧅', price: 50, category: 'vegetable' },
  { id: 'olives', name: 'Оливки', emoji: '🫒', price: 80, category: 'vegetable' },
  { id: 'corn', name: 'Кукуруза', emoji: '🌽', price: 60, category: 'vegetable' },
  { id: 'jalapeno', name: 'Халапеньо', emoji: '🌶️', price: 70, category: 'vegetable' },
  { id: 'pineapple', name: 'Ананасы', emoji: '🍍', price: 90, category: 'vegetable' },
  
  { id: 'basil', name: 'Базилик', emoji: '🌿', price: 40, category: 'other' },
  { id: 'oregano', name: 'Орегано', emoji: '🌿', price: 30, category: 'other' },
  { id: 'garlic', name: 'Чеснок', emoji: '🧄', price: 40, category: 'other' },
  { id: 'egg', name: 'Яйцо', emoji: '🥚', price: 50, category: 'other' },
];

const sizeInfo = {
  small: { label: '25 см', price: 300, emoji: '🍕' },
  medium: { label: '30 см', price: 450, emoji: '🍕🍕' },
  large: { label: '35 см', price: 600, emoji: '🍕🍕🍕' },
};

const doughInfo = {
  thin: { label: 'Тонкое', price: 0, emoji: '📄' },
  thick: { label: 'Пышное', price: 100, emoji: '🥖' },
};

type PizzaConstructorProps = {
  onAddToCart: (pizza: { name: string; price: number; description: string; emoji: string }) => void;
  onClose: () => void;
  cartItemsCount: number;
  onOpenCart: () => void;
};

export default function PizzaConstructor({ onAddToCart, onClose, cartItemsCount, onOpenCart }: PizzaConstructorProps) {
  const [size, setSize] = useState<PizzaSize>('medium');
  const [dough, setDough] = useState<DoughType>('thin');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set(['tomato-sauce', 'mozzarella']));

  const toggleIngredient = (id: string) => {
    const newSelected = new Set(selectedIngredients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (ingredients.find(i => i.id === id)?.category === 'sauce') {
        Array.from(newSelected).forEach(selectedId => {
          if (ingredients.find(i => i.id === selectedId)?.category === 'sauce') {
            newSelected.delete(selectedId);
          }
        });
      }
      newSelected.add(id);
    }
    setSelectedIngredients(newSelected);
  };

  const calculateTotal = () => {
    let total = sizeInfo[size].price + doughInfo[dough].price;
    selectedIngredients.forEach(id => {
      const ingredient = ingredients.find(i => i.id === id);
      if (ingredient) total += ingredient.price;
    });
    return total;
  };

  const getSelectedIngredients = () => {
    return Array.from(selectedIngredients)
      .map(id => ingredients.find(i => i.id === id))
      .filter(Boolean) as Ingredient[];
  };

  const handleAddToCart = () => {
    const selected = getSelectedIngredients();
    const description = selected.map(i => i.name).join(', ');
    onAddToCart({
      name: '🎨 Своя пицца',
      price: calculateTotal(),
      description: `${sizeInfo[size].label}, ${doughInfo[dough].label.toLowerCase()} тесто. ${description}`,
      emoji: '🎨',
    });
    toast.success('🎨 Ваша уникальная пицца добавлена в корзину!');
    onClose();
  };

  const groupedIngredients = {
    sauce: ingredients.filter(i => i.category === 'sauce'),
    cheese: ingredients.filter(i => i.category === 'cheese'),
    meat: ingredients.filter(i => i.category === 'meat'),
    vegetable: ingredients.filter(i => i.category === 'vegetable'),
    other: ingredients.filter(i => i.category === 'other'),
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                🎨 Конструктор пиццы
              </CardTitle>
              <CardDescription className="mt-2">
                Создай свою уникальную пиццу!
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onOpenCart} className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-[60vh]">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                📏 Выбери размер
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(sizeInfo) as PizzaSize[]).map(sizeKey => (
                  <Button
                    key={sizeKey}
                    variant={size === sizeKey ? 'default' : 'outline'}
                    onClick={() => setSize(sizeKey)}
                    className="h-auto py-4 flex flex-col gap-2"
                  >
                    <span className="text-3xl">{sizeInfo[sizeKey].emoji}</span>
                    <span className="font-bold">{sizeInfo[sizeKey].label}</span>
                    <span className="text-sm">+{sizeInfo[sizeKey].price} ₽</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🥖 Тип теста
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(doughInfo) as DoughType[]).map(doughKey => (
                  <Button
                    key={doughKey}
                    variant={dough === doughKey ? 'default' : 'outline'}
                    onClick={() => setDough(doughKey)}
                    className="h-auto py-4 flex flex-col gap-2"
                  >
                    <span className="text-3xl">{doughInfo[doughKey].emoji}</span>
                    <span className="font-bold">{doughInfo[doughKey].label}</span>
                    {doughInfo[doughKey].price > 0 && (
                      <span className="text-sm">+{doughInfo[doughKey].price} ₽</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🍅 Соус (выбери один)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {groupedIngredients.sauce.map(ingredient => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.has(ingredient.id) ? 'default' : 'outline'}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="h-auto py-3 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{ingredient.emoji}</span>
                    <span className="text-sm font-semibold">{ingredient.name}</span>
                    {ingredient.price > 0 && (
                      <span className="text-xs">+{ingredient.price} ₽</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🧀 Сыры
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {groupedIngredients.cheese.map(ingredient => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.has(ingredient.id) ? 'default' : 'outline'}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="h-auto py-3 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{ingredient.emoji}</span>
                    <span className="text-xs font-semibold">{ingredient.name}</span>
                    <span className="text-xs">+{ingredient.price} ₽</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🥩 Мясо
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {groupedIngredients.meat.map(ingredient => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.has(ingredient.id) ? 'default' : 'outline'}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="h-auto py-3 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{ingredient.emoji}</span>
                    <span className="text-sm font-semibold">{ingredient.name}</span>
                    <span className="text-xs">+{ingredient.price} ₽</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🥗 Овощи и фрукты
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {groupedIngredients.vegetable.map(ingredient => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.has(ingredient.id) ? 'default' : 'outline'}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="h-auto py-3 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{ingredient.emoji}</span>
                    <span className="text-xs font-semibold">{ingredient.name}</span>
                    <span className="text-xs">+{ingredient.price} ₽</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🌿 Дополнительно
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {groupedIngredients.other.map(ingredient => (
                  <Button
                    key={ingredient.id}
                    variant={selectedIngredients.has(ingredient.id) ? 'default' : 'outline'}
                    onClick={() => toggleIngredient(ingredient.id)}
                    className="h-auto py-3 flex flex-col gap-1"
                  >
                    <span className="text-2xl">{ingredient.emoji}</span>
                    <span className="text-xs font-semibold">{ingredient.name}</span>
                    <span className="text-xs">+{ingredient.price} ₽</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span>📝</span> Состав вашей пиццы:
              </h4>
              <div className="flex flex-wrap gap-2">
                {getSelectedIngredients().map(ingredient => (
                  <Badge key={ingredient.id} variant="secondary" className="text-sm">
                    {ingredient.emoji} {ingredient.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </ScrollArea>

        <CardFooter className="border-t bg-card p-6">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Итоговая стоимость:</p>
                <p className="text-4xl font-black text-primary">{calculateTotal()} ₽</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Ингредиентов:</p>
                <p className="text-2xl font-bold">{selectedIngredients.size}</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="w-full text-lg font-bold"
              disabled={selectedIngredients.size === 0}
            >
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Добавить в корзину
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
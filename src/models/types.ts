export type LocationType = 'college' | 'workplace' | 'airport' | 'city' | 'urban';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'beverage';

export interface Restaurant {
  id?: number;
  name: string;
  location_type: LocationType;
  base_weekday_discount: number;
  base_weekend_discount: number;
  base_preparation_time: number;
  peak_hour_threshold: number;
}

export interface MenuItem {
  id?: number;
  restaurant_id: number;
  name: string;
  category: MenuCategory;
  base_price: number;
  preparation_complexity: number;
}

export interface Order {
  id?: number;
  restaurant_id: number;
  customer_name: string;
  customer_phone: string;
  order_status: OrderStatus;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  total_amount: number;
  estimated_preparation_time: number;
  order_date: string;
  order_time: string;
}

export interface OrderItem {
  menu_item_id: number;
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

export interface CreateOrderRequest {
  restaurant_id: number;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
}
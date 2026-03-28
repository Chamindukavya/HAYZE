export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  images: string[];
  videos?: string[];
  colors: string[];
  colorImages?: { color: string; url: string }[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

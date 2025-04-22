export type Product = {
  _id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
  discount: boolean;
  discountPct: number;
  isHidden: boolean;
  _createdBy: string;
}

export type newProduct = Omit<Product, '_id'> & {
  _createdBy?: string;
}

// export type newProduct = Omit<Product, "_id"> & Partial<Pick<Product, '_createdBy'>>

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  registerDate: string;
}

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export type Order = {
  _id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  _createdBy: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  archived?: boolean;
};
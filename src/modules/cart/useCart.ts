import { ref } from "vue";
import type { CartItem, Order } from "../../interfaces/interfaces";

const cart = ref<CartItem[]>(
  JSON.parse(localStorage.getItem("cart") || "[]")
);
const code = ref<string>("");

export const useCart = () => {

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const existingItem = cart.value.find((item) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log("Updated existing item quantity", existingItem);
    } else {
      cart.value.push({ ...product, quantity: 1 });
      console.log("Added new item to cart:", cart.value);
    }

    localStorage.setItem("cart", JSON.stringify(cart.value));
    console.log("Added to cart:", cart.value);
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.value.find((item) => item._id === productId);
    if (existingItem) {
      cart.value = cart.value.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find((item) => item._id === productId);
    localStorage.setItem("cart", JSON.stringify(cart.value));
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      }
    }
    console.log(`Updated quantity: ${productId}, qty ${quantity}`);
  };

  const cartTotal = (): number => {
    return Number(
      cart.value
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    );
  };

  const cartTotalIndividualProduct = (productId: string): number => {
    const item = cart.value.find((item) => item._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  const salesTax = (): number => {
    const taxRates = 0.25;
    return Math.round(cartTotal() * taxRates * 100) / 100;
  };

  const coupinCodeDiscount = (codes: string) => {
    const couponCodeAccepted = codes === "DISCOUNT";
    return couponCodeAccepted ? 0.9 : 1;
  };

  const grandTotal = (): number => {
    return Number(
      ((cartTotal() + salesTax()) * coupinCodeDiscount(code.value)).toFixed(2)
    );
  };

  const placeOrder = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];

    const newOrder: Order = {
      orderId: Date.now().toString(),
      items: [...cart.value],
      total: grandTotal(),
      createdAt: new Date().toISOString(),
      _createdBy: localStorage.getItem('userIDToken') || 'unknown',
      status: 'Processing',
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart.value = [];
    localStorage.setItem('cart', JSON.stringify(cart.value));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const stored = localStorage.getItem('orders');
    if (!stored) return;

    const orders = JSON.parse(stored) as Order[];
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  };

  const archiveOrder = (orderId: string) => {
    const stored = localStorage.getItem('orders');
    if (!stored) return;

    const orders = JSON.parse(stored) as Order[];
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, archived: true } : order
    );

    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartTotalIndividualProduct,
    salesTax,
    code,
    grandTotal,
    placeOrder,
    updateOrderStatus,
    archiveOrder
  };
};

import { ref } from "vue";
import type { Product } from "../interfaces/interfaces";


export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(
        "http://localhost:4000/api/products"
      );
      if (!response.ok) {
        throw new Error("No data available");
      }
      const data: Product[] = await response.json();
      products.value = data;
      console.log("Products fetched:", products.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };
  const addProduct = async (/*product: Product*/): Promise<void> => {
    try {
      const token = localStorage.getItem("lsToken");
      const userId = localStorage.getItem("userIDToken");
      if (!token) {
        throw new Error("No token available");
      }
      if (!userId) {
        throw new Error("No user ID available");
      }
      const response = await fetch("http://localhost:4000/api/products", {
        method:'POST',
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          name: 'New Product from Frontend',
          description: 'New Product Description',
          imageURL: 'https://picsum.photos/500/500',
          price: 2,
          stock: 10,
          discount: true,
          discountPct: 10,
          isHidden: false,
          _createdBy: userId,
        })
      })
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }

      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("Product added:", newProduct);
      await fetchProducts();
    }
    catch (err) {
      error.value = (err as Error).message;
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("lsToken");

      if (!token) {
        throw new Error("No token available");
      }

      console.log("id test", id);
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("No data available");
      }
      products.value = products.value.filter(product => product._id !== id);
      console.log("Product deleted:", id);

    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  return {
    error,
    loading,
    products,
    fetchProducts,
    addProduct,
    deleteProduct,
  };
};

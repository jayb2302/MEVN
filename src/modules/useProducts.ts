import { ref } from "vue";
import type { newProduct, Product } from "../interfaces/interfaces";

export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:4000/api/products");
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

  const getTokenAndUserId = (): { token: string; userId: string } => {
    const token = localStorage.getItem("lsToken");
    const userId = localStorage.getItem("userIDToken");
    if (!token) {
      throw new Error("No token available");
    }
    if (!userId) {
      throw new Error("No user ID available");
    }
    return { token, userId };
  };

  const validateProduct = (product: newProduct): void => {
    if (!product.name) {
      throw new Error("Please provide a product name");
    }
  };

  const setDefaultValues = (product: newProduct, userId: string) => {
    return {
      name: product.name,
      description:
        product.description || "New Product Description default value",
      imageURL: product.imageURL || "https://picsum.photos/500/500",
      price: product.price || 2,
      stock: product.stock || 10,
      discount: product.discount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId,
    };
  };

  const addProduct = async (product: newProduct): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateProduct(product);
      const productWithDefaults = setDefaultValues(product, userId);

      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(productWithDefaults),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }

      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("Product added:", newProduct);
      await fetchProducts();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const deleteProductFromServer = async (
    id: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    if (!response.ok) {
      console.log("product not deleted");
      throw new Error("No data available");
    }
  };

  const removeProductFromState = (id: string): void => {
    products.value = products.value.filter((product) => product._id !== id);
    console.log("Product deleted:", id);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteProductFromServer(id, token);
      removeProductFromState(id);
      console.log("id test", id);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const updateProductOnServer = async (id: string, updatedProduct: Partial<Product>, token: string): Promise<Product> => {
    const response = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updatedProduct),
    });
    
    if (!response.ok) {
      throw new Error("No data available");
    }
    
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    }
    catch{
      return { message: responseText } as unknown as Product;
    }
  }

  const updateProductInState = (id: string, updatedProduct: Partial<Product>): void => {
    const index = products.value.findIndex(product => product._id === id);

    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct }
      
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      const updatedProductResponse = await updateProductOnServer(id, updatedProduct, token);
      updateProductInState(id, updatedProductResponse);
      await fetchProducts();
    }
    catch (err) {
      error.value = (err as Error).message;
    }
  }

  // JSdoc this function 
  /**
   * Fetches a product by its ID.
   * @param {string} id - The ID of the product to fetch.
   * @returns {Promise<Product[] | null>}
   * @throws {Error} - Throws an error if the fetch fails or the response is not ok.
   **/
  const fetchProductById = async(id: string): Promise<Product[] | null> => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`);
      if (!response.ok) {
        throw new Error("No data available");
      }
      const data: Product[] = await response.json();
      return data;
    }
    catch (err) {
      console.log("error", err);
      return null;
    }
  }

  return {
    error,
    loading,
    products,
    fetchProducts,
    fetchProductById,
    addProduct,
    deleteProduct,
    updateProduct,
    getTokenAndUserId,

  };
};

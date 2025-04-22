<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProducts } from "../modules/useProducts";
import { useCart } from "../modules/cart/useCart";
import type { Product } from "../interfaces/interfaces";
import Button from "primevue/button";
import Card from "primevue/card";

const route = useRoute();
const product = ref<Product | null>(null);

const { addToCart } = useCart();
const { fetchProductById } = useProducts();

onMounted(async () => {
  const productId = route.params.id as string;
  const fetchedProduct = await fetchProductById(productId);
  console.log("fetched product:", fetchedProduct);
  product.value = Array.isArray(fetchedProduct)
    ? fetchedProduct[0]
    : fetchedProduct;
  console.log("product:", product.value);
});
</script>
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <Card class="max-w-md w-full shadow-md rounded-lg">
      <template #header>
        <img
          :src="product?.imageURL"
          alt="Product Image"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </template>

      <template #title>
        <h3 class="text-2xl font-bold text-gray-800">{{ product?.name }}</h3>
      </template>

      <template #subtitle>
        <span class="text-blue-600 font-bold text-lg">
          ${{ product?.price.toFixed(2) }}
        </span>
      </template>

      <template #content>
        <p class="text-gray-700 text-sm mb-2">{{ product?.description }}</p>
        <p class="text-green-500">
          <span class="text-gray-500 font-bold">Stock:</span>
          {{ product?.stock }}
        </p>
      </template>

      <template #footer>
        <div class="flex justify-between gap-2 mt-2">
        <Button
          label="Back to Products"
          @click="$router.push('/products')"
          class="w-1/2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        />
        <Button
          label="Buy Now"
          icon="pi pi-shopping-cart"
          @click="product && addToCart(product)"
          class="w-1/2 text-white border-none hover:bg-green-600"
        />
        </div>
      </template>
    </Card>
  </div>
</template>

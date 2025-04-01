<template>
  <div class="">
    <h2 class="text-2xl font-bold mb-4">Products</h2>
    <div v-if="loading" class="text-center">Loading...</div>
    <!-- Loading wait screen with v-if -->

    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <!-- Error message with v-else-if -->

    <div v-else class="flex flex-wrap -mx-2">
      <!-- Loop through the products -->
      <div
        v-for="product in products"
        :key="product._id"
        class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      >
        <!-- Product card with v-for -->
        <Card class="h-full">
          <template #header>
            <img
              :src="product.imageURL"
              alt="Product Image"
              class="w-full h-48 object-cover rounded-t-lg"
            />
          </template>

          <template #title>
            <h3 class="text-lg font-semibold text-gray-800">
              {{ product.name }}
            </h3>
          </template>

          <template #subtitle>
            <span class="text-blue-600 font-bold"
              >${{ product.price.toFixed(2) }}</span
            >
          </template>

          <template #content>
            <p class="text-gray-600 text-sm">{{ product.description }}</p>
          </template>

          <template #footer>
            <div class="flex justify-between gap-2 mt-2">
              <Button
                label="Details"
                severity="secondary"
                outlined
                class="w-1/2"
              />
              <Button
                label="Add to Cart"
                @click="addToCart(product)"
                class="w-1/2 bg-green-500 text-white border-none hover:bg-green-600"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProducts } from "../modules/useProducts";
import { useCart } from "../modules/cart/useCart";
import Card from 'primevue/card';
import Button from 'primevue/button';


const { addToCart } = useCart();
const { loading, error, products, fetchProducts } = useProducts();

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped></style>

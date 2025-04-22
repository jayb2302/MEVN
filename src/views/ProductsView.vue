<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">Products</h2>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else>
      <DataView :value="products" :layout="layout" dataKey="_id">
        <template #header>
          <div class="flex justify-end mb-4">
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </SelectButton>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2"
            >
              <Card class="h-full">
                <template #header>
                  <img
                    :src="item.imageURL"
                    alt="Product Image"
                    class="w-full h-48 object-cover rounded-t-lg"
                  />
                </template>

                <template #title>
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ item.name }}
                  </h3>
                </template>

                <template #subtitle>
                  <span class="text-blue-600 font-bold"
                    >${{ item.price.toFixed(2) }}</span
                  >
                </template>

                <template #content>
                  <p class="text-gray-600 text-sm">{{ item.description }}</p>
                </template>

                <template #footer>
                  <div class="flex justify-between gap-2 mt-2">
                    <Button
                      label="Details"
                      severity="success"
                      @click="$router.push(`/products/${item._id}`)"
                      class="w-1/2 border-none hover:bg-blue-600"
                    />
                    <Button
                      label="Buy Now"
                      icon="pi pi-shopping-cart"
                      @click="addToCart(item)"
                      class="w-1/2 bg-green-500 text-white border-none hover:bg-green-600"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>

        <template #list="slotProps">
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, index) in slotProps.items"
              :key="index"
              class="p-4 border border-gray-200 rounded flex flex-col sm:flex-row gap-4"
            >
              <img
                :src="item.imageURL"
                alt="Product Image"
                class="w-full sm:w-40 h-40 object-cover rounded"
              />
              <div class="flex flex-col justify-between flex-1">
                <div>
                  <h3 class="text-xl font-bold">{{ item.name }}</h3>
                  <p class="text-gray-600">{{ item.description }}</p>
                </div>
                <div class="flex justify-between items-center mt-4">
                  <span class="text-lg text-blue-600 font-bold">${{ item.price.toFixed(2) }}</span>
                  <div class="flex gap-2">
                    <Button
                      label="Details"
                      severity="success"
                      @click="$router.push(`/products/${item._id}`)"
                      class="border-none hover:bg-blue-600"
                    />
                    <Button
                      label="Buy Now"
                      icon="pi pi-shopping-cart"
                      @click="addToCart(item)"
                      class="bg-green-500 text-white border-none hover:bg-green-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProducts } from "../modules/useProducts";
import { useCart } from "../modules/cart/useCart";
import Card from "primevue/card";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import DataView from "primevue/dataview";

const layout = ref("grid");
const options = ref(["list", "grid"]);

const { addToCart } = useCart();
const { loading, error, products, fetchProducts } = useProducts();

onMounted(() => {
  fetchProducts();
});
</script>

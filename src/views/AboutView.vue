<template>
  <div class="about w-full p-4">
    <h1>This is an about page</h1>
    <p>{{ message }}</p>

    <p data-testid="count">Count: {{ count }}</p>
    <Button @click="increment" icon="pi pi-plus" severity="success" data-testid="increment" />
    <Button @click="decrement" icon="pi pi-minus" severity="danger" data-testid="decrement" />
    <Button @click="reset" icon="pi pi-refresh" data-testid="reset" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref<string>("Check out the counting feature!");
const count = ref<number>(0);
const increment = () => {
  count.value++;
};
const decrement = () => {
  count.value--;
};
const reset = () => {
  count.value = 0;
};
</script>

<style></style>

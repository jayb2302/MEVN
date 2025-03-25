<template class="w-screen">
  <header class="text-white py-4">
    <div class="wrapper">
      <nav class="">
        <RouterLink to="/" class="mr-4">Home</RouterLink>
        <RouterLink to="/about" class="mr-4">About</RouterLink>
        <RouterLink to="/products" class="mr-4">Products</RouterLink>
        <RouterLink to="/auth" class="mr-4">Auth</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/admin" class="mr-4"
          >Admin</RouterLink
        >
        <!-- RouterLink to products, Auth, Admin & and logout button -->

        <button
          @click="logout"
          v-if="isLoggedIn"
          class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Logout
        </button>

        <!-- toggle cart button -->
        <button @click="toggleCart" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Cart
        </button>

        <!-- Routerlink to orders -->
      </nav>
    </div>
  </header>

  <RouterView />

  <!-- CartBasket component -->
  <CartBasket v-model:isVisible="isCartVisible" />

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useUsers } from "./modules/auth/useUsers";
import { state } from "./modules/globalStates/state";
import CartBasket from "./components/cart/CartBasketView.vue";

const isCartVisible = ref(false);

const toggleCart = () => {
  isCartVisible.value = !isCartVisible.value;
};

const { logout } = useUsers();

const isLoggedIn = computed(() => state.isLoggedIn);
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>

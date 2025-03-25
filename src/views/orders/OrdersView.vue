<template>
  <div class="p-4 flex">
    <div class="w-2/3">
      <h2 class="text-2xl font-bold mb-4">Order History</h2>
      <button
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="showArchived = !showArchived"
      >
        {{ showArchived ? 'Hide' : '' }} Archived Orders
      </button>
      <p v-if="filteredOrders.length === 0" class="text-center">
        No orders found
      </p>
      <!-- If there are no orders -->
      <div v-for="order in filteredOrders" :key="order.orderId">
        <!-- If there are orders -->
        <div class="mb-8 border-b pb-4">
          <!-- Loop through the orders -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="font-semibold">Order ID: {{ order.orderId }}</p>
              <!-- Order ID -->
              <p class="text-gray-500 capitalize">
                User: {{ getUserName(order._createdBy) }}
              </p>
              <p class="text-gray-500">
                Order Date: {{ new Date(order.createdAt).toLocaleString() }}
              </p>
              <!-- Order Date -->
            </div>
            <div>
              <p class="font-semibold">
                Order Total: ${{ order.total.toFixed(2) }}
              </p>
              <!-- Order Total with .toFixed() -->
              <select
                class="border p-1 text-[#181818] rounded"
                v-model="order.status"
                @change="handleStatusChange(order)"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                class="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600"
                @click="handleArchiveOrder(order.orderId)"
              >
                Archive
              </button>
              <!-- Archive button -->
            </div>
          </div>
          <div>
            <div
              v-for="item in order.items"
              :key="item._id"
              class="flex items-center mb-4"
            >
              <!-- Loop through the order items -->
              <!-- First Column: Image -->
              <div class="w-1/6">
                <img
                  :src="item.imageURL"
                  alt="Product Image"
                  class="w-full h-24 object-cover rounded-lg"
                />
                <!-- Product image -->
              </div>
              <!-- Second Column: Title and Description -->
              <div class="w-2/6 px-4">
                <p class="font-semibold">{{ item.name }}</p>
                <!-- Product name -->
              </div>
              <!-- Third Column: Quantity -->
              <div class="w-1/6 text-center">
                <p>{{ item.quantity }}</p>
                <!-- Quantity with v-html -->
              </div>
              <!-- Fourth Column: Price -->
              <div class="w-1/6 text-right">
                <p class="font-semibold">${{ item.price.toFixed(2) }}</p>
                <!-- Price with .toFixed() -->
              </div>
              <!-- Fifth Column: Total Price -->
              <div class="w-1/6 text-right">
                <p class="font-semibold">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </p>
                <!-- Total price with .toFixed() -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 pl-4">
      <h2 class="text-2xl font-bold mb-4">Revenue</h2>
      <p class="text-xl font-semibold">Total Revenue: ${{ totalRevenue }}</p>
      <!-- Total Revenue with .toFixed() -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchUserById } from "@/api/user";
import type { Order } from "@/interfaces/interfaces";
import { useCart } from "@/modules/cart/useCart";

const orders = ref<Order[]>([]);
const userMap = ref<Record<string, string>>({});
const { updateOrderStatus, archiveOrder } = useCart();
const showArchived = ref(false);

const loadOrders = () => {
  const stored = localStorage.getItem("orders");
  if (stored) {
    orders.value = JSON.parse(stored);
  }
};

const loadUserNames = async () => {
  const userIds = [...new Set(orders.value.map(order => order._createdBy))];

  for (const userId of userIds) {
    if (!userId) continue;

    try {
      const user = await fetchUserById(userId);
      userMap.value[userId] = user.name;
    } catch {
      userMap.value[userId] = "Unknown";
    }
  }
};

const getUserName = (userId: string) => {
  return userMap.value[userId] || "Loading...";
};

const handleStatusChange = (order: Order) => {
  updateOrderStatus(order.orderId, order.status);
};

const handleArchiveOrder = (orderId: string) => {
  archiveOrder(orderId);
  const updated = localStorage.getItem("orders");
  if (updated) {
    orders.value = JSON.parse(updated);
  }
};

const totalRevenue = computed(() =>
  orders.value.reduce((sum, order) => sum + order.total, 0).toFixed(2)
);

const filteredOrders = computed(() =>
  orders.value.filter(order =>
    showArchived.value ? order.archived : !order.archived
  )
);

onMounted(async () => {
  loadOrders();
  await loadUserNames();
});
</script>

<style scoped>
/* Add your styles here */
</style>

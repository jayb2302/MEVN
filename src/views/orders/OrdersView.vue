<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchUserById } from "@/api/user";
import type { Order } from "@/interfaces/interfaces";
import { useCart } from "@/modules/cart/useCart";
import Button from "primevue/button";
import Select from "primevue/select";

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

async function loadUserNames() {
  const userIds = new Set(orders.value.map((o) => o._createdBy));

  for (const id of userIds) {
    if (!id) continue;

    const name = await fetchUserById(id)
      .then((user) => user.name)
      .catch(() => "Unknown");

    userMap.value[id] = name;
  }
}

const getUserName = (userId: string) => {
  return userMap.value[userId] || "Loading...";
};

const statusOptions = [
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
];

const handleStatusChange = (order: Order) => {
  updateOrderStatus(order._id, order.status);
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
  orders.value.filter((order) =>
    showArchived.value ? order.archived : !order.archived
  )
);

onMounted(async () => {
  loadOrders();
  await loadUserNames();
});
</script>

<template>
  <div class="p-4 flex">
    <div class="w-2/3">
      <h2 class="text-2xl font-bold mb-4">Order History</h2>
      <Button
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="showArchived = !showArchived"
      >
        {{ showArchived ? "Hide" : "" }} Archived Orders
      </Button>
      <p v-if="filteredOrders.length === 0" class="text-center">
        No orders found
      </p>
      <!-- If there are no orders -->
      <div v-for="order in filteredOrders" :key="order._id">
        <!-- If there are orders -->
        <div class="mb-8 border-b pb-4">
          <!-- Loop through the orders -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="font-semibold">Order ID: {{ order._id }}</p>
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
              <Select
                v-model="order.status"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Update status"
                class="w-full md:w-40"
                @change="handleStatusChange(order)"
              />

              <Button
                label="Archive"
                severity="danger"
                class="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600"
                @click="handleArchiveOrder(order._id)"
              />
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

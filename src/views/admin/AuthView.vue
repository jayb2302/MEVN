<template>
  <div class="flex h-max">
    <!-- Left side with background image -->
    <div
      class="w-1/2 bg-cover bg-center"
      style="
        background-image: url('https://picsum.photos/800/1200');
        background-color: var(--vt-c-black, #181818);
      "
    ></div>

    <!-- Right side with login and register forms -->
    <div class="w-1/2 bg-slate-300 flex-grow text-gray-300 flex flex-col p-8">
      <!-- Top part: Login and Logout -->
      <div class="space-y-4">
        <p class="text-2xl mb-4">Login / Logout</p>
        <FloatLabel variant="on">
          <InputText id="email_input" v-model="email" fluid />
          <label for="email_input">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <Password
            v-model="password"
            toggleMask
            fluid
            id="password_input"
            :invalid="!password"
          />
          <label for="password_input">Password</label>
        </FloatLabel>
        <!-- v-model for password -->
        <Button
          class="bg-[#1E40AF] text-white p-2 rounded hover:bg-[#1E3A8A] w-full mt-4"
          @click="fetchToken(email, password)"
          >Login</Button
        >
        <!-- Login button -->
        <Button
          icon="pi pi-sign-out"
          class="bg-[#4B5563] text-white p-2 rounded hover:bg-[#374151] w-full mt-2"
          @click="logout()"
        />
        <!-- Logout button -->
      </div>

      <!-- Lower part: Register -->
      <div class="register-block">
        <Button
          class="text-2xl mt-24 mb-4 flex-nowrap cursor-pointer"
          @click="toggleRegisterDialog"
        >
          Click to register
        </Button>
        <!-- Register button -->
        <dialog ref="registerDialog" class="bg-slate-100">
          <form class="flex flex-col gap-3">
            <FloatLabel variant="on">
              <InputText id="re_name_input" v-model="name" fluid/>
              <label for="re_name_input">Name</label>
            </FloatLabel>
            <!-- v-model for name -->
            <FloatLabel variant="on">
              <InputText id="re_email_input" v-model="email" class="w-full"/>
              <label for="re_email_input">Email</label>
            </FloatLabel>
            <!-- v-model for email -->
            <FloatLabel variant="on">
              <Password
                v-model="password"
                toggleMask
                inputClass=" border-b border-gray-500 bg-transparent text-gray-300 focus:outline-none flex-grow w-full"
                :invalid="!password"
                id="re_password_input"
              />
              <label for="re_password_input">Password</label>
            </FloatLabel>
            <!-- v-model for password -->
            <Button
              label="Register"
              class="bg-[#10B981] text-white p-2 rounded hover:bg-[#059669] w-full mt-4"
              @click.prevent="registerUser(name, email, password)"
            />

            <!-- Register button -->
          </form>
          <Button
            label="Close"
            severity="danger"
            class="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-full mt-2"
            @click="toggleRegisterDialog"
          />
          <!-- Close button -->
        </dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUsers } from "@/modules/auth/useUsers";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
const { fetchToken, registerUser, logout, name, email, password } = useUsers();
const registerDialog = ref<HTMLDialogElement | null>(null);

const toggleRegisterDialog = () => {
  if (registerDialog.value) {
    if (registerDialog.value.open) {
      registerDialog.value.close();
    } else {
      registerDialog.value.show();
    }
  }
};
</script>

<style scoped>
.register-block {
  display: flex;
  position: relative;
}

dialog {

  border-left: 1px solid var(--vt-c-gray-500, #9ca3af);
  padding: 1rem;
  position: absolute;
  top: 8rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
dialog[open] {
  opacity: 1;
  pointer-events: inherit;
}
dialog::backdrop {
  background-color: rgba(0, 0, 255, 0.2);
}
</style>

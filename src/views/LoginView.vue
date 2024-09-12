<script setup>
import { useForm, useField } from "vee-validate";
import { loginSchema as validationSchema } from "@/validation/loginSchema";
import { useAuthStore } from "@/stores/auth";

const { handleSubmit } = useForm({ validationSchema });

const authStore = useAuthStore();

const email = useField("email");
const password = useField("password");

const submit = handleSubmit((values) => {
  authStore.login(values);
});
</script>

<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title class="text-h5">Login</v-card-title>
    <v-card-text>
      <v-form>
        <v-alert
          class="mb-5"
          title="Error"
          type="error"
          variant="tonal"
          v-if="authStore.hasError"
          :text="authStore.errorMessage"
        ></v-alert>
        <v-text-field
          type="email"
          label="Email"
          class="mb-2"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
        />
        <v-text-field
          type="password"
          label="Password"
          class="mb-2"
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
        />
        <v-btn block type="submit" color="teal" @click="submit">Login</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style lang="css" scoped></style>

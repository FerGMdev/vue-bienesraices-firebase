<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div>
    <v-card elevation="3" max-width="1200" colo class="mx-auto">
      <v-layout>
        <v-app-bar color="blue-grey darken-3" dark>
          <template v-slot:prepend>
            <v-btn :to="{ name: 'home' }" text>Bienes Raices</v-btn>
          </template>
          <template v-slot:append>
            <div v-if="authStore.isLoggedIn">
              <v-btn :to="{ name: 'admin-properties' }" text>Admin</v-btn>
              <v-btn @click="authStore.logout" text>Logout</v-btn>
            </div>
            <div v-else>
              <v-btn :to="{ name: 'home' }" text>Home</v-btn>
              <v-btn :to="{ name: 'login' }" text>Login</v-btn>
            </div>
          </template>
        </v-app-bar>
        <v-main>
          <v-container class="grey lighten-4">
            <RouterView />
            <v-icon icon="md:info"></v-icon>
          </v-container>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<style lang="css" scoped></style>

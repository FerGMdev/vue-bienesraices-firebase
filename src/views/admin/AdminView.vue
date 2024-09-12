<script setup>
import useProperties from "@/composables/useProperties";
import { propertyPrice } from "@/helpers";

const { propertiesCollection, deleteItem } = useProperties();
console.log(propertiesCollection);
</script>

<template>
  <h1 class="text-2xl font-bold my-5">Admin</h1>
  <v-btn color="teal" variant="flat" :to="{ name: 'admin-new' }">
    Add Property
  </v-btn>
  <!-- Show the properties in card format with image en formato de lista -->
  <v-list class="mt-5">
    <v-list-item v-for="property in propertiesCollection" :key="property.id">
      <template v-slot:prepend>
        <v-list-item-media :start="true">
          <img :src="property.image" height="100" />
        </v-list-item-media>
      </template>
      <v-list-item-title>{{ property.title }}</v-list-item-title>
      <v-list-item-subtitle>{{
        propertyPrice(property.price)
      }}</v-list-item-subtitle>

      <template v-slot:append>
        <v-btn
          color="teal"
          variant="flat"
          class="mr-2"
          :to="{ name: 'admin-edit', params: { id: property.id } }"
        >
          Edit
        </v-btn>
        <v-btn
          color="red"
          variant="flat"
          @click="deleteItem(property.id, property.image)"
        >
          Delete
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

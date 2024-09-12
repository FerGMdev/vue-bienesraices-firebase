<script setup>
import useProperties from "@/composables/useProperties";
import PropertyComponent from "@/components/PropertyComponent.vue";
import { propertyPrice } from "@/helpers";
const { pool, poolFilter } = useProperties();
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold mb-6">Our Properties</h1>

  <v-container fluid>
    <v-row>
      <!-- Sidebar with filters -->
      <v-col cols="12" md="3">
        <v-card outlined>
          <v-card-title class="text-h5">Filter by</v-card-title>
          <v-card-text>
            <v-checkbox
              v-model="pool"
              label="Has Pool"
              color="primary"
              hide-details
              class="mb-4"
            ></v-checkbox>
            <!-- Add more filters here -->
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Main content area -->
      <v-col cols="12" md="9">
        <v-card flat>
          <v-row>
            <PropertyComponent
              v-for="property in poolFilter"
              :key="property.id"
              :property="property"
              :price="propertyPrice"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
/* Add any additional styles here */
</style>

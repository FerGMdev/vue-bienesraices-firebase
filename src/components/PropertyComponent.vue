<script setup>
// dDefinimos las propiedades que recibimos del componente padre
defineProps({
  property: {
    type: Object,
    required: true,
  },
  price: {
    type: Function,
  },
});
</script>

<template>
  <v-col cols="12" md="4">
    <v-card hover>
      <v-img :src="property.image" height="200" cover />
      <v-card-title>
        {{ property.title }}
      </v-card-title>
      <v-card-text class="text-h6 font-weight-bold">
        {{ price(property.price) }}
      </v-card-text>
      <v-card-text class="text-truncate">
        {{ property.description }}
      </v-card-text>
      <template v-slot:actions>
        <v-btn
          block
          color="teal"
          variant="flat"
          :to="{ name: 'property', params: { id: property.id } }"
        >
          More info
        </v-btn>
      </template>
    </v-card>
  </v-col>
</template>

<style lang="css" scoped></style>

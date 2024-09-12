<script setup>
/**
 * ===================== NOTAS =====================
 * -> Cada vez que se vaya a una ruta que contenga :id
 *    se debe de crear una variable para obtener el id
 *    y así poder hacer la consulta a la base de datos
 * -> useRoute() es un hook que nos permite obtener los
 *    parámetros de la ruta
 * -> useFirestore() es un hook que nos permite obtener
 *    la instancia de Firestore, es decir, las credenciales
 *    para acceder a la base de datos
 * -> collection() es un método que nos permite obtener
 *    la colección de propiedades
 * -> doc() es un método que nos permite obtener el documento
 */

import { watch } from "vue";
import { useRoute } from "vue-router";
import { useFirestore, useDocument } from "vuefire";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import useLocationMap from "@/composables/useLocationMap";
import { doc } from "firebase/firestore";
import { propertyPrice } from "@/helpers";

const { center, zoom } = useLocationMap();

const route = useRoute();
const db = useFirestore();
const docRef = doc(db, "properties", route.params.id);
const property = useDocument(docRef);

// Watcher para actualizar la ubicación del pin en el mapa en tiempo real
watch(property, (property) => {
  center.value = property.location;
});
</script>

<template>
  <v-card>
    <v-card-title class="text-h4 font-weight-bold text-center">{{
      property?.title
    }}</v-card-title>
    <v-img :src="property?.image" height="550" cover />
    <div
      class="d-flex flex-md-row flex-column justify-space-between bg-grey-lighten-3 align-center"
    >
      <v-card-text class="font-weight-bold">
        Price: {{ propertyPrice(property?.price) }}
      </v-card-text>
      <v-card-text class="font-weight-bold">
        Bathrooms: {{ property?.wc }}
      </v-card-text>
      <v-card-text class="font-weight-bold">
        Garages: {{ property?.garages }}
      </v-card-text>
      <v-card-text class="font-weight-bold">
        Bedrooms: {{ property?.bedrooms }}
      </v-card-text>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <div class="text-pre-wrap">
          <v-card-text class="text-h6 font-weight-bold pt-10"
            >Description</v-card-text
          >
          <v-card-text>{{ property?.description }}</v-card-text>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="py-10" style="height: 600px">
          <LMap
            ref="map"
            v-model:zoom="zoom"
            :center="center"
            :use-global-leaflet="false"
          >
            <LMarker :lat-lng="center">
              <LPopup>
                <h2>{{ property?.title }}</h2>
              </LPopup>
            </LMarker>
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></LTileLayer>
          </LMap>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="css" scoped>
/* Pre-wrap es para que el texto se muestre como en el editor de texto */
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>

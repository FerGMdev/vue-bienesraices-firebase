<script setup>
/**
 * ======================== NOTAS DE IMPORTACIONES ========================
 * -> watch es una funcion que se ejecuta cuando cambia el valor de una variable
 * -> useRoute es para obtener el id de la propiedad
 * -> useDocument es para obtener la propiedad. Toma 3 parametros: la base de datos, la coleccion y el id de la propiedad
 * -> doc es para obtener el documento de la base de datos y updateDoc es para actualizar el documento de la base de datos
 * -> useField es para manejar los campos del formulario y useForm es para manejar el formulario
 * -> leaflet es para mostrar el mapa
 * -> LMap es para mostrar el mapa, LTileLayer es para mostrar el mapa y LMarker es para mostrar el mapa
 * -> useImage es para subir la imagen
 * -> useLocationMap es para mostrar el mapa
 * -> validationSchema es para validar los campos del formulario
 */

import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDocument, useFirestore } from "vuefire";
import { doc, updateDoc } from "firebase/firestore";
import { useField, useForm } from "vee-validate";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import useImage from "@/composables/useImage";
import useLocationMap from "@/composables/useLocationMap";
import { validationSchema } from "@/validation/propertySchema";

/**
 * ======================== NOTAS ========================
 * -> watch se usa en este caso para actualizar los campos del formulario con los valores de la propiedad (linea 44)
 * -> items es para mostrar los valores en el select de los campos del formulario (linea 45)
 * -> useField es una funcion que devuelve un objeto que contiene el campo del formulario (linea 48)
 * -> useRoute es para obtener el id de la propiedad (linea 50)
 * -> useRouter es para navegar entre las rutas (linea 51)
 * -> useFirestore es para obtener la base de datos (linea 52)
 * -> useDocument es para obtener la propiedad. Toma 3 parametros: la base de datos, la coleccion y el id de la propiedad (linea 53)
 * -> doc es una funcion que devuelve un objeto que contiene el documento de la base de datos (linea 59)
 * -> updateDoc es una funcion que actualiza el documento de la base de datos (linea 60)
 */

const items = [1, 2, 3, 4, 5];

// Composables
const { url, uploadImage, imageUrl } = useImage();
const { zoom, center, pinLocation } = useLocationMap();

// Formulario
const { handleSubmit } = useForm({ validationSchema });

// Campos del formulario
const title = useField("title");
const price = useField("price");
const bedrooms = useField("bedrooms");
const bathrooms = useField("wc");
const garages = useField("garages");
const description = useField("description");
const hasPool = useField("hasPool");
const image = useField("image");

// Variables de la ruta y el router
const route = useRoute();
const router = useRouter();

// Base de datos
const db = useFirestore();
const docRef = doc(db, "properties", route.params.id);
const property = useDocument(docRef);

watch(property, (property) => {
  title.value.value = property.title;
  price.value.value = property.price;
  bedrooms.value.value = property.bedrooms;
  bathrooms.value.value = property.wc;
  garages.value.value = property.garages;
  description.value.value = property.description;
  hasPool.value.value = property.hasPool;
  image.value.value = property.image;
  center.value = property.location;
});

const submit = handleSubmit(async (values) => {
  console.log(values);
  const { image, ...property } = values;
  console.log(image);
  // --> tambien funciona poner if(imageUrl.value)
  if (typeof image === "object") {
    console.log("si");
    const data = {
      ...property,
      image: url.value,
      location: center.value,
    };
    await updateDoc(docRef, data);
  } else {
    console.log("no");
    const data = {
      ...property,
      location: center.value,
    };
    await updateDoc(docRef, data);
  }
  router.push({ name: "admin-properties" });
});
</script>

<template>
  <v-card max-width="800" class="mx-auto my-5">
    <v-card-title class="text-h4 font-weight-bold" tag="h3"
      >Edit Property</v-card-title
    >
    <v-card-subtitle class="text-h6 font-weight-bold"
      >Edit the property information below</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="title.value.value"
          :error-messages="title.errorMessage.value"
          label="Title"
          class="mb-2"
        />
        <v-file-input
          v-model="image.value"
          :error-messages="image.errorMessage.value"
          accept="image/jpeg"
          prepend-icon="mdi-camera"
          label="Image"
          class="mb-5"
          @change="uploadImage"
        ></v-file-input>

        <div class="d-flex flex-column align-center">
          <p class="font-weight-bold">Current Image</p>
          <!-- Si hay imagen, se muestra la imagen que se subio -->
          <img v-if="imageUrl" :src="imageUrl" class="mb-2 w-50" />

          <!-- Si no hay imagen, se muestra la imagen de la base de datos (imagen actual) -->
          <img v-else :src="property?.image" class="mb-2 w-50" />
        </div>
        <v-text-field
          v-model="price.value.value"
          :error-messages="price.errorMessage.value"
          label="Price"
          class="mb-2"
        />
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="bedrooms.value.value"
              :error-messages="bedrooms.errorMessage.value"
              label="Bedrooms"
              class="mb-2"
              :items="items"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="bathrooms.value.value"
              :error-messages="bathrooms.errorMessage.value"
              label="Bathrooms"
              class="mb-2"
              :items="items"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="garages.value.value"
              :error-messages="garages.errorMessage.value"
              label="Garages"
              class="mb-2"
              :items="items"
            />
          </v-col>
        </v-row>
        <v-textarea
          v-model="description.value.value"
          :error-messages="description.errorMessage.value"
          label="Description"
          class="mb-2"
        />
        <v-checkbox
          v-model="hasPool.value.value"
          label="Has Pool"
          class="mb-2"
        />

        <div class="my-10">
          <h2 class="font-weight-bold mb-2 text-center">Location</h2>
          <div style="height: 600px; width: 800px">
            <LMap
              ref="map"
              v-model:zoom="zoom"
              :center="center"
              :use-global-leaflet="false"
            >
              <LMarker :lat-lng="center" draggable @moveend="pinLocation" />
              <LTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              ></LTileLayer>
            </LMap>
          </div>
        </div>
        <v-btn block color="teal" variant="flat" @click="submit">
          Save Changes
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

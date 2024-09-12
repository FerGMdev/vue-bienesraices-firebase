<script setup>
import { useForm, useField } from "vee-validate";
import { validationSchema, imageSchema } from "@/validation/propertySchema";
// Se usa para interacturar con la base de datos
import { useFirestore } from "vuefire";
// Collection es la coleccion de la base de datos
// addDoc es para agregar un documento a la coleccion
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import useImage from "@/composables/useImage";
import useLocationMap from "@/composables/useLocationMap";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

setTimeout(() => {
  console.clear();
}, 1000);

const items = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const { uploadImage, imageUrl, url } = useImage();
const { zoom, center, pinLocation } = useLocationMap();
const router = useRouter();
// db es la base de datos
const db = useFirestore();

// handleSubmit es para manejar el envio del formulario
const { handleSubmit } = useForm({
  validationSchema: {
    ...validationSchema,
    ...imageSchema,
  },
});

// useField es para manejar los campos del formulario
const title = useField("title");
const image = useField("image");
const price = useField("price");
const bedrooms = useField("bedrooms");
const bathrooms = useField("wc");
const garages = useField("garages");
const description = useField("description");

// Se indica que el campo tienePiscina es opcional
const hasPool = useField("hasPool", null, {
  initialValue: false,
});

const submit = handleSubmit(async (values) => {
  console.log(values);
  // Se separa la imagen del resto de los datos
  const { image, ...property } = values;

  console.log(image, property);

  // Se crea un documento en la coleccion properties
  const docRef = await addDoc(collection(db, "properties"), {
    ...property,
    image: url.value,
    location: center.value,
  });

  // Si el documento se crea correctamente, se redirige a la pagina de admin-properties
  if (docRef.id) {
    router.push({ name: "admin-properties" });
  }
});
</script>

<template>
  <v-card max-width="800" class="mx-auto my-5">
    <v-card-title class="text-h4 font-weight-bold" tag="h3"
      >Create New Property</v-card-title
    >
    <v-card-subtitle class="text-h6 font-weight-bold"
      >Add a new property filling the form below</v-card-subtitle
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
          v-model="image.value.value"
          :error-messages="image.errorMessage.value"
          label="Image"
          class="mb-2"
          accept="image/jpg"
          prepend-icon="mdi-camera"
          @change="uploadImage"
        />

        <div v-if="imageUrl" class="d-flex flex-column align-center">
          <p class="font-weight-bold">Image Preview</p>
          <img :src="imageUrl" class="mb-2 w-50" />
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
          Create
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style lang="css" scoped></style>

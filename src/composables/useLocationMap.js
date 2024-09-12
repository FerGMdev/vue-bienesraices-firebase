import { ref } from "vue";

export default function useLocationMap() {
  const zoom = ref(17);

  // Coordenadas de la cuidad de Puebla
  const center = ref([19.0406, -98.2008]);

  function pinLocation(e) {
    const lat = e.target.getLatLng().lat;
    const lng = e.target.getLatLng().lng;
    center.value = [lat, lng];
    console.log(center.value);
  }

  return { zoom, center, pinLocation };
}

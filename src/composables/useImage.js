import { computed } from "vue";
import { ref as storageRef } from "firebase/storage";
import { useFirebaseStorage, useStorageFile } from "vuefire";
import { uid } from "uid";

export default function useImage() {
  // storage se usa para acceder a la carpeta de almacenamiento de Firebase
  const storage = useFirebaseStorage();

  // storageRefPath es la referencia a la carpeta de almacenamiento de Firebase
  const storageRefPath = storageRef(storage, `/properties/${uid()}.jpg`);

  const { url, upload } = useStorageFile(storageRefPath);

  function uploadImage(e) {
    const data = e.target.files[0];

    // Si el archivo existe, se sube
    if (data) {
      upload(data);
    }
  }

  const imageUrl = computed(() => {
    return url.value ? url.value : null;
  });

  return { uploadImage, imageUrl, url };
}

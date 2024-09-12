/**
 *  -> Collection hace referencia a la coleccion de la base de datos, es decir, a la tabla de propiedades
 *  -> useCollection es para poder usar la coleccion de la base de datos
 *  -> useFirestore es para poder usar la base de datos
 *  -> db es la base de datos
 *  -> propertiesCollection es la coleccion de la base de datos. En este caso, la coleccion se llama "properties", tal cual se llama en Firestore. No se usa ref ni reactive porque no se va a modificar
 * -> Se realiza el filtro en el front end, ya que es más eficiente para el usuario. Esto dependerá de cada caso en particular, si se hace en el front o en el back. Ejemplo: si la colección es muy grande, se puede hacer en el back. Por otro lado, si la colección es pequeña, se puede hacer en el front.
 * -> Se usa Promise.all para eliminar la propiedad y la imagen de manera simultánea. Esto se usa cuando se tiene que hacer una operación y otra relacionada, y ambas tienen que ocurrir, pero una no depende de la otra. En este caso, se tiene que eliminar la propiedad y la imagen de la base de datos y del storage.
 */

import { computed, ref } from "vue";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";

export default function useProperties() {
  const pool = ref(false);

  const storage = useFirebaseStorage();
  const db = useFirestore();
  const propertiesCollection = useCollection(collection(db, "properties"));

  async function deleteItem(id, urlImage) {
    if (confirm("Are you sure you want to delete this property?")) {
      const docRef = doc(db, "properties", id);
      const imageRef = storageRef(storage, urlImage);

      await Promise.all([deleteDoc(docRef), deleteObject(imageRef)]);
      // await deleteDoc(docRef);
      // await deleteObject(imageRef);
      console.log("Property deleted");
    }
  }

  const poolFilter = computed(() => {
    return pool.value
      ? propertiesCollection.value.filter(
          (property) => property.hasPool === true
        )
      : propertiesCollection.value;
  });

  return { pool, propertiesCollection, poolFilter, deleteItem };
}

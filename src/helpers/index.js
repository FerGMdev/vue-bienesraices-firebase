/**
 * Removimos la función de propertyPrice del componente PropertyView y lo movemos a
 * este archivo para que sea un helper global. De esta manera, evitamos llamar a todas las variables en cada componente.
 */

export const propertyPrice = (price) =>
  Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export const validationSchema = {
  title(value) {
    if (value?.length >= 6) return true;
    return "Property title is required or too short";
  },
  price(value) {
    /*
          ^ - Representa el inicio de la cadena.
          [0-9]+ - Representa cualquier número del 0 al 9. El + indica que debe haber al menos un dígito, pero puede haber más.
          $ - Representa el final de la cadena.
      */
    if (/^[0-9]+$/.test(value)) return true;
    return "Price must be a number";
  },
  bedrooms(value) {
    if (value) return true;
    return "Select a quantity";
  },
  wc(value) {
    if (value) return true;
    return "Select a quantity";
  },
  garages(value) {
    if (value) return true;
    return "Select a quantity";
  },
  description(value) {
    if (value) return true;
    return "Add a description";
  },
};

export const imageSchema = {
  image(value) {
    if (value) return true;
    return "Image is required";
  },
};

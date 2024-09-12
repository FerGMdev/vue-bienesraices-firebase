export const loginSchema = {
  email(value) {
    if (!value) {
      return "This field is required";
    }
    // si es un email válido
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return "Invalid email";
    }
    return true;
  },
  password(value) {
    if (value) return true;
    return "Password is required";
  },
};

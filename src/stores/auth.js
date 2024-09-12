import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { useFirebaseAuth } from "vuefire";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const auth = useFirebaseAuth();
  const errorMessage = ref(null);
  const authUser = ref(null);
  const router = useRouter();
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        authUser.value = user;
      }
    });
  });

  // Login usando email y password (con async/await)
  const login = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;
      authUser.value = user;
      router.push({ name: "admin-properties" });
      // ...
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  const hasError = computed(() => {
    return errorMessage.value;
  });

  const isLoggedIn = computed(() => {
    return authUser.value;
  });

  const logout = () => {
    signOut(auth)
      .then(() => {
        authUser.value = null;
        router.push({ name: "login" });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return { login, logout, hasError, errorMessage, isLoggedIn };
});

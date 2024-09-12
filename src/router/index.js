import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import HomeView from "../views/HomeView.vue";

/**
 * ==================== NOTAS ====================
 * -> El meta: { requiresAuth: true } es para proteger las rutas que requieren autenticacion. Ésta propiedad se debe de agregar en el componente padre. No es necesario agregarla en el componente hijo, ya que ésta hereda el meta desde el padre. Por lo tanto, se utiliza router.beforeEach para proteger las rutas que requieren autenticacion. Y se usa el metodo .some() para verificar si al menos uno de los registros (routes) en la ruta actual tiene el meta: { requiresAuth: true }.
 * -> El router.beforeEach es un hook que se ejecuta antes de que se cargue la ruta. Éste se encarga de verificar si el usuario está autenticado. Si no lo está, redirige al usuario al login.
 * ===================================================
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      // Ruta para ver una propiedad
      path: "/property/:id",
      name: "property",
      component: () => import("../views/PropertyView.vue"),
    },
    {
      // Ruta para el login
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      // Ruta para el admin
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/AdminLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          // Ruta para ver las propiedades en el admin
          path: "properties",
          name: "admin-properties",
          component: () => import("../views/admin/AdminView.vue"),
        },
        {
          // Ruta para crear una nueva propiedad
          path: "new",
          name: "admin-new",
          component: () => import("../views/admin/NewPropertyView.vue"),
        },
        {
          // Ruta para editar una propiedad
          path: "edit/:id",
          name: "admin-edit",
          component: () => import("../views/admin/EditPropertyView.vue"),
        },
      ],
    },
  ],
});

// Navegacion protegida
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    // Verificar si el usuario esta autenticado
    try {
      await authenticateUser();
      next();
    } catch (error) {
      // Si no esta autenticado, redirigir al login
      console.log(error);
      next({ name: "login" });
    }
  } else {
    // Si no requiere autenticacion, simplemente continua
    next();
  }
});

function authenticateUser() {
  const auth = useFirebaseAuth();
  return new Promise((resolve, reject) => {
    // Verificar si el usuario esta autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Detener la escucha del estado de autenticacion
      unsubscribe();
      if (user) {
        // Si esta autenticado, continua
        resolve(user);
      } else {
        // Si no esta autenticado, redirigir al login
        reject(new Error("No user authenticated"));
      }
    });
  });
}
export default router;

import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  // LOGIN
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/LoginPage.vue"),
      },
    ],
  },

  // DASHBOARD
  {
    path: "/dashboard",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/DashboardPage.vue"),
      },
    ],
  },

  // PRODUCTOS
  {
    path: "/productos",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/ProductosPage.vue"),
      },
    ],
  },

  // CATÁLOGO
  {
    path: "/catalogo",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/CatalogoPage.vue"),
      },
    ],
  },

  // CATEGORÍAS
  {
    path: "/categorias",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/CategoriasPage.vue"),
      },
    ],
  },

  // PROVEEDORES
  {
    path: "/proveedores",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/ProveedoresPage.vue"),
      },
    ],
  },

  // IMPORTACIONES
  {
    path: "/importaciones",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../pages/ImportacionesPage.vue"),
      },
    ],
  },

  // PÁGINA NO ENCONTRADA
  {
    path: "/:catchAll(.*)*",
    component: () => import("../pages/ErrorNotFound.vue"),
  },
];

export default routes;
<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header class="main-header">
      <q-toolbar class="header-toolbar">

        <!-- NOMBRE / LOGO -->
        <q-toolbar-title
          class="catalogo-titulo"
          @click="irAlDashboard"
        >
          CatalogoBulk
        </q-toolbar-title>

        <!-- MENÚ -->
        <div class="menu-header">

          <!-- DASHBOARD -->
          <q-btn
            flat
            no-caps
            icon="dashboard"
            label="Inicio"
            class="menu-btn"
            @click="irAlDashboard"
          />

          <!-- PRODUCTOS -->
          <q-btn
            flat
            no-caps
            icon="inventory_2"
            label="Productos"
            class="menu-btn"
            @click="irAProductos"
          />

          <!-- CATÁLOGO -->
          <q-btn
            flat
            no-caps
            icon="storefront"
            label="Catálogo"
            class="menu-btn"
            @click="irACatalogo"
          />

          <!-- CERRAR SESIÓN -->
          <q-btn
            flat
            no-caps
            icon="logout"
            label="Salir"
            class="menu-btn"
            @click="cerrarSesion"
          />

        </div>

      </q-toolbar>
    </q-header>

    <!-- CONTENIDO -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";

const router = useRouter();

// ==========================================
// IR AL DASHBOARD
// ==========================================

const irAlDashboard = () => {
  router.push("/dashboard");
};

// ==========================================
// IR A PRODUCTOS
// ==========================================

const irAProductos = () => {
  router.push("/productos");
};

// ==========================================
// IR AL CATÁLOGO
// ==========================================

const irACatalogo = () => {
  router.push("/catalogo");
};

// ==========================================
// CERRAR SESIÓN
// ==========================================

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  router.push("/");
};

</script>

<style scoped>

/* ==========================================
   HEADER
========================================== */

.main-header {
  background: linear-gradient(
    135deg,
    #0f172a,
    #1e3a8a,
    #312e81
  );

  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.25);
}

.header-toolbar {
  min-height: 64px;
  padding: 0 28px;
}

/* ==========================================
   NOMBRE CATALOGOBULK
========================================== */

.catalogo-titulo {
  cursor: pointer;
  user-select: none;

  color: white;

  font-size: 22px;
  font-weight: 800;

  letter-spacing: -0.4px;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.catalogo-titulo:hover {
  opacity: 0.85;
  transform: translateX(2px);
}

/* ==========================================
   MENÚ
========================================== */

.menu-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-btn {
  color: white;
  font-weight: 600;

  border-radius: 8px;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 700px) {

  .header-toolbar {
    padding: 0 12px;
  }

  .catalogo-titulo {
    font-size: 18px;
  }

  .menu-header {
    gap: 0;
  }

  .menu-btn {
    min-width: 42px;
    padding: 0 6px;
  }

  .menu-btn :deep(.q-btn__content) {
    font-size: 0;
  }

  .menu-btn :deep(.q-icon) {
    font-size: 22px;
  }
}

</style>
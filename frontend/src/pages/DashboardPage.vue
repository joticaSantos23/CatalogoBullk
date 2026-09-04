<template>
  <q-page class="dashboard-page">

    <!-- ==========================================
         HEADER
    ========================================== -->
    <div class="dashboard-header">
      <div class="header-content">
        <div>
          <div class="welcome-text">
            Bienvenido a tu panel de administración 👋
          </div>
        </div>

        <q-btn
          label="Cerrar sesión"
          icon="logout"
          class="logout-btn"
          unelevated
          @click="cerrarSesion"
        />
      </div>
    </div>

    <!-- ==========================================
         CONTENIDO
    ========================================== -->
    <div class="dashboard-container">

      <!-- ==========================================
           INFORMACIÓN DEL USUARIO
      ========================================== -->
      <q-card class="user-card">
        <q-card-section>
          <div class="user-content">

            <div class="user-avatar">
              <q-icon
                name="person"
                size="32px"
              />
            </div>

            <div class="user-info">
              <div class="user-label">
                Usuario conectado
              </div>

              <div class="user-email">
                {{ usuario.email }}
              </div>
            </div>

            <div class="user-role">
              <div class="role-label">
                Rol
              </div>

              <q-badge
                class="role-badge"
                :class="
                  usuario.rol === 'admin'
                    ? 'admin-role'
                    : 'regular-role'
                "
              >
                {{ usuario.rol }}
              </q-badge>
            </div>

          </div>
        </q-card-section>
      </q-card>

      <!-- ==========================================
           SECCIÓN MÓDULOS
      ========================================== -->
      <div class="section-header">
        <div>
          <div class="section-title">
            Módulos
          </div>

          <div class="section-description">
            Administra todos los recursos de CatalogoBulk
          </div>
        </div>
      </div>

      <!-- ==========================================
           TARJETAS
      ========================================== -->
      <div class="row q-col-gutter-lg">

        <!-- ======================================
             PRODUCTOS
        ======================================= -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            class="module-card products-card"
            clickable
            @click="irAProductos"
          >
            <q-card-section>

              <div class="icon-container">
                <q-icon
                  name="inventory_2"
                  size="34px"
                />
              </div>

              <div class="module-title">
                Productos
              </div>

              <div class="module-description">
                Gestiona y administra todos los productos del catálogo.
              </div>

            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                no-caps
                label="Ver productos"
                icon-right="arrow_forward"
                class="module-btn"
                @click.stop="irAProductos"
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- ======================================
             CATEGORÍAS
        ======================================= -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            class="module-card categories-card"
            clickable
            @click="irACategorias"
          >
            <q-card-section>

              <div class="icon-container">
                <q-icon
                  name="category"
                  size="34px"
                />
              </div>

              <div class="module-title">
                Categorías
              </div>

              <div class="module-description">
                Organiza tus productos utilizando diferentes categorías.
              </div>

            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                no-caps
                label="Ver categorías"
                icon-right="arrow_forward"
                class="module-btn"
                @click.stop="irACategorias"
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- ======================================
             PROVEEDORES
        ======================================= -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            class="module-card providers-card"
            clickable
            @click="irAProveedores"
          >
            <q-card-section>

              <div class="icon-container">
                <q-icon
                  name="local_shipping"
                  size="34px"
                />
              </div>

              <div class="module-title">
                Proveedores
              </div>

              <div class="module-description">
                Administra la información de tus proveedores.
              </div>

            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                no-caps
                label="Ver proveedores"
                icon-right="arrow_forward"
                class="module-btn"
                @click.stop="irAProveedores"
              />
            </q-card-actions>
          </q-card>
        </div>

        <!-- ======================================
             IMPORTACIONES
        ======================================= -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card
            class="module-card imports-card"
            clickable
            @click="abrirImportaciones"
          >
            <q-card-section>

              <div class="icon-container">
                <q-icon
                  name="upload_file"
                  size="34px"
                />
              </div>

              <div class="module-title">
                Importaciones
              </div>

              <div class="module-description">
                Importa grandes cantidades de productos rápidamente.
              </div>

            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                no-caps
                label="Importar"
                icon-right="arrow_forward"
                class="module-btn"
                @click.stop="abrirImportaciones"
              />
            </q-card-actions>
          </q-card>
        </div>

      </div>

      <!-- ==========================================
           ESTADO DEL SISTEMA
      ========================================== -->
      <q-card class="system-card q-mt-xl">
        <q-card-section>

          <div class="system-header">

            <div class="system-icon">
              <q-icon
                name="monitor_heart"
                size="28px"
              />
            </div>

            <div>
              <div class="system-title">
                Estado del sistema
              </div>

              <div class="system-description">
                Servicios de CatalogoBulk
              </div>
            </div>

          </div>

          <div class="system-services">

            <!-- API -->
            <div class="service">
              <div class="status-dot"></div>

              <div>
                <div class="service-name">
                  API
                </div>

                <div class="service-status">
                  Operativo
                </div>
              </div>
            </div>

            <!-- MONGODB -->
            <div class="service">
              <div class="status-dot"></div>

              <div>
                <div class="service-name">
                  MongoDB
                </div>

                <div class="service-status">
                  Operativo
                </div>
              </div>
            </div>

            <!-- REDIS -->
            <div class="service">
              <div class="status-dot"></div>

              <div>
                <div class="service-name">
                  Redis
                </div>

                <div class="service-status">
                  Operativo
                </div>
              </div>
            </div>

          </div>

        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();

// ==========================================
// USUARIO
// ==========================================

const usuarioGuardado = localStorage.getItem("usuario");

const usuario = usuarioGuardado
  ? JSON.parse(usuarioGuardado)
  : {
      email: "",
      rol: "",
    };

// ==========================================
// NAVEGACIÓN
// ==========================================

const irAProductos = () => {
  router.push("/productos");
};

const irACategorias = () => {
  router.push("/categorias");
};

const irAProveedores = () => {
  router.push("/proveedores");
};

// ==========================================
// IMPORTACIONES
// ==========================================

const abrirImportaciones = () => {
  router.push("/importaciones");
};

// ==========================================
// CERRAR SESIÓN
// ==========================================

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  $q.notify({
    type: "positive",
    message: "Sesión cerrada correctamente",
    position: "top",
  });

  router.push("/");
};
</script>

<style scoped>
/* ==========================================
   PÁGINA
========================================== */

.dashboard-page {
  min-height: 100vh;

  background:
    linear-gradient(
      180deg,
      #f5f7fa 0%,
      #eef2f7 100%
    );
}

/* ==========================================
   HEADER
========================================== */

.dashboard-header {
  background:
    linear-gradient(
      135deg,
      #0f172a 0%,
      #172554 50%,
      #1d4ed8 100%
    );

  color: white;

  padding: 32px 24px;

  box-shadow:
    0 6px 25px
    rgba(15, 23, 42, 0.25);
}

.header-content {
  max-width: 1200px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
}

.welcome-text {
  font-size: 18px;

  font-weight: 600;

  color: #dbeafe;
}

/* ==========================================
   BOTÓN CERRAR SESIÓN
========================================== */

.logout-btn {
  color: white;

  border: 1px solid
    rgba(255, 255, 255, 0.35);

  border-radius: 10px;

  padding: 8px 16px;

  transition:
    all 0.2s ease;
}

.logout-btn:hover {
  background:
    rgba(255, 255, 255, 0.12);

  border-color: white;
}

/* ==========================================
   CONTENIDO
========================================== */

.dashboard-container {
  max-width: 1200px;

  margin: 0 auto;

  padding: 32px 24px 50px;
}

/* ==========================================
   USUARIO
========================================== */

.user-card {
  border-radius: 18px;

  background: white;

  border: 1px solid #e2e8f0;

  box-shadow:
    0 5px 20px
    rgba(15, 23, 42, 0.07);

  border-left: 5px solid #2563eb;
}

.user-content {
  display: flex;

  align-items: center;

  gap: 18px;
}

.user-avatar {
  width: 58px;

  height: 58px;

  border-radius: 50%;

  background: #dbeafe;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;
}

.user-info {
  flex: 1;
}

.user-label {
  color: #64748b;

  font-size: 13px;
}

.user-email {
  font-size: 18px;

  font-weight: 650;

  color: #0f172a;

  margin-top: 3px;
}

.user-role {
  text-align: right;
}

.role-label {
  color: #64748b;

  font-size: 13px;

  margin-bottom: 5px;
}

.role-badge {
  font-size: 12px;

  padding: 7px 14px;

  border-radius: 20px;

  text-transform: uppercase;

  font-weight: 700;
}

.admin-role {
  background: #2563eb;

  color: white;
}

.regular-role {
  background: #e2e8f0;

  color: #334155;
}

/* ==========================================
   SECCIÓN
========================================== */

.section-header {
  margin-top: 38px;

  margin-bottom: 20px;
}

.section-title {
  font-size: 25px;

  font-weight: 750;

  color: #0f172a;
}

.section-description {
  color: #64748b;

  margin-top: 5px;
}

/* ==========================================
   TARJETAS
========================================== */

.module-card {
  height: 100%;

  min-height: 235px;

  border-radius: 18px;

  background: white;

  border: 1px solid #e2e8f0;

  border-top: 4px solid #2563eb;

  box-shadow:
    0 5px 18px
    rgba(15, 23, 42, 0.06);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-7px);

  box-shadow:
    0 14px 30px
    rgba(15, 23, 42, 0.13);
}

/* ==========================================
   COLORES DE CADA MÓDULO
========================================== */

.products-card {
  border-top-color: #2563eb;
}

.categories-card {
  border-top-color: #7c3aed;
}

.providers-card {
  border-top-color: #0891b2;
}

.imports-card {
  border-top-color: #059669;
}

/* ==========================================
   ICONOS
========================================== */

.icon-container {
  width: 64px;

  height: 64px;

  border-radius: 15px;

  background: #eff6ff;

  color: #2563eb;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 18px;

  transition:
    transform 0.25s ease;
}

.module-card:hover
.icon-container {
  transform: scale(1.08);
}

/* Icono categorías */

.categories-card
.icon-container {
  background: #f3e8ff;

  color: #7c3aed;
}

/* Icono proveedores */

.providers-card
.icon-container {
  background: #ecfeff;

  color: #0891b2;
}

/* Icono importaciones */

.imports-card
.icon-container {
  background: #ecfdf5;

  color: #059669;
}

/* ==========================================
   TEXTO TARJETAS
========================================== */

.module-title {
  font-size: 20px;

  font-weight: 750;

  color: #0f172a;
}

.module-description {
  color: #64748b;

  line-height: 1.5;

  margin-top: 8px;

  min-height: 48px;
}

/* ==========================================
   BOTONES
========================================== */

.module-btn {
  color: #2563eb;

  font-weight: 650;

  padding-left: 16px;

  transition:
    transform 0.2s ease;
}

.module-btn:hover {
  transform: translateX(4px);
}

.categories-card
.module-btn {
  color: #7c3aed;
}

.providers-card
.module-btn {
  color: #0891b2;
}

.imports-card
.module-btn {
  color: #059669;
}

/* ==========================================
   ESTADO DEL SISTEMA
========================================== */

.system-card {
  border-radius: 18px;

  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1e293b
    );

  color: white;

  box-shadow:
    0 8px 25px
    rgba(15, 23, 42, 0.18);
}

.system-header {
  display: flex;

  align-items: center;

  gap: 15px;
}

.system-icon {
  width: 52px;

  height: 52px;

  border-radius: 13px;

  background:
    rgba(59, 130, 246, 0.15);

  color: #60a5fa;

  display: flex;

  align-items: center;

  justify-content: center;
}

.system-title {
  font-size: 19px;

  font-weight: 700;
}

.system-description {
  color: #94a3b8;

  margin-top: 3px;
}

.system-services {
  display: flex;

  gap: 55px;

  margin-top: 25px;

  flex-wrap: wrap;
}

.service {
  display: flex;

  align-items: center;

  gap: 10px;
}

.status-dot {
  width: 11px;

  height: 11px;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 10px
    rgba(34, 197, 94, 0.75);
}

.service-name {
  font-weight: 600;
}

.service-status {
  color: #86efac;

  font-size: 13px;

  margin-top: 2px;
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 600px) {

  .dashboard-header {
    padding: 25px 18px;
  }

  .header-content {
    align-items: flex-start;

    flex-direction: column;
  }

  .dashboard-container {
    padding: 24px 16px 40px;
  }

  .user-content {
    align-items: flex-start;

    flex-wrap: wrap;
  }

  .user-role {
    width: 100%;

    text-align: left;

    margin-top: 10px;
  }

  .system-services {
    gap: 20px;

    flex-direction: column;
  }

}
</style>
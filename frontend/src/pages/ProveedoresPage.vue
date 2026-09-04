<template>
  <q-page class="proveedores-page">

    <!-- ENCABEZADO -->
    <div class="page-header">
      <div>
        <div class="page-title">
          Proveedores
        </div>

        <div class="page-subtitle">
          Administra los proveedores de tu catálogo
        </div>
      </div>

      <q-btn
        v-if="esAdmin"
        unelevated
        icon="add"
        label="Nuevo proveedor"
        class="add-btn"
        @click="abrirDialogCrear"
      />
    </div>


    <!-- CONTENIDO -->
    <div class="page-container">

      <!-- BUSCADOR -->
      <q-card class="search-card q-mb-lg">

        <q-card-section>

          <q-input
            v-model="busqueda"
            outlined
            dense
            clearable
            placeholder="Buscar proveedor..."
            label="Buscar"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

        </q-card-section>

      </q-card>


      <!-- TABLA -->
      <q-card class="table-card">

        <q-table
          flat
          :rows="proveedoresFiltrados"
          :columns="columns"
          row-key="_id"
          :loading="cargando"
          no-data-label="No hay proveedores registrados"
          loading-label="Cargando proveedores..."
        >

          <!-- NOMBRE -->
          <template #body-cell-nombre="props">

            <q-td :props="props">

              <div class="provider-name">
                {{ props.row.nombre }}
              </div>

            </q-td>

          </template>


          <!-- CONTACTO -->
          <template #body-cell-contacto="props">

            <q-td :props="props">

              {{ props.row.contacto || "Sin información" }}

            </q-td>

          </template>


          <!-- TELEFONO -->
          <template #body-cell-telefono="props">

            <q-td :props="props">

              {{ props.row.telefono || "Sin información" }}

            </q-td>

          </template>


          <!-- EMAIL -->
          <template #body-cell-email="props">

            <q-td :props="props">

              {{ props.row.email || "Sin información" }}

            </q-td>

          </template>


          <!-- ESTADO -->
          <template #body-cell-activo="props">

            <q-td :props="props">

              <q-badge
                :class="
                  props.row.activo
                    ? 'status-active'
                    : 'status-inactive'
                "
              >
                {{ props.row.activo ? "Activo" : "Inactivo" }}
              </q-badge>

            </q-td>

          </template>


          <!-- ACCIONES -->
          <template #body-cell-acciones="props">

            <q-td
              :props="props"
              class="actions-cell"
            >

              <q-btn
                v-if="esAdmin"
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="abrirDialogEditar(props.row)"
              >
                <q-tooltip>
                  Editar proveedor
                </q-tooltip>
              </q-btn>


              <q-btn
                v-if="esAdmin"
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="confirmarEliminar(props.row)"
              >
                <q-tooltip>
                  Eliminar proveedor
                </q-tooltip>
              </q-btn>

            </q-td>

          </template>

        </q-table>

      </q-card>

    </div>


    <!-- DIALOG CREAR / EDITAR -->
    <q-dialog v-model="dialogo">

      <q-card class="provider-dialog">

        <q-card-section class="dialog-header">

          <div class="dialog-title">

            {{
              modoEdicion
                ? "Editar proveedor"
                : "Nuevo proveedor"
            }}

          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
          />

        </q-card-section>


        <q-card-section>

          <q-form
            @submit.prevent="guardarProveedor"
          >

            <!-- NOMBRE -->
            <q-input
              v-model="formulario.nombre"
              outlined
              label="Nombre *"
              class="q-mb-md"
              :rules="[
                val => !!val || 'El nombre es obligatorio'
              ]"
            />


            <!-- CONTACTO -->
            <q-input
              v-model="formulario.contacto"
              outlined
              label="Persona de contacto"
              class="q-mb-md"
            />


            <!-- TELEFONO -->
            <q-input
              v-model="formulario.telefono"
              outlined
              label="Teléfono"
              class="q-mb-md"
            />


            <!-- EMAIL -->
            <q-input
              v-model="formulario.email"
              outlined
              type="email"
              label="Correo electrónico"
              class="q-mb-md"
            />


            <!-- DIRECCIÓN -->
            <q-input
              v-model="formulario.direccion"
              outlined
              label="Dirección"
              class="q-mb-md"
            />


            <!-- ACTIVO -->
            <q-toggle
              v-model="formulario.activo"
              label="Proveedor activo"
              class="q-mb-md"
            />


            <!-- BOTONES -->
            <div class="dialog-actions">

              <q-btn
                flat
                label="Cancelar"
                color="grey"
                v-close-popup
              />

              <q-btn
                unelevated
                type="submit"
                :label="
                  modoEdicion
                    ? 'Guardar cambios'
                    : 'Crear proveedor'
                "
                class="save-btn"
                :loading="guardando"
              />

            </div>

          </q-form>

        </q-card-section>

      </q-card>

    </q-dialog>


    <!-- DIALOG ELIMINAR -->
    <q-dialog v-model="dialogoEliminar">

      <q-card class="delete-dialog">

        <q-card-section>

          <div class="delete-icon">
            <q-icon
              name="warning"
              size="40px"
            />
          </div>

          <div class="delete-title">
            ¿Eliminar proveedor?
          </div>

          <div class="delete-text">

            ¿Seguro que deseas eliminar
            <strong>{{ proveedorSeleccionado?.nombre }}</strong>?

            <br />

            Esta acción no se puede deshacer.

          </div>

        </q-card-section>


        <q-card-actions align="right">

          <q-btn
            flat
            label="Cancelar"
            color="grey"
            v-close-popup
          />

          <q-btn
            unelevated
            label="Eliminar"
            color="negative"
            :loading="eliminando"
            @click="eliminarProveedorSeleccionado"
          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>
</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  ref,
} from "vue";

import { useQuasar } from "quasar";

import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  type Proveedor,
} from "../services/proveedor.service";


const $q = useQuasar();


// ==========================================
// USUARIO
// ==========================================

const usuarioGuardado =
  localStorage.getItem("usuario");

const usuario = usuarioGuardado
  ? JSON.parse(usuarioGuardado)
  : {
      rol: "",
    };

const esAdmin =
  usuario.rol === "admin";


// ==========================================
// ESTADO
// ==========================================

const proveedores =
  ref<Proveedor[]>([]);

const cargando =
  ref(false);

const guardando =
  ref(false);

const eliminando =
  ref(false);

const busqueda =
  ref("");


// ==========================================
// DIALOGOS
// ==========================================

const dialogo =
  ref(false);

const dialogoEliminar =
  ref(false);

const modoEdicion =
  ref(false);

const proveedorSeleccionado =
  ref<Proveedor | null>(null);


// ==========================================
// FORMULARIO
// ==========================================

const formulario = ref({
  nombre: "",
  contacto: "",
  telefono: "",
  email: "",
  direccion: "",
  activo: true,
});


// ==========================================
// COLUMNAS
// ==========================================

const columns = [
  {
    name: "nombre",
    label: "Nombre",
    field: "nombre",
    align: "left" as const,
    sortable: true,
  },

  {
    name: "contacto",
    label: "Contacto",
    field: "contacto",
    align: "left" as const,
  },

  {
    name: "telefono",
    label: "Teléfono",
    field: "telefono",
    align: "left" as const,
  },

  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left" as const,
  },

  {
    name: "activo",
    label: "Estado",
    field: "activo",
    align: "center" as const,
  },

  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center" as const,
  },
];


// ==========================================
// FILTRO
// ==========================================

const proveedoresFiltrados =
  computed(() => {

    const texto =
      busqueda.value
        .toLowerCase()
        .trim();

    if (!texto) {
      return proveedores.value;
    }

    return proveedores.value.filter(
      (proveedor) =>
        proveedor.nombre
          .toLowerCase()
          .includes(texto) ||

        proveedor.contacto
          ?.toLowerCase()
          .includes(texto) ||

        proveedor.telefono
          ?.toLowerCase()
          .includes(texto) ||

        proveedor.email
          ?.toLowerCase()
          .includes(texto)
    );

  });


// ==========================================
// CARGAR PROVEEDORES
// ==========================================

const cargarProveedores = async () => {

  try {

    cargando.value = true;

    proveedores.value =
      await obtenerProveedores();

  } catch (error) {

    console.error(
      "Error cargando proveedores:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudieron cargar los proveedores",
    });

  } finally {

    cargando.value = false;

  }

};


// ==========================================
// CREAR
// ==========================================

const abrirDialogCrear = () => {

  modoEdicion.value = false;

  formulario.value = {
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: "",
    activo: true,
  };

  dialogo.value = true;

};


// ==========================================
// EDITAR
// ==========================================

const abrirDialogEditar = (
  proveedor: Proveedor
) => {

  modoEdicion.value = true;

  proveedorSeleccionado.value =
    proveedor;

  formulario.value = {
    nombre: proveedor.nombre,
    contacto: proveedor.contacto || "",
    telefono: proveedor.telefono || "",
    email: proveedor.email || "",
    direccion: proveedor.direccion || "",
    activo: proveedor.activo,
  };

  dialogo.value = true;

};


// ==========================================
// GUARDAR
// ==========================================

const guardarProveedor = async () => {

  try {

    guardando.value = true;

    const datos = {
      nombre:
        formulario.value.nombre.trim(),

      contacto:
        formulario.value.contacto.trim(),

      telefono:
        formulario.value.telefono.trim(),

      email:
        formulario.value.email.trim(),

      direccion:
        formulario.value.direccion.trim(),

      activo:
        formulario.value.activo,
    };


    if (modoEdicion.value) {

      if (!proveedorSeleccionado.value) {
        return;
      }

      await actualizarProveedor(
        proveedorSeleccionado.value._id,
        datos
      );

      $q.notify({
        type: "positive",
        message:
          "Proveedor actualizado correctamente",
      });

    } else {

      await crearProveedor(datos);

      $q.notify({
        type: "positive",
        message:
          "Proveedor creado correctamente",
      });

    }


    dialogo.value = false;

    await cargarProveedores();

  } catch (error: any) {

    console.error(
      "Error guardando proveedor:",
      error
    );

    const mensaje =
      error?.response?.data?.mensaje ||
      "No se pudo guardar el proveedor";

    $q.notify({
      type: "negative",
      message: mensaje,
    });

  } finally {

    guardando.value = false;

  }

};


// ==========================================
// CONFIRMAR ELIMINACIÓN
// ==========================================

const confirmarEliminar = (
  proveedor: Proveedor
) => {

  proveedorSeleccionado.value =
    proveedor;

  dialogoEliminar.value = true;

};


// ==========================================
// ELIMINAR
// ==========================================

const eliminarProveedorSeleccionado =
  async () => {

    if (!proveedorSeleccionado.value) {
      return;
    }

    try {

      eliminando.value = true;

      await eliminarProveedor(
        proveedorSeleccionado.value._id
      );

      $q.notify({
        type: "positive",
        message:
          "Proveedor eliminado correctamente",
      });

      dialogoEliminar.value = false;

      await cargarProveedores();

    } catch (error: any) {

      console.error(
        "Error eliminando proveedor:",
        error
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        "No se pudo eliminar el proveedor";

      $q.notify({
        type: "negative",
        message: mensaje,
      });

    } finally {

      eliminando.value = false;

    }

  };


// ==========================================
// INICIO
// ==========================================

onMounted(() => {
  cargarProveedores();
});

</script>


<style scoped>

.proveedores-page {
  min-height: 100vh;
  background: #f4f6f8;
}


/* HEADER */

.page-header {
  background: linear-gradient(
    135deg,
    #263238,
    #37474f
  );

  color: white;

  padding: 30px 35px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
}


.page-title {
  font-size: 30px;
  font-weight: 800;
}


.page-subtitle {
  margin-top: 5px;
  opacity: 0.8;
}


.add-btn {
  background: white;
  color: #263238;
  border-radius: 10px;
  font-weight: 600;
}


/* CONTENEDOR */

.page-container {
  max-width: 1250px;
  margin: auto;
  padding: 30px;
}


/* BUSCADOR */

.search-card {
  border-radius: 14px;

  box-shadow:
    0 4px 15px
    rgba(0, 0, 0, 0.06);
}


/* TABLA */

.table-card {
  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.07);
}


.provider-name {
  font-weight: 700;
  color: #263238;
}


.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}


.status-inactive {
  background: #ffebee;
  color: #c62828;
}


.actions-cell {
  white-space: nowrap;
}


/* DIALOG */

.provider-dialog {
  width: 600px;
  max-width: 95vw;

  border-radius: 16px;
}


.dialog-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #263238;

  color: white;
}


.dialog-title {
  font-size: 20px;
  font-weight: 700;
}


.dialog-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 10px;
}


.save-btn {
  background: #263238;
  color: white;
}


/* ELIMINAR */

.delete-dialog {
  width: 450px;
  max-width: 95vw;

  border-radius: 16px;
}


.delete-icon {
  color: #c62828;
  margin-bottom: 10px;
}


.delete-title {
  font-size: 21px;
  font-weight: 700;
}


.delete-text {
  color: #666;
  margin-top: 10px;
  line-height: 1.5;
}


/* RESPONSIVE */

@media (max-width: 600px) {

  .page-header {
    padding: 25px 18px;

    flex-direction: column;

    align-items: flex-start;
  }


  .page-container {
    padding: 20px 15px;
  }

}

</style>
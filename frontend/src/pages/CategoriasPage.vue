<template>
  <q-page class="q-pa-lg">

    <!-- ENCABEZADO -->
    <div class="row items-center justify-between q-mb-lg">

      <div>
        <div class="text-h4 text-weight-bold">
          Categorías
        </div>

        <div class="text-grey-7">
          Administra las categorías de tus productos
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Nueva categoría"
        @click="abrirFormulario"
      />

    </div>


    <!-- BUSCADOR -->
    <q-input
      v-model="busqueda"
      outlined
      dense
      placeholder="Buscar categoría..."
      class="q-mb-md"
      clearable
    >

      <template #prepend>
        <q-icon name="search" />
      </template>

    </q-input>


    <!-- TABLA -->
    <q-card flat bordered>

      <q-table
        :rows="categoriasFiltradas"
        :columns="columnas"
        row-key="_id"
        :loading="cargando"
        no-data-label="No hay categorías registradas"
        loading-label="Cargando categorías..."
      >

        <!-- NOMBRE -->
        <template #body-cell-nombre="props">

          <q-td :props="props">

            <div class="text-weight-medium">
              {{ props.row.nombre }}
            </div>

          </q-td>

        </template>


        <!-- DESCRIPCIÓN -->
        <template #body-cell-descripcion="props">

          <q-td :props="props">

            {{ props.row.descripcion || "Sin descripción" }}

          </q-td>

        </template>


        <!-- ACCIONES -->
        <template #body-cell-acciones="props">

          <q-td
            :props="props"
            class="text-center"
          >

            <!-- EDITAR -->
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editarCategoria(props.row)"
            >

              <q-tooltip>
                Editar
              </q-tooltip>

            </q-btn>


            <!-- ELIMINAR -->
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              :loading="eliminandoId === props.row._id"
              :disable="eliminandoId !== ''"
              @click="confirmarEliminar(props.row)"
            >

              <q-tooltip>
                Eliminar
              </q-tooltip>

            </q-btn>

          </q-td>

        </template>

      </q-table>

    </q-card>


    <!-- ========================================== -->
    <!-- DIALOGO CREAR / EDITAR -->
    <!-- ========================================== -->

    <q-dialog v-model="mostrarFormulario">

      <q-card
        style="width: 500px; max-width: 90vw"
      >

        <q-card-section>

          <div class="text-h6">
            {{ editando ? "Editar categoría" : "Nueva categoría" }}
          </div>

        </q-card-section>


        <q-card-section>

          <!-- NOMBRE -->
          <q-input
            v-model="formulario.nombre"
            label="Nombre"
            outlined
            :rules="[
              val => !!val || 'El nombre es obligatorio'
            ]"
            class="q-mb-md"
          />


          <!-- DESCRIPCIÓN -->
          <q-input
            v-model="formulario.descripcion"
            label="Descripción"
            type="textarea"
            outlined
            autogrow
          />

        </q-card-section>


        <q-card-actions align="right">

          <!-- CANCELAR -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            :disable="guardando"
            @click="cerrarFormulario"
          />


          <!-- GUARDAR -->
          <q-btn
            color="primary"
            :loading="guardando"
            label="Guardar"
            @click="guardarCategoria"
          />

        </q-card-actions>

      </q-card>

    </q-dialog>


    <!-- ========================================== -->
    <!-- DIALOGO CONFIRMAR ELIMINACIÓN -->
    <!-- ========================================== -->

    <q-dialog v-model="mostrarConfirmacionEliminar">

      <q-card
        style="width: 420px; max-width: 90vw"
      >

        <!-- TÍTULO -->
        <q-card-section>

          <div class="text-h6">
            Eliminar categoría
          </div>

        </q-card-section>


        <!-- MENSAJE -->
        <q-card-section>

          ¿Seguro que deseas eliminar

          <strong>
            {{ categoriaAEliminar?.nombre }}
          </strong>

          ?

        </q-card-section>


        <!-- BOTONES -->
        <q-card-actions align="right">

          <!-- CANCELAR -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            :disable="eliminandoId !== ''"
            @click="cancelarEliminar"
          />


          <!-- ELIMINAR -->
          <q-btn
            color="negative"
            icon="delete"
            label="Eliminar"
            :loading="eliminandoId !== ''"
            @click="ejecutarEliminacion"
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
  ref
} from "vue";

import { useQuasar } from "quasar";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  type Categoria
} from "../services/categoria.service";


const $q = useQuasar();


// ==========================================
// ESTADO
// ==========================================

const categorias = ref<Categoria[]>([]);

const busqueda = ref("");

const cargando = ref(false);

const guardando = ref(false);

const eliminandoId = ref("");

const mostrarFormulario = ref(false);

const mostrarConfirmacionEliminar = ref(false);

const editando = ref(false);

const categoriaEditandoId = ref("");

const categoriaAEliminar = ref<Categoria | null>(null);


// ==========================================
// FORMULARIO
// ==========================================

const formulario = ref({
  nombre: "",
  descripcion: ""
});


// ==========================================
// COLUMNAS
// ==========================================

const columnas = [

  {
    name: "nombre",
    label: "NOMBRE",
    field: "nombre",
    align: "left" as const
  },

  {
    name: "descripcion",
    label: "DESCRIPCIÓN",
    field: "descripcion",
    align: "left" as const
  },

  {
    name: "acciones",
    label: "ACCIONES",
    field: "acciones",
    align: "center" as const
  }

];


// ==========================================
// FILTRAR CATEGORÍAS
// ==========================================

const categoriasFiltradas = computed(() => {

  const texto = busqueda.value
    .trim()
    .toLowerCase();


  if (!texto) {
    return categorias.value;
  }


  return categorias.value.filter(
    (categoria) =>
      categoria.nombre
        .toLowerCase()
        .includes(texto)
  );

});


// ==========================================
// CARGAR CATEGORÍAS
// ==========================================

const cargarCategorias = async () => {

  try {

    cargando.value = true;

    categorias.value = await obtenerCategorias();

  } catch (error) {

    console.error(
      "Error al cargar categorías:",
      error
    );

    $q.notify({
      type: "negative",
      message: "No se pudieron cargar las categorías",
      position: "top"
    });

  } finally {

    cargando.value = false;

  }

};


// ==========================================
// ABRIR FORMULARIO
// ==========================================

const abrirFormulario = () => {

  editando.value = false;

  categoriaEditandoId.value = "";

  formulario.value = {
    nombre: "",
    descripcion: ""
  };

  mostrarFormulario.value = true;

};


// ==========================================
// CERRAR FORMULARIO
// ==========================================

const cerrarFormulario = () => {

  if (guardando.value) {
    return;
  }

  mostrarFormulario.value = false;

};


// ==========================================
// EDITAR CATEGORÍA
// ==========================================

const editarCategoria = (
  categoria: Categoria
) => {

  editando.value = true;

  categoriaEditandoId.value =
    categoria._id;

  formulario.value = {

    nombre: categoria.nombre,

    descripcion:
      categoria.descripcion || ""

  };

  mostrarFormulario.value = true;

};


// ==========================================
// GUARDAR CATEGORÍA
// ==========================================

const guardarCategoria = async () => {

  const nombre =
    formulario.value.nombre.trim();


  // VALIDACIÓN
  if (!nombre) {

    $q.notify({
      type: "warning",
      message:
        "El nombre de la categoría es obligatorio",
      position: "top"
    });

    return;

  }


  try {

    guardando.value = true;


    const datos = {

      nombre,

      descripcion:
        formulario.value.descripcion.trim()

    };


    // ========================================
    // EDITAR
    // ========================================

    if (
      editando.value &&
      categoriaEditandoId.value
    ) {

      await actualizarCategoria(

        categoriaEditandoId.value,

        datos

      );


      $q.notify({
        type: "positive",
        message:
          "Categoría actualizada correctamente",
        position: "top"
      });

    }


    // ========================================
    // CREAR
    // ========================================

    else {

      await crearCategoria(datos);


      $q.notify({
        type: "positive",
        message:
          "Categoría creada correctamente",
        position: "top"
      });

    }


    cerrarFormulario();

    await cargarCategorias();

  } catch (error: any) {

    console.error(
      "Error al guardar categoría:",
      error
    );


    const mensaje =

      error?.response?.data?.mensaje ||

      error?.response?.data?.message ||

      "No se pudo guardar la categoría";


    $q.notify({
      type: "negative",
      message: mensaje,
      position: "top"
    });

  } finally {

    guardando.value = false;

  }

};


// ==========================================
// CONFIRMAR ELIMINACIÓN
// ==========================================

const confirmarEliminar = (
  categoria: Categoria
) => {

  console.log(
    "Categoría seleccionada:",
    categoria
  );


  console.log(
    "ID de categoría:",
    categoria._id
  );


  // Verificar ID
  if (!categoria._id) {

    $q.notify({
      type: "negative",
      message:
        "No se encontró el ID de la categoría",
      position: "top"
    });

    return;

  }


  // Guardar categoría seleccionada
  categoriaAEliminar.value =
    categoria;


  // Abrir diálogo
  mostrarConfirmacionEliminar.value =
    true;

};


// ==========================================
// CANCELAR ELIMINACIÓN
// ==========================================

const cancelarEliminar = () => {

  if (eliminandoId.value !== "") {
    return;
  }


  mostrarConfirmacionEliminar.value =
    false;

  categoriaAEliminar.value =
    null;

};


// ==========================================
// EJECUTAR ELIMINACIÓN
// ==========================================

const ejecutarEliminacion = async () => {

  // Verificar categoría
  if (!categoriaAEliminar.value) {

    $q.notify({
      type: "negative",
      message:
        "No se encontró la categoría a eliminar",
      position: "top"
    });

    return;

  }


  const id =
    categoriaAEliminar.value._id;


  // Verificar ID
  if (!id) {

    $q.notify({
      type: "negative",
      message:
        "La categoría no tiene un ID válido",
      position: "top"
    });

    return;

  }


  try {

    // Activar loading
    eliminandoId.value = id;


    console.log(
      "Enviando DELETE para categoría:",
      id
    );


    // ========================================
    // PETICIÓN DELETE
    // ========================================

    await eliminarCategoria(id);


    console.log(
      "Categoría eliminada correctamente:",
      id
    );


    // Cerrar diálogo
    mostrarConfirmacionEliminar.value =
      false;

    categoriaAEliminar.value =
      null;


    // Mensaje
    $q.notify({
      type: "positive",
      message:
        "Categoría eliminada correctamente",
      position: "top"
    });


    // ========================================
    // RECARGAR TABLA
    // ========================================

    await cargarCategorias();

  } catch (error: any) {

    console.error(
      "Error al eliminar categoría:",
      error
    );


    console.error(
      "Respuesta del servidor:",
      error?.response?.data
    );


    console.error(
      "Código HTTP:",
      error?.response?.status
    );


    const mensaje =

      error?.response?.data?.mensaje ||

      error?.response?.data?.message ||

      "No se pudo eliminar la categoría";


    $q.notify({
      type: "negative",
      message: mensaje,
      position: "top"
    });

  } finally {

    // Quitar loading
    eliminandoId.value = "";

  }

};


// ==========================================
// INICIO
// ==========================================

onMounted(() => {

  cargarCategorias();

});

</script>
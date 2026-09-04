<template>
  <q-page class="productos-page">

    <!-- HEADER -->
    <div class="productos-header">
      <div class="header-content">

        <!-- INFORMACIÓN DE LA PÁGINA -->
        <div class="header-info">
          <div class="page-title">
            Productos
          </div>

          <div class="page-description">
            Gestiona los productos de tu catálogo
          </div>
        </div>

        <!-- NUEVO PRODUCTO -->
        <q-btn
          label="Nuevo producto"
          icon="add"
          class="new-product-btn"
          unelevated
          @click="abrirNuevoProducto"
        />
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="productos-container">

      <!-- FORMULARIO -->
      <q-card
        v-if="mostrarFormulario"
        class="new-product-card q-mb-lg"
      >
        <q-card-section class="form-header">

          <div>
            <div class="form-title">
              {{
                editandoProducto
                  ? "Editar producto"
                  : "Nuevo producto"
              }}
            </div>

            <div class="form-description">
              {{
                editandoProducto
                  ? "Modifica los datos del producto"
                  : "Completa los datos del nuevo producto"
              }}
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            class="close-btn"
            :disable="guardando"
            @click="cerrarFormulario"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">

            <!-- CÓDIGO -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="nuevoProducto.codigo"
                outlined
                label="Código"
                placeholder="Ej: PROD004"
                :disable="guardando"
                class="custom-input"
              />
            </div>

            <!-- NOMBRE -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="nuevoProducto.nombre"
                outlined
                label="Nombre del producto"
                placeholder="Ej: Teclado mecánico"
                :disable="guardando"
                class="custom-input"
              />
            </div>

            <!-- DESCRIPCIÓN -->
            <div class="col-12">
              <q-input
                v-model="nuevoProducto.descripcion"
                outlined
                type="textarea"
                label="Descripción"
                placeholder="Descripción del producto"
                :disable="guardando"
                class="custom-input"
              />
            </div>

            <!-- URL DE IMAGEN -->
            <div class="col-12">
              <q-input
                v-model="nuevoProducto.imagenUrl"
                outlined
                label="URL de la imagen"
                placeholder="Ej: https://ejemplo.com/imagen.jpg"
                :disable="guardando"
                class="custom-input"
                hint="Pega aquí la dirección URL de la imagen del producto"
              >
                <template #prepend>
                  <q-icon name="image" />
                </template>
              </q-input>
            </div>

            <!-- VISTA PREVIA DE IMAGEN -->
            <div
              v-if="nuevoProducto.imagenUrl.trim()"
              class="col-12"
            >
              <div class="image-preview-container">

                <div class="image-preview-title">
                  Vista previa
                </div>

                <q-img
                  :src="nuevoProducto.imagenUrl"
                  fit="contain"
                  class="image-preview"
                  spinner-color="primary"
                  @error="imagenPreviewError = true"
                />

                <div
                  v-if="imagenPreviewError"
                  class="image-preview-error"
                >
                  No se pudo cargar la imagen.
                  Verifica que la URL sea correcta.
                </div>

              </div>
            </div>

            <!-- CATEGORÍA -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="nuevoProducto.categoria"
                outlined
                label="Categoría"
                :options="categorias"
                option-label="nombre"
                option-value="_id"
                emit-value
                map-options
                :loading="cargandoCategorias"
                :disable="guardando"
                clearable
                hint="Selecciona la categoría del producto"
                class="custom-input"
              />
            </div>

            <!-- PROVEEDOR -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="nuevoProducto.proveedor"
                outlined
                label="Proveedor"
                :options="proveedores"
                option-label="nombre"
                option-value="_id"
                emit-value
                map-options
                :loading="cargandoProveedores"
                :disable="guardando"
                clearable
                hint="Selecciona el proveedor del producto"
                class="custom-input"
              />
            </div>

            <!-- PRECIO -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="nuevoProducto.precio"
                outlined
                type="number"
                label="Precio"
                prefix="$"
                :disable="guardando"
                class="custom-input"
              />
            </div>

            <!-- STOCK -->
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="nuevoProducto.stock"
                outlined
                type="number"
                label="Stock"
                :disable="guardando"
                class="custom-input"
              />
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="right"
          class="form-actions"
        >
          <q-btn
            flat
            label="Cancelar"
            class="cancel-btn"
            :disable="guardando"
            @click="cerrarFormulario"
          />

          <q-btn
            unelevated
            :label="
              editandoProducto
                ? 'Actualizar producto'
                : 'Guardar producto'
            "
            :icon="
              editandoProducto
                ? 'edit'
                : 'save'
            "
            class="save-btn"
            :loading="guardando"
            @click="guardarProducto"
          />
        </q-card-actions>
      </q-card>

      <!-- BARRA DE HERRAMIENTAS -->
      <q-card class="toolbar-card q-mb-lg">
        <q-card-section>

          <div class="row q-col-gutter-md items-center">

            <!-- BUSCAR -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="busqueda"
                outlined
                dense
                placeholder="Buscar producto..."
                clearable
                class="search-input"
              >
                <template #prepend>
                  <q-icon
                    name="search"
                    class="search-icon"
                  />
                </template>
              </q-input>
            </div>

            <!-- ACTUALIZAR -->
            <div class="col-12 col-md-3">
              <q-btn
                outline
                icon="refresh"
                label="Actualizar"
                class="refresh-btn"
                :loading="cargando"
                @click="cargarProductos"
              />
            </div>

            <!-- CONTADOR -->
            <div class="col-12 col-md-3 text-right">
              <div class="products-counter">
                Total de productos
              </div>

              <div class="counter-number">
                {{ productosFiltrados.length }}
              </div>
            </div>

          </div>
        </q-card-section>
      </q-card>

      <!-- TABLA -->
      <q-card class="products-card">

        <q-card-section class="table-header">
          <div>

            <div class="table-title">
              Lista de productos
            </div>

            <div class="table-description">
              Productos registrados en CatalogoBulk
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-table
          flat
          :rows="productosFiltrados"
          :columns="columns"
          row-key="_id"
          :loading="cargando"
          no-data-label="No hay productos registrados"
          class="products-table"
        >

          <!-- CÓDIGO -->
          <template #body-cell-codigo="props">
            <q-td :props="props">
              <q-badge class="code-badge">
                {{ props.row.codigo }}
              </q-badge>
            </q-td>
          </template>

          <!-- PRODUCTO -->
          <template #body-cell-nombre="props">
            <q-td :props="props">

              <div class="product-name">
                {{ props.row.nombre }}
              </div>

              <div class="product-description">
                {{
                  props.row.descripcion ||
                  "Sin descripción"
                }}
              </div>

            </q-td>
          </template>

          <!-- PRECIO -->
          <template #body-cell-precio="props">
            <q-td :props="props">
              <span class="price">
                ${{
                  Number(
                    props.row.precio
                  ).toLocaleString("es-CO")
                }}
              </span>
            </q-td>
          </template>

          <!-- STOCK -->
          <template #body-cell-stock="props">
            <q-td :props="props">

              <q-badge
                :class="
                  props.row.stock > 0
                    ? 'stock-available'
                    : 'stock-empty'
                "
              >
                {{ props.row.stock }}
              </q-badge>

            </q-td>
          </template>

          <!-- ESTADO -->
          <template #body-cell-activo="props">
            <q-td :props="props">

              <div class="estado-container">

                <q-badge
                  :class="
                    props.row.activo
                      ? 'status-active'
                      : 'status-inactive'
                  "
                >
                  {{
                    props.row.activo
                      ? "Activo"
                      : "Inactivo"
                  }}
                </q-badge>

                <q-btn
                  flat
                  round
                  dense
                  :icon="
                    props.row.activo
                      ? 'toggle_on'
                      : 'toggle_off'
                  "
                  :class="
                    props.row.activo
                      ? 'toggle-active'
                      : 'toggle-inactive'
                  "
                  :loading="
                    cambiandoEstadoId ===
                    props.row._id
                  "
                  :disable="
                    cambiandoEstadoId !== null
                  "
                  @click="
                    cambiarEstadoProducto(
                      props.row
                    )
                  "
                >
                  <q-tooltip>
                    {{
                      props.row.activo
                        ? "Desactivar producto"
                        : "Activar producto"
                    }}
                  </q-tooltip>
                </q-btn>

              </div>
            </q-td>
          </template>

          <!-- ACCIONES -->
          <template #body-cell-acciones="props">
            <q-td :props="props">

              <!-- EDITAR -->
              <q-btn
                flat
                round
                dense
                icon="edit"
                class="action-btn edit-btn"
                :disable="
                  guardando ||
                  cambiandoEstadoId !== null
                "
                @click="
                  editarProducto(props.row)
                "
              >
                <q-tooltip>
                  Editar producto
                </q-tooltip>
              </q-btn>

            </q-td>
          </template>

        </q-table>
      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">

import {
  computed,
  onMounted,
  ref
} from "vue";

import { useQuasar } from "quasar";

import { useRouter } from "vue-router";

import {
  obtenerProductos,
  crearProducto,
  type Producto
} from "../services/producto.service";

import api from "../services/api";

const $q = useQuasar();

const router = useRouter();

// ======================================================
// ESTADOS
// ======================================================

const productos = ref<Producto[]>([]);

const busqueda = ref("");

const cargando = ref(false);

const mostrarFormulario = ref(false);

const guardando = ref(false);

const cargandoCategorias = ref(false);

const cargandoProveedores = ref(false);

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

const cambiandoEstadoId =
  ref<string | null>(null);

// ======================================================
// EDICIÓN
// ======================================================

const editandoProducto = ref(false);

const productoEditandoId = ref("");

// ======================================================
// CATEGORÍAS
// ======================================================

interface Categoria {
  _id: string;
  nombre: string;
}

const categorias =
  ref<Categoria[]>([]);

// ======================================================
// PROVEEDORES
// ======================================================

interface Proveedor {
  _id: string;
  nombre: string;
}

const proveedores =
  ref<Proveedor[]>([]);

// ======================================================
// PRODUCTO
// ======================================================

const nuevoProducto = ref({
  codigo: "",
  nombre: "",
  descripcion: "",
  imagenUrl: "",
  precio: 0,
  stock: 0,
  categoria: "",
  proveedor: ""
});

// ======================================================
// ERROR VISTA PREVIA
// ======================================================

const imagenPreviewError = ref(false);

// ======================================================
// COLUMNAS
// ======================================================

const columns = [
  {
    name: "codigo",
    label: "Código",
    field: "codigo",
    align: "left" as const,
    sortable: true
  },

  {
    name: "nombre",
    label: "Producto",
    field: "nombre",
    align: "left" as const,
    sortable: true
  },

  {
    name: "precio",
    label: "Precio",
    field: "precio",
    align: "right" as const,
    sortable: true
  },

  {
    name: "stock",
    label: "Stock",
    field: "stock",
    align: "center" as const,
    sortable: true
  },

  {
    name: "activo",
    label: "Estado",
    field: "activo",
    align: "center" as const,
    sortable: true
  },

  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center" as const
  }
];

// ======================================================
// VOLVER AL DASHBOARD
// ======================================================

const irAlInicio = () => {
  router.push("/dashboard");
};

// ======================================================
// CARGAR PRODUCTOS
// ======================================================

const cargarProductos = async () => {

  try {

    cargando.value = true;

    productos.value =
      await obtenerProductos();

  } catch (error) {

    console.error(
      "Error al cargar productos:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudieron cargar los productos",
      position: "top"
    });

  } finally {

    cargando.value = false;

  }
};

// ======================================================
// CARGAR CATEGORÍAS
// ======================================================

const cargarCategorias = async () => {

  try {

    cargandoCategorias.value = true;

    const respuesta =
      await api.get("/categorias");

    console.log(
      "Respuesta categorías:",
      respuesta.data
    );

    if (
      Array.isArray(
        respuesta.data
      )
    ) {

      categorias.value =
        respuesta.data;

    } else if (
      Array.isArray(
        respuesta.data.categorias
      )
    ) {

      categorias.value =
        respuesta.data.categorias;

    } else if (
      Array.isArray(
        respuesta.data.data
      )
    ) {

      categorias.value =
        respuesta.data.data;

    } else {

      categorias.value = [];

    }

    console.log(
      "Categorías cargadas:",
      categorias.value
    );

  } catch (error) {

    console.error(
      "Error al cargar categorías:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudieron cargar las categorías",
      position: "top"
    });

  } finally {

    cargandoCategorias.value =
      false;

  }
};

// ======================================================
// CARGAR PROVEEDORES
// ======================================================

const cargarProveedores = async () => {

  try {

    cargandoProveedores.value =
      true;

    const respuesta =
      await api.get("/proveedores");

    console.log(
      "Respuesta proveedores:",
      respuesta.data
    );

    if (
      Array.isArray(
        respuesta.data
      )
    ) {

      proveedores.value =
        respuesta.data;

    } else if (
      Array.isArray(
        respuesta.data.proveedores
      )
    ) {

      proveedores.value =
        respuesta.data.proveedores;

    } else if (
      Array.isArray(
        respuesta.data.data
      )
    ) {

      proveedores.value =
        respuesta.data.data;

    } else {

      proveedores.value = [];

    }

    console.log(
      "Proveedores cargados:",
      proveedores.value
    );

  } catch (error) {

    console.error(
      "Error al cargar proveedores:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudieron cargar los proveedores",
      position: "top"
    });

  } finally {

    cargandoProveedores.value =
      false;

  }
};

// ======================================================
// FILTRAR PRODUCTOS
// ======================================================

const productosFiltrados =
  computed(() => {

    const texto =
      busqueda.value
        .toLowerCase()
        .trim();

    if (!texto) {
      return productos.value;
    }

    return productos.value.filter(
      (producto) => {

        return (
          producto.nombre
            ?.toLowerCase()
            .includes(texto)
          ||
          producto.codigo
            ?.toLowerCase()
            .includes(texto)
          ||
          producto.descripcion
            ?.toLowerCase()
            .includes(texto)
        );

      }
    );

  });

// ======================================================
// ABRIR NUEVO PRODUCTO
// ======================================================

const abrirNuevoProducto = () => {

  editandoProducto.value =
    false;

  productoEditandoId.value =
    "";

  imagenPreviewError.value =
    false;

  nuevoProducto.value = {
    codigo: "",
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    precio: 0,
    stock: 0,
    categoria: "",
    proveedor: ""
  };

  mostrarFormulario.value =
    true;
};

// ======================================================
// CERRAR FORMULARIO
// ======================================================

const cerrarFormulario = () => {

  mostrarFormulario.value =
    false;

  editandoProducto.value =
    false;

  productoEditandoId.value =
    "";

  imagenPreviewError.value =
    false;

  nuevoProducto.value = {
    codigo: "",
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    precio: 0,
    stock: 0,
    categoria: "",
    proveedor: ""
  };
};

// ======================================================
// EDITAR PRODUCTO
// ======================================================

const editarProducto = (
  producto: Producto
) => {

  console.log(
    "Producto seleccionado para editar:",
    producto
  );

  editandoProducto.value =
    true;

  productoEditandoId.value =
    producto._id;

  imagenPreviewError.value =
    false;

  // Obtener ID de categoría
  let categoriaId = "";

  if (
    typeof producto.categoria ===
    "string"
  ) {

    categoriaId =
      producto.categoria;

  } else if (
    producto.categoria &&
    typeof producto.categoria ===
    "object"
  ) {

    categoriaId =
      (producto.categoria as any)
        ._id || "";

  }

  // Obtener ID del proveedor
  let proveedorId = "";

  if (producto.proveedor) {

    if (
      typeof producto.proveedor ===
      "string"
    ) {

      proveedorId =
        producto.proveedor;

    } else if (
      typeof producto.proveedor ===
      "object"
    ) {

      proveedorId =
        (producto.proveedor as any)
          ._id || "";

    }

  }

  nuevoProducto.value = {

    codigo:
      producto.codigo || "",

    nombre:
      producto.nombre || "",

    descripcion:
      producto.descripcion || "",

    imagenUrl:
      producto.imagenUrl || "",

    precio:
      Number(producto.precio) || 0,

    stock:
      Number(producto.stock) || 0,

    categoria:
      categoriaId,

    proveedor:
      proveedorId

  };

  mostrarFormulario.value =
    true;
};

// ======================================================
// GUARDAR / ACTUALIZAR PRODUCTO
// ======================================================

const guardarProducto =
  async () => {

    // Validar código
    if (
      !nuevoProducto.value.codigo
        .trim()
    ) {

      $q.notify({
        type: "warning",
        message:
          "El código es obligatorio",
        position: "top"
      });

      return;
    }

    // Validar nombre
    if (
      !nuevoProducto.value.nombre
        .trim()
    ) {

      $q.notify({
        type: "warning",
        message:
          "El nombre es obligatorio",
        position: "top"
      });

      return;
    }

    // Validar categoría
    if (
      !nuevoProducto.value.categoria
    ) {

      $q.notify({
        type: "warning",
        message:
          "Debes seleccionar una categoría",
        position: "top"
      });

      return;
    }

    // Validar proveedor
    if (
      !nuevoProducto.value.proveedor
    ) {

      $q.notify({
        type: "warning",
        message:
          "Debes seleccionar un proveedor",
        position: "top"
      });

      return;
    }

    // Validar precio
    if (
      nuevoProducto.value.precio <= 0
    ) {

      $q.notify({
        type: "warning",
        message:
          "El precio debe ser mayor que 0",
        position: "top"
      });

      return;
    }

    // Validar stock
    if (
      nuevoProducto.value.stock < 0
    ) {

      $q.notify({
        type: "warning",
        message:
          "El stock no puede ser negativo",
        position: "top"
      });

      return;
    }

    try {

      guardando.value = true;

      const datos = {

        codigo:
          nuevoProducto.value.codigo
            .trim(),

        nombre:
          nuevoProducto.value.nombre
            .trim(),

        descripcion:
          nuevoProducto.value.descripcion
            .trim(),

        imagenUrl:
          nuevoProducto.value.imagenUrl
            .trim(),

        precio:
          nuevoProducto.value.precio,

        stock:
          nuevoProducto.value.stock,

        categoria:
          nuevoProducto.value.categoria,

        proveedor:
          nuevoProducto.value.proveedor

      };

      console.log(
        "Datos enviados:",
        datos
      );

      // EDITAR
      if (
        editandoProducto.value &&
        productoEditandoId.value
      ) {

        await api.put(
          `/productos/${productoEditandoId.value}`,
          datos
        );

        $q.notify({
          type: "positive",
          message:
            "Producto actualizado correctamente",
          position: "top"
        });

      }

      // CREAR
      else {

        await crearProducto(datos);

        $q.notify({
          type: "positive",
          message:
            "Producto creado correctamente",
          position: "top"
        });

      }

      cerrarFormulario();

      await cargarProductos();

    } catch (error: any) {

      console.error(
        "ERROR COMPLETO:",
        error
      );

      console.error(
        "RESPUESTA DEL SERVIDOR:",
        JSON.stringify(
          error?.response?.data,
          null,
          2
        )
      );

      console.error(
        "ESTADO HTTP:",
        error?.response?.status
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        "No se pudo guardar el producto";

      $q.notify({
        type: "negative",
        message: mensaje,
        position: "top"
      });

    } finally {

      guardando.value = false;

    }

  };

// ======================================================
// CAMBIAR ESTADO DEL PRODUCTO
// ======================================================

const cambiarEstadoProducto =
  async (producto: Producto) => {

    try {

      cambiandoEstadoId.value =
        producto._id;

      const nuevoEstado =
        !producto.activo;

      await api.put(
        `/productos/${producto._id}`,
        {
          activo: nuevoEstado
        }
      );

      // Actualizar inmediatamente
      // la fila en pantalla
      producto.activo =
        nuevoEstado;

      $q.notify({
        type: "positive",
        message: nuevoEstado
          ? "Producto activado correctamente"
          : "Producto desactivado correctamente",
        position: "top"
      });

    } catch (error: any) {

      console.error(
        "Error cambiando estado del producto:",
        error
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        "No se pudo cambiar el estado del producto";

      $q.notify({
        type: "negative",
        message: mensaje,
        position: "top"
      });

    } finally {

      cambiandoEstadoId.value =
        null;

    }

  };

// ======================================================
// CARGAR AL ENTRAR
// ======================================================

onMounted(async () => {

  await Promise.all([
    cargarProductos(),
    cargarCategorias(),
    cargarProveedores()
  ]);

});

</script>

<style scoped>

.productos-page {
  min-height: 100vh;

  background:
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #eef2f7 100%
    );
}

.productos-header {
  background:
    linear-gradient(
      135deg,
      #0f172a 0%,
      #172554 48%,
      #1d4ed8 100%
    );

  color: white;

  padding:
    30px 24px;

  box-shadow:
    0 6px 25px
    rgba(15, 23, 42, 0.25);
}

.header-content {
  max-width: 1200px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  gap: 25px;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 30px;

  font-weight: 800;

  letter-spacing: -0.5px;
}

.page-description {
  margin-top: 5px;

  color: #dbeafe;

  font-size: 15px;
}

.new-product-btn {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  border-radius: 11px;

  padding:
    9px 17px;

  font-weight: 700;

  box-shadow:
    0 7px 18px
    rgba(37, 99, 235, 0.35);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.new-product-btn:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 10px 23px
    rgba(37, 99, 235, 0.45);
}

.productos-container {
  max-width: 1200px;

  margin: 0 auto;

  padding:
    30px
    24px
    50px;
}

.new-product-card {
  border-radius: 18px;

  background: white;

  border:
    1px solid #e2e8f0;

  box-shadow:
    0 8px 25px
    rgba(15, 23, 42, 0.08);

  overflow: hidden;
}

.form-header {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  padding:
    22px 24px;
}

.form-title {
  font-size: 21px;

  font-weight: 750;

  color: #0f172a;
}

.form-description {
  color: #64748b;

  font-size: 14px;

  margin-top: 4px;
}

.close-btn {
  color: #64748b;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.close-btn:hover {
  color: #2563eb;

  transform:
    rotate(90deg);
}

.custom-input :deep(.q-field__control) {
  border-radius: 11px;
}

.custom-input :deep(.q-field--focused .q-field__label) {
  color: #2563eb;
}

.form-actions {
  padding:
    16px 24px;
}

.cancel-btn {
  color: #64748b;

  border-radius: 9px;
}

.save-btn {
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  border-radius: 9px;

  font-weight: 700;

  padding:
    8px 17px;

  box-shadow:
    0 6px 15px
    rgba(37, 99, 235, 0.25);
}

.image-preview-container {
  border:
    1px solid #e2e8f0;

  border-radius: 12px;

  padding: 15px;

  background:
    #f8fafc;
}

.image-preview-title {
  color: #475569;

  font-size: 13px;

  font-weight: 700;

  margin-bottom: 10px;
}

.image-preview {
  width: 180px;

  height: 140px;

  border-radius: 10px;

  background: white;

  border:
    1px solid #e2e8f0;
}

.image-preview-error {
  color: #dc2626;

  font-size: 13px;

  margin-top: 8px;
}

.toolbar-card {
  border-radius: 18px;

  background: white;

  border:
    1px solid #e2e8f0;

  box-shadow:
    0 6px 20px
    rgba(15, 23, 42, 0.06);
}

.search-input :deep(.q-field__control) {
  border-radius: 11px;
}

.search-icon {
  color: #64748b;
}

.refresh-btn {
  color: #2563eb;

  border-color:
    #2563eb;

  border-radius: 9px;

  font-weight: 650;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.refresh-btn:hover {
  background:
    #eff6ff;

  transform:
    translateY(-1px);
}

.products-counter {
  color: #64748b;

  font-size: 13px;
}

.counter-number {
  color: #2563eb;

  font-size: 25px;

  font-weight: 800;

  margin-top: 2px;
}

.products-card {
  border-radius: 18px;

  background: white;

  border:
    1px solid #e2e8f0;

  overflow: hidden;

  box-shadow:
    0 6px 20px
    rgba(15, 23, 42, 0.06);
}

.table-header {
  padding:
    22px 24px;
}

.table-title {
  font-size: 20px;

  font-weight: 750;

  color: #0f172a;
}

.table-description {
  color: #64748b;

  font-size: 14px;

  margin-top: 4px;
}

.products-table {
  border-radius: 0;
}

.products-table :deep(thead tr) {
  background:
    #f8fafc;
}

.products-table :deep(th) {
  color: #475569;

  font-weight: 700;

  font-size: 13px;

  border-bottom:
    1px solid #e2e8f0;
}

.products-table :deep(tbody tr) {
  transition:
    background 0.2s ease;
}

.products-table :deep(tbody tr:hover) {
  background:
    #f8faff;
}

.product-name {
  font-weight: 700;

  color: #0f172a;

  font-size: 15px;
}

.product-description {
  color: #64748b;

  font-size: 12px;

  margin-top: 3px;
}

.code-badge {
  background:
    #eff6ff;

  color:
    #2563eb;

  font-weight: 700;

  padding:
    6px 10px;

  border-radius: 7px;

  border:
    1px solid #dbeafe;
}

.price {
  color: #0f172a;

  font-weight: 700;
}

.stock-available {
  background:
    #ecfdf5;

  color:
    #15803d;

  padding:
    6px 10px;

  border-radius: 7px;

  font-weight: 700;

  border:
    1px solid #bbf7d0;
}

.stock-empty {
  background:
    #fef2f2;

  color:
    #dc2626;

  padding:
    6px 10px;

  border-radius: 7px;

  font-weight: 700;

  border:
    1px solid #fecaca;
}

.estado-container {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;
}

.status-active {
  background:
    #ecfdf5;

  color:
    #15803d;

  padding:
    6px 9px;

  border-radius: 7px;

  font-weight: 700;

  border:
    1px solid #bbf7d0;
}

.status-inactive {
  background:
    #fef2f2;

  color:
    #dc2626;

  padding:
    6px 9px;

  border-radius: 7px;

  font-weight: 700;

  border:
    1px solid #fecaca;
}

.toggle-active {
  color:
    #16a34a;
}

.toggle-active:hover {
  background:
    #ecfdf5;
}

.toggle-inactive {
  color:
    #dc2626;
}

.toggle-inactive:hover {
  background:
    #fef2f2;
}

.action-btn {
  margin:
    0 3px;

  transition:
    transform 0.2s ease;
}

.action-btn:hover {
  transform:
    translateY(-1px);
}

.edit-btn {
  color:
    #2563eb;
}

.edit-btn:hover {
  background:
    #eff6ff;
}

@media (max-width: 600px) {

  .productos-header {
    padding:
      25px 18px;
  }

  .header-content {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .page-title {
    font-size: 26px;
  }

  .productos-container {
    padding:
      24px
      16px
      40px;
  }

  .counter-number {
    text-align: left;
  }

  .estado-container {
    flex-direction:
      column;

    gap: 2px;
  }

  .image-preview {
    width: 100%;

    max-width: 250px;
  }

}
</style>

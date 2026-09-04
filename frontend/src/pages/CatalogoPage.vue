<template>
  <q-page class="q-pa-lg">
    <div class="catalogo-container">

      <!-- ENCABEZADO -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-weight-bold">
            Catálogo de productos
          </div>

          <div class="text-grey-7 q-mt-xs">
            Productos disponibles en nuestro catálogo
          </div>
        </div>

        <q-btn
          icon="refresh"
          label="Actualizar"
          color="primary"
          unelevated
          :loading="cargando"
          @click="cargarProductos"
        />
      </div>

      <!-- CARGANDO -->
      <div
        v-if="cargando"
        class="row justify-center q-pa-xl"
      >
        <q-spinner
          color="primary"
          size="50px"
        />
      </div>

      <!-- SIN PRODUCTOS -->
      <div
        v-else-if="productos.length === 0"
        class="column items-center justify-center q-pa-xl"
      >
        <q-icon
          name="inventory_2"
          size="80px"
          color="grey-5"
        />

        <div class="text-h6 text-grey-7 q-mt-md">
          No hay productos disponibles
        </div>
      </div>

      <!-- PRODUCTOS -->
      <div
        v-else
        class="row q-col-gutter-lg"
      >
        <div
          v-for="producto in productos"
          :key="producto._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card
            class="producto-card"
            flat
            bordered
          >

            <!-- IMAGEN -->
            <div class="producto-imagen-container">
              <q-img
                v-if="producto.imagenUrl"
                :src="producto.imagenUrl"
                :alt="producto.nombre"
                fit="contain"
                class="producto-imagen"
              />

              <div
                v-else
                class="producto-sin-imagen"
              >
                <q-icon
                  name="image"
                  size="60px"
                  color="grey-5"
                />

                <div class="text-grey-6 q-mt-sm">
                  Sin imagen
                </div>
              </div>
            </div>

            <q-card-section>

              <!-- CÓDIGO -->
              <div class="text-caption text-grey-6">
                {{ producto.codigo }}
              </div>

              <!-- NOMBRE -->
              <div class="text-h6 text-weight-bold q-mt-xs">
                {{ producto.nombre }}
              </div>

              <!-- DESCRIPCIÓN -->
              <div
                v-if="producto.descripcion"
                class="text-body2 text-grey-7 q-mt-sm"
              >
                {{ producto.descripcion }}
              </div>

              <!-- PRECIO -->
              <div class="text-h6 text-primary text-weight-bold q-mt-md">
                {{ formatearPrecio(producto.precio) }}
              </div>

              <!-- STOCK -->
              <div class="q-mt-sm">
                <q-chip
                  v-if="producto.stock > 0"
                  color="positive"
                  text-color="white"
                  icon="inventory"
                >
                  Stock: {{ producto.stock }}
                </q-chip>

                <q-chip
                  v-else
                  color="negative"
                  text-color="white"
                  icon="remove_shopping_cart"
                >
                  Agotado
                </q-chip>
              </div>

            </q-card-section>

          </q-card>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";

import {
  obtenerProductos,
  type Producto
} from "../services/producto.service";

const $q = useQuasar();

const productos = ref<Producto[]>([]);
const cargando = ref(false);

const cargarProductos = async () => {
  cargando.value = true;

  try {
    productos.value = await obtenerProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);

    $q.notify({
      type: "negative",
      message: "No se pudieron cargar los productos"
    });
  } finally {
    cargando.value = false;
  }
};

const formatearPrecio = (precio: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(precio);
};

onMounted(() => {
  cargarProductos();
});
</script>

<style scoped>
.catalogo-container {
  max-width: 1400px;
  margin: 0 auto;
}

.producto-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.producto-imagen-container {
  height: 230px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.producto-imagen {
  width: 100%;
  height: 100%;
}

.producto-sin-imagen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
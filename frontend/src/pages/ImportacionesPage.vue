<template>
  <q-page class="importaciones-page">
    <!-- HEADER -->
    <div class="importaciones-header">
      <div class="header-content">
        <div
          class="brand-title brand-link"
          @click="irAlInicio"
        >
          Catalogo<span>Bulk</span>
        </div>

        <div class="header-info">
          <div class="page-title">
            Importaciones
          </div>

          <div class="page-description">
            Importa productos masivamente desde archivos CSV o Excel
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="importaciones-container">

      <!-- TARJETA DE SUBIDA -->
      <q-card class="upload-card q-mb-lg">
        <q-card-section class="section-header">
          <div>
            <div class="section-title">
              Importar productos
            </div>

            <div class="section-description">
              Selecciona un archivo CSV o Excel para cargar productos
              masivamente.
            </div>
          </div>

          <q-icon
            name="cloud_upload"
            size="36px"
            class="section-icon"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div
            class="upload-area"
            :class="{ 'upload-area-active': archivoSeleccionado }"
          >
            <q-icon
              name="upload_file"
              size="55px"
              class="upload-icon"
            />

            <div class="upload-title">
              {{
                archivoSeleccionado
                  ? archivoSeleccionado.name
                  : "Selecciona un archivo"
              }}
            </div>

            <div class="upload-description">
              {{
                archivoSeleccionado
                  ? formatearTamano(archivoSeleccionado.size)
                  : "Formatos permitidos: CSV, XLSX y XLS"
              }}
            </div>

            <q-file
              v-model="archivoSeleccionado"
              outlined
              accept=".csv,.xlsx,.xls"
              label="Seleccionar archivo"
              class="file-input"
              :disable="importando"
              @update:model-value="limpiarResultado"
            >
              <template #prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </q-card-section>

        <q-card-section class="format-section">
          <div class="format-title">
            <q-icon
              name="info"
              class="q-mr-sm"
            />
            Formato requerido
          </div>

          <div class="format-text">
            El archivo debe contener las siguientes columnas:
          </div>

          <div class="columns-list">
            <q-chip
              v-for="columna in columnasRequeridas"
              :key="columna"
              dense
              class="column-chip"
            >
              {{ columna }}
            </q-chip>
          </div>

          <div class="format-warning">
            <q-icon
              name="warning"
              size="18px"
              class="q-mr-sm"
            />

            La categoría debe existir previamente en CatalogoBulk.
          </div>
        </q-card-section>

        <q-card-actions
          align="right"
          class="upload-actions"
        >
          <q-btn
            v-if="archivoSeleccionado"
            flat
            label="Quitar archivo"
            icon="close"
            class="cancel-btn"
            :disable="importando"
            @click="quitarArchivo"
          />

          <q-btn
            unelevated
            label="Importar productos"
            icon="cloud_upload"
            class="import-btn"
            :loading="importando"
            :disable="!archivoSeleccionado"
            @click="importarArchivo"
          />
        </q-card-actions>
      </q-card>

      <!-- PROGRESO -->
      <q-card
        v-if="importando || progreso"
        class="progress-card q-mb-lg"
      >
        <q-card-section>
          <div class="progress-header">
            <div>
              <div class="section-title">
                Procesando importación
              </div>

              <div class="section-description">
                {{
                  progreso
                    ? `${progreso.registrosProcesados} de ${progreso.totalRegistros} registros procesados`
                    : "Preparando archivo..."
                }}
              </div>
            </div>

            <div class="progress-percentage">
              {{ progreso?.porcentaje ?? 0 }}%
            </div>
          </div>

          <q-linear-progress
            :value="(progreso?.porcentaje ?? 0) / 100"
            rounded
            size="12px"
            class="import-progress q-mt-md"
          />

          <div
            v-if="progreso"
            class="progress-stats"
          >
            <div class="progress-stat">
              <span>Total</span>
              <strong>
                {{ progreso.totalRegistros }}
              </strong>
            </div>

            <div class="progress-stat success-stat">
              <span>Exitosos</span>
              <strong>
                {{ progreso.registrosExitosos }}
              </strong>
            </div>

            <div class="progress-stat error-stat">
              <span>Con error</span>
              <strong>
                {{ progreso.registrosConError }}
              </strong>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- RESULTADO -->
      <q-card
        v-if="resultado"
        class="result-card q-mb-lg"
      >
        <q-card-section class="result-header">
          <div>
            <div class="section-title">
              Resultado de la importación
            </div>

            <div class="section-description">
              {{ resultado.mensaje }}
            </div>
          </div>

          <q-icon
            :name="
              resultado.registrosConError > 0
                ? 'warning'
                : 'check_circle'
            "
            size="38px"
            :class="
              resultado.registrosConError > 0
                ? 'result-warning-icon'
                : 'result-success-icon'
            "
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-icon total-icon">
                <q-icon name="inventory_2" />
              </div>

              <div>
                <div class="result-stat-label">
                  Total procesado
                </div>

                <div class="result-stat-value">
                  {{ resultado.totalRegistros }}
                </div>
              </div>
            </div>

            <div class="result-stat">
              <div class="result-stat-icon success-icon">
                <q-icon name="check_circle" />
              </div>

              <div>
                <div class="result-stat-label">
                  Exitosos
                </div>

                <div class="result-stat-value success-text">
                  {{ resultado.registrosExitosos }}
                </div>
              </div>
            </div>

            <div class="result-stat">
              <div class="result-stat-icon error-icon">
                <q-icon name="error" />
              </div>

              <div>
                <div class="result-stat-label">
                  Con errores
                </div>

                <div class="result-stat-value error-text">
                  {{ resultado.registrosConError }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- ERRORES -->
        <template
          v-if="
            resultado.errores &&
            resultado.errores.length > 0
          "
        >
          <q-separator />

          <q-card-section>
            <div class="errors-title">
              <q-icon
                name="error_outline"
                class="q-mr-sm"
              />
              Errores encontrados
            </div>

            <div class="errors-table-wrapper">
              <q-table
                flat
                bordered
                :rows="resultado.errores"
                :columns="errorColumns"
                row-key="fila"
                hide-pagination
                :rows-per-page-options="[0]"
                class="errors-table"
              >
                <template #body-cell-fila="props">
                  <q-td :props="props">
                    <q-badge class="row-badge">
                      {{ props.row.fila }}
                    </q-badge>
                  </q-td>
                </template>

                <template #body-cell-mensaje="props">
                  <q-td :props="props">
                    <span class="error-message">
                      {{ props.row.mensaje }}
                    </span>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-card-section>
        </template>
      </q-card>

      <!-- HISTORIAL -->
      <q-card class="history-card">
        <q-card-section class="history-header">
          <div>
            <div class="section-title">
              Historial de importaciones
            </div>

            <div class="section-description">
              Consulta las importaciones realizadas anteriormente.
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="refresh"
            class="refresh-icon-btn"
            :loading="cargandoHistorial"
            @click="cargarHistorial"
          >
            <q-tooltip>
              Actualizar historial
            </q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-table
          flat
          :rows="importaciones"
          :columns="historyColumns"
          row-key="_id"
          :loading="cargandoHistorial"
          no-data-label="No hay importaciones registradas"
          class="history-table"
        >
          <template #body-cell-nombreArchivo="props">
            <q-td :props="props">
              <div class="file-name">
                <q-icon
                  name="description"
                  class="q-mr-sm"
                />
                {{ props.row.nombreArchivo }}
              </div>
            </q-td>
          </template>

          <template #body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                :class="obtenerClaseEstado(props.row.estado)"
              >
                <q-icon
                  :name="obtenerIconoEstado(props.row.estado)"
                  size="15px"
                  class="q-mr-xs"
                />

                {{ obtenerTextoEstado(props.row.estado) }}
              </q-badge>
            </q-td>
          </template>

          <template #body-cell-progreso="props">
            <q-td :props="props">
              <div class="history-progress">
                <div class="history-progress-text">
                  {{ props.row.registrosProcesados }} /
                  {{ props.row.totalRegistros }}
                </div>

                <q-linear-progress
                  :value="
                    props.row.totalRegistros > 0
                      ? props.row.registrosProcesados /
                        props.row.totalRegistros
                      : 0
                  "
                  rounded
                  size="7px"
                  class="history-progress-bar"
                />
              </div>
            </q-td>
          </template>

          <template #body-cell-exitosos="props">
            <q-td :props="props">
              <span class="success-number">
                {{ props.row.registrosExitosos }}
              </span>
            </q-td>
          </template>

          <template #body-cell-errores="props">
            <q-td :props="props">
              <span
                :class="
                  props.row.registrosConError > 0
                    ? 'error-number'
                    : 'success-number'
                "
              >
                {{ props.row.registrosConError }}
              </span>
            </q-td>
          </template>

          <template #body-cell-fecha="props">
            <q-td :props="props">
              {{ formatearFecha(props.row.createdAt) }}
            </q-td>
          </template>

          <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                class="view-btn"
                @click="verImportacion(props.row)"
              >
                <q-tooltip>
                  Ver detalles
                </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                icon="delete"
                class="delete-btn"
                :loading="eliminandoId === props.row._id"
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
    </div>

    <!-- DIÁLOGO DETALLES -->
    <q-dialog v-model="mostrarDetalles">
      <q-card class="details-dialog">
        <q-card-section class="dialog-header">
          <div>
            <div class="section-title">
              Detalles de importación
            </div>

            <div class="section-description">
              Información de la importación seleccionada.
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            @click="mostrarDetalles = false"
          />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="importacionSeleccionada">
          <div class="detail-file">
            <q-icon
              name="description"
              size="30px"
            />

            <div>
              <div class="detail-file-name">
                {{ importacionSeleccionada.nombreArchivo }}
              </div>

              <div class="detail-file-date">
                {{
                  formatearFecha(
                    importacionSeleccionada.createdAt
                  )
                }}
              </div>
            </div>
          </div>

          <div class="detail-grid q-mt-lg">
            <div class="detail-item">
              <span>Estado</span>

              <q-badge
                :class="
                  obtenerClaseEstado(
                    importacionSeleccionada.estado
                  )
                "
              >
                {{
                  obtenerTextoEstado(
                    importacionSeleccionada.estado
                  )
                }}
              </q-badge>
            </div>

            <div class="detail-item">
              <span>Total registros</span>
              <strong>
                {{ importacionSeleccionada.totalRegistros }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Procesados</span>
              <strong>
                {{ importacionSeleccionada.registrosProcesados }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Exitosos</span>
              <strong class="success-text">
                {{ importacionSeleccionada.registrosExitosos }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Con errores</span>
              <strong class="error-text">
                {{ importacionSeleccionada.registrosConError }}
              </strong>
            </div>
          </div>

          <template
            v-if="
              importacionSeleccionada.errores &&
              importacionSeleccionada.errores.length
            "
          >
            <q-separator class="q-my-lg" />

            <div class="errors-title">
              Errores
            </div>

            <div class="detail-errors">
              <div
                v-for="error in importacionSeleccionada.errores"
                :key="`${error.fila}-${error.mensaje}`"
                class="detail-error"
              >
                <q-badge class="row-badge">
                  Fila {{ error.fila }}
                </q-badge>

                <span>
                  {{ error.mensaje }}
                </span>
              </div>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIÁLOGO ELIMINAR -->
    <q-dialog
      v-model="mostrarDialogoEliminar"
      persistent
    >
      <q-card class="delete-dialog">
        <q-card-section>
          <div class="dialog-delete-icon">
            <q-icon
              name="delete_outline"
              size="30px"
            />
          </div>

          <div class="text-h6 q-mt-md">
            Eliminar importación
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          ¿Estás seguro de que deseas eliminar la importación

          <strong>
            {{ importacionAEliminar?.nombreArchivo }}
          </strong>
          ?

          <div class="text-grey-7 q-mt-sm">
            Esta acción no se puede deshacer.
          </div>
        </q-card-section>

        <q-card-actions
          align="right"
          class="q-pa-md"
        >
          <q-btn
            flat
            label="Cancelar"
            class="cancel-btn"
            :disable="eliminandoId !== null"
            @click="cancelarEliminacion"
          />

          <q-btn
            unelevated
            label="Eliminar"
            icon="delete"
            color="negative"
            :loading="eliminandoId !== null"
            @click="eliminarImportacionSeleccionada"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import {
  eliminarImportacion,
  obtenerImportaciones,
  obtenerImportacionPorId,
  obtenerProgresoImportacion,
  subirArchivoImportacion,
  type ErrorImportacion,
  type Importacion,
  type ProgresoImportacion,
  type ResultadoImportacion
} from "../services/import.service";

const $q = useQuasar();
const router = useRouter();

const archivoSeleccionado = ref<File | null>(null);

const importando = ref(false);
const cargandoHistorial = ref(false);

const importaciones = ref<Importacion[]>([]);

const resultado = ref<ResultadoImportacion | null>(null);
const progreso = ref<ProgresoImportacion | null>(null);

const importacionSeleccionada =
  ref<Importacion | null>(null);

const mostrarDetalles = ref(false);

const mostrarDialogoEliminar = ref(false);
const importacionAEliminar =
  ref<Importacion | null>(null);

const eliminandoId = ref<string | null>(null);

const columnasRequeridas = [
  "codigo",
  "nombre",
  "descripcion",
  "precio",
  "stock",
  "categoria",
  "proveedor"
];

const errorColumns = [
  {
    name: "fila",
    label: "Fila",
    field: "fila",
    align: "center" as const
  },
  {
    name: "mensaje",
    label: "Error",
    field: "mensaje",
    align: "left" as const
  }
];

const historyColumns = [
  {
    name: "nombreArchivo",
    label: "Archivo",
    field: "nombreArchivo",
    align: "left" as const
  },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center" as const
  },
  {
    name: "progreso",
    label: "Procesados",
    field: "registrosProcesados",
    align: "center" as const
  },
  {
    name: "exitosos",
    label: "Exitosos",
    field: "registrosExitosos",
    align: "center" as const
  },
  {
    name: "errores",
    label: "Errores",
    field: "registrosConError",
    align: "center" as const
  },
  {
    name: "fecha",
    label: "Fecha",
    field: "createdAt",
    align: "center" as const
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center" as const
  }
];

const irAlInicio = () => {
  router.push("/dashboard");
};

const limpiarResultado = () => {
  resultado.value = null;
  progreso.value = null;
};

const quitarArchivo = () => {
  archivoSeleccionado.value = null;
  limpiarResultado();
};

const formatearTamano = (bytes: number) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const unidades = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const indice = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(bytes / Math.pow(1024, indice)).toFixed(2)} ${unidades[indice]}`;
};

const importarArchivo = async () => {
  if (!archivoSeleccionado.value) {
    return;
  }

  const archivo = archivoSeleccionado.value;

  const extensionesPermitidas = [
    ".csv",
    ".xlsx",
    ".xls"
  ];

  const extension = archivo.name
    .substring(archivo.name.lastIndexOf("."))
    .toLowerCase();

  if (!extensionesPermitidas.includes(extension)) {
    $q.notify({
      type: "warning",
      message: "Solo se permiten archivos CSV, XLSX o XLS",
      position: "top"
    });

    return;
  }

  if (archivo.size > 50 * 1024 * 1024) {
    $q.notify({
      type: "warning",
      message: "El archivo no puede superar los 50 MB",
      position: "top"
    });

    return;
  }

  try {
    importando.value = true;
    resultado.value = null;
    progreso.value = null;

    const respuesta =
      await subirArchivoImportacion(archivo);

    resultado.value = respuesta;

    await cargarHistorial();

    $q.notify({
      type:
        respuesta.registrosConError > 0
          ? "warning"
          : "positive",
      message:
        respuesta.registrosConError > 0
          ? "Importación completada con algunos errores"
          : "Importación completada correctamente",
      position: "top"
    });
  } catch (error: any) {
    console.error(
      "Error importando archivo:",
      error
    );

    const mensaje =
      error?.response?.data?.mensaje ||
      error?.response?.data?.message ||
      "No se pudo procesar el archivo";

    $q.notify({
      type: "negative",
      message: mensaje,
      position: "top"
    });
  } finally {
    importando.value = false;
  }
};

const cargarHistorial = async () => {
  try {
    cargandoHistorial.value = true;

    importaciones.value =
      await obtenerImportaciones();
  } catch (error) {
    console.error(
      "Error cargando historial:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudo cargar el historial de importaciones",
      position: "top"
    });
  } finally {
    cargandoHistorial.value = false;
  }
};

const consultarProgreso = async (
  importacionId: string
) => {
  try {
    progreso.value =
      await obtenerProgresoImportacion(
        importacionId
      );
  } catch (error) {
    console.error(
      "Error consultando progreso:",
      error
    );
  }
};

const verImportacion = async (
  importacion: Importacion
) => {
  try {
    const detalle =
      await obtenerImportacionPorId(
        importacion._id
      );

    importacionSeleccionada.value =
      detalle;

    mostrarDetalles.value = true;
  } catch (error) {
    console.error(
      "Error obteniendo detalles:",
      error
    );

    $q.notify({
      type: "negative",
      message:
        "No se pudieron obtener los detalles de la importación",
      position: "top"
    });
  }
};

const confirmarEliminar = (
  importacion: Importacion
) => {
  importacionAEliminar.value =
    importacion;

  mostrarDialogoEliminar.value = true;
};

const cancelarEliminacion = () => {
  mostrarDialogoEliminar.value = false;
  importacionAEliminar.value = null;
};

const eliminarImportacionSeleccionada =
  async () => {
    if (!importacionAEliminar.value) {
      return;
    }

    const id =
      importacionAEliminar.value._id;

    try {
      eliminandoId.value = id;

      await eliminarImportacion(id);

      $q.notify({
        type: "positive",
        message:
          "Importación eliminada correctamente",
        position: "top"
      });

      mostrarDialogoEliminar.value = false;
      importacionAEliminar.value = null;

      await cargarHistorial();
    } catch (error: any) {
      console.error(
        "Error eliminando importación:",
        error
      );

      const mensaje =
        error?.response?.data?.mensaje ||
        "No se pudo eliminar la importación";

      $q.notify({
        type: "negative",
        message: mensaje,
        position: "top"
      });
    } finally {
      eliminandoId.value = null;
    }
  };

const obtenerTextoEstado = (
  estado: Importacion["estado"]
) => {
  const textos = {
    pendiente: "Pendiente",
    procesando: "Procesando",
    completado: "Completado",
    error: "Con errores"
  };

  return textos[estado];
};

const obtenerClaseEstado = (
  estado: Importacion["estado"]
) => {
  return `status-${estado}`;
};

const obtenerIconoEstado = (
  estado: Importacion["estado"]
) => {
  const iconos = {
    pendiente: "schedule",
    procesando: "sync",
    completado: "check_circle",
    error: "error"
  };

  return iconos[estado];
};

const formatearFecha = (
  fecha?: string
) => {
  if (!fecha) {
    return "—";
  }

  return new Date(fecha).toLocaleString(
    "es-CO",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  );
};

onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.importaciones-page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #f8fafc 0%,
      #eef2ff 100%
    );
}

.importaciones-header {
  background:
    linear-gradient(
      135deg,
      #0f172a 0%,
      #172554 50%,
      #312e81 100%
    );
  color: white;
  padding: 30px 24px;
  box-shadow:
    0 6px 25px
    rgba(15, 23, 42, 0.25);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 28px;
}

.brand-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -1px;
  flex-shrink: 0;
}

.brand-title span {
  color: #60a5fa;
}

.brand-link {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.brand-link:hover {
  transform: scale(1.03);
  opacity: 0.9;
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: 27px;
  font-weight: 750;
}

.page-description {
  margin-top: 4px;
  color: #dbeafe;
  font-size: 14px;
}

.importaciones-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 24px 50px;
}

.upload-card,
.progress-card,
.result-card,
.history-card {
  border-radius: 18px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 5px 20px
    rgba(15, 23, 42, 0.07);
  overflow: hidden;
}

.section-header,
.result-header,
.history-header,
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 750;
  color: #0f172a;
}

.section-description {
  color: #64748b;
  font-size: 14px;
  margin-top: 4px;
}

.section-icon {
  color: #2563eb;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 35px 25px;
  text-align: center;
  background: #f8fafc;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.upload-area-active {
  border-color: #6366f1;
  background: #eef2ff;
}

.upload-icon {
  color: #4f46e5;
}

.upload-title {
  margin-top: 12px;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  word-break: break-word;
}

.upload-description {
  margin-top: 5px;
  color: #64748b;
  font-size: 13px;
}

.file-input {
  max-width: 450px;
  margin: 20px auto 0;
}

.file-input :deep(.q-field__control) {
  border-radius: 11px;
  background: white;
}

.format-section {
  padding: 20px 24px;
  background: #fafbff;
}

.format-title {
  display: flex;
  align-items: center;
  color: #1e3a8a;
  font-weight: 700;
}

.format-text {
  margin-top: 10px;
  color: #64748b;
  font-size: 14px;
}

.columns-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

.column-chip {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 650;
}

.format-warning {
  display: flex;
  align-items: center;
  margin-top: 15px;
  color: #92400e;
  background: #fef3c7;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13px;
}

.upload-actions {
  padding: 16px 24px;
}

.cancel-btn {
  color: #64748b;
  border-radius: 9px;
}

.import-btn {
  color: white;
  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );
  border-radius: 9px;
  font-weight: 700;
  box-shadow:
    0 6px 15px
    rgba(37, 99, 235, 0.25);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-percentage {
  font-size: 28px;
  font-weight: 800;
  color: #4f46e5;
}

.import-progress :deep(.q-linear-progress__track) {
  background: #e2e8f0;
}

.progress-stats {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.progress-stat {
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.progress-stat span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.progress-stat strong {
  display: block;
  margin-top: 4px;
  color: #0f172a;
  font-size: 20px;
}

.success-stat strong {
  color: #16a34a;
}

.error-stat strong {
  color: #dc2626;
}

.result-success-icon {
  color: #16a34a;
}

.result-warning-icon {
  color: #f59e0b;
}

.result-stats {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 18px;
}

.result-stat {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
  background: #f8fafc;
  border-radius: 14px;
}

.result-stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.total-icon {
  background: #dbeafe;
  color: #2563eb;
}

.success-icon {
  background: #dcfce7;
  color: #16a34a;
}

.error-icon {
  background: #fee2e2;
  color: #dc2626;
}

.result-stat-label {
  color: #64748b;
  font-size: 12px;
}

.result-stat-value {
  color: #0f172a;
  font-size: 23px;
  font-weight: 800;
  margin-top: 2px;
}

.success-text {
  color: #16a34a !important;
}

.error-text {
  color: #dc2626 !important;
}

.errors-title {
  display: flex;
  align-items: center;
  color: #b91c1c;
  font-size: 16px;
  font-weight: 750;
  margin-bottom: 14px;
}

.errors-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
}

.errors-table :deep(thead tr) {
  background: #fef2f2;
}

.row-badge {
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 700;
}

.error-message {
  color: #475569;
}

.refresh-icon-btn {
  color: #2563eb;
}

.history-table :deep(thead tr) {
  background: #f8fafc;
}

.history-table :deep(th) {
  color: #475569;
  font-weight: 700;
  font-size: 13px;
}

.history-table :deep(tbody tr:hover) {
  background: #eff6ff;
}

.file-name {
  display: flex;
  align-items: center;
  color: #0f172a;
  font-weight: 650;
}

.file-name .q-icon {
  color: #4f46e5;
}

.history-progress {
  min-width: 120px;
}

.history-progress-text {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 5px;
}

.history-progress-bar :deep(.q-linear-progress__track) {
  background: #e2e8f0;
}

.success-number {
  color: #16a34a;
  font-weight: 750;
}

.error-number {
  color: #dc2626;
  font-weight: 750;
}

.view-btn {
  color: #4f46e5;
}

.view-btn:hover {
  background: #eef2ff;
}

.delete-btn {
  color: #dc2626;
}

.delete-btn:hover {
  background: #fef2f2;
}

.status-pendiente {
  background: #fef3c7;
  color: #92400e;
  padding: 6px 9px;
  border-radius: 7px;
}

.status-procesando {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 9px;
  border-radius: 7px;
}

.status-completado {
  background: #dcfce7;
  color: #15803d;
  padding: 6px 9px;
  border-radius: 7px;
}

.status-error {
  background: #fee2e2;
  color: #dc2626;
  padding: 6px 9px;
  border-radius: 7px;
}

.details-dialog {
  width: 700px;
  max-width: 90vw;
  border-radius: 18px;
}

.detail-file {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 13px;
  color: #4f46e5;
}

.detail-file-name {
  color: #0f172a;
  font-weight: 700;
  word-break: break-word;
}

.detail-file-date {
  color: #64748b;
  font-size: 12px;
  margin-top: 3px;
}

.detail-grid {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
}

.detail-item span {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 5px;
}

.detail-item strong {
  color: #0f172a;
  font-size: 18px;
}

.detail-errors {
  max-height: 250px;
  overflow-y: auto;
}

.detail-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
  color: #475569;
  font-size: 13px;
}

.delete-dialog {
  min-width: 360px;
  max-width: 450px;
  border-radius: 18px;
}

.dialog-delete-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fee2e2;
  color: #dc2626;
}

@media (max-width: 700px) {
  .importaciones-header {
    padding: 25px 18px;
  }

  .header-content {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .brand-title {
    font-size: 25px;
  }

  .importaciones-container {
    padding: 24px 16px 40px;
  }

  .progress-stats,
  .result-stats {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .upload-actions {
    flex-direction: column;
  }

  .upload-actions .q-btn {
    width: 100%;
  }

  .delete-dialog {
    min-width: unset;
    width: calc(100vw - 30px);
  }
}
</style>
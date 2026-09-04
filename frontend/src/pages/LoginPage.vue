<template>
  <q-page class="login-page flex flex-center">

    <!-- FONDO DECORATIVO -->
    <div class="background-shape shape-one"></div>
    <div class="background-shape shape-two"></div>

    <!-- TARJETA LOGIN -->
    <q-card class="login-card">

      <!-- CABECERA -->
      <q-card-section class="login-header text-center">

        <div class="logo-container">
          <q-icon
            name="inventory_2"
            size="42px"
          />
        </div>

        <div class="login-title">
          CatalogoBulk
        </div>

        <div class="login-subtitle">
          Sistema de gestión de productos
        </div>

      </q-card-section>


      <!-- FORMULARIO -->
      <q-card-section class="login-form">

        <div class="welcome-text">
          Bienvenido 👋
        </div>

        <div class="instruction-text">
          Inicia sesión para continuar
        </div>


        <q-form
          @submit.prevent="login"
          class="q-gutter-lg"
        >

          <!-- CORREO -->
          <q-input
            v-model="email"
            type="email"
            label="Correo electrónico"
            outlined
            class="custom-input"
            :rules="[
              (val) =>
                !!val ||
                'El correo es obligatorio',

              (val) =>
                /.+@.+\..+/.test(val) ||
                'Correo no válido'
            ]"
          >

            <template #prepend>
              <q-icon
                name="email"
                class="input-icon"
              />
            </template>

          </q-input>


          <!-- CONTRASEÑA -->
          <q-input
            v-model="password"
            :type="
              mostrarPassword
                ? 'text'
                : 'password'
            "
            label="Contraseña"
            outlined
            class="custom-input"
            :rules="[
              (val) =>
                !!val ||
                'La contraseña es obligatoria'
            ]"
          >

            <template #prepend>
              <q-icon
                name="lock"
                class="input-icon"
              />
            </template>

            <template #append>

              <q-icon
                :name="
                  mostrarPassword
                    ? 'visibility_off'
                    : 'visibility'
                "
                class="cursor-pointer password-icon"
                @click="
                  mostrarPassword =
                    !mostrarPassword
                "
              />

            </template>

          </q-input>


          <!-- BOTÓN -->
          <q-btn
            type="submit"
            label="Iniciar sesión"
            icon="login"
            class="login-button full-width"
            size="lg"
            :loading="cargando"
          />

        </q-form>

      </q-card-section>


      <!-- PIE -->
      <q-card-section class="login-footer text-center">

        <q-icon
          name="security"
          size="16px"
        />

        <span>
          Acceso seguro al sistema
        </span>

      </q-card-section>

    </q-card>

  </q-page>
</template>


<script setup lang="ts">

import { ref } from "vue";

import { useQuasar } from "quasar";

import { useRouter } from "vue-router";

import { iniciarSesion } from "../services/auth.service";


const $q = useQuasar();

const router = useRouter();


const email = ref("");

const password = ref("");

const mostrarPassword = ref(false);

const cargando = ref(false);


// ==========================================
// LOGIN
// ==========================================

const login = async () => {

  cargando.value = true;

  try {

    const respuesta = await iniciarSesion({

      email: email.value,

      password: password.value,

    });


    // GUARDAR TOKEN
    localStorage.setItem(
      "token",
      respuesta.token
    );


    // GUARDAR USUARIO
    localStorage.setItem(
      "usuario",
      JSON.stringify(respuesta.usuario)
    );


    console.log(
      "Usuario:",
      respuesta.usuario
    );


    console.log(
      "Token:",
      respuesta.token
    );


    // NOTIFICACIÓN
    $q.notify({

      type: "positive",

      message:
        "Inicio de sesión exitoso",

      position: "top",

    });


    // IR AL DASHBOARD
    router.push("/dashboard");


  } catch (error: any) {

    console.error(
      "ERROR COMPLETO:",
      error
    );


    console.error(
      "RESPUESTA:",
      error.response
    );


    console.error(
      "DATOS:",
      error.response?.data
    );


    console.error(
      "MENSAJE:",
      error.message
    );


    $q.notify({

      type: "negative",

      message:
        error.response?.data?.mensaje ||

        error.message ||

        "Error al iniciar sesión",

      position: "top",

    });


  } finally {

    cargando.value = false;

  }

};

</script>


<style scoped>

/* ==========================================
   PÁGINA
========================================== */

.login-page {

  min-height: 100vh;

  position: relative;

  overflow: hidden;

  background:
    radial-gradient(
      circle at top left,
      #1e40af 0%,
      transparent 35%
    ),

    radial-gradient(
      circle at bottom right,
      #312e81 0%,
      transparent 40%
    ),

    #0f172a;

}


/* ==========================================
   FORMAS DEL FONDO
========================================== */

.background-shape {

  position: absolute;

  border-radius: 50%;

  filter: blur(2px);

  opacity: 0.35;

}


.shape-one {

  width: 420px;

  height: 420px;

  background: #2563eb;

  top: -180px;

  left: -150px;

}


.shape-two {

  width: 500px;

  height: 500px;

  background: #7c3aed;

  bottom: -250px;

  right: -180px;

}


/* ==========================================
   TARJETA
========================================== */

.login-card {

  width: 100%;

  max-width: 440px;

  position: relative;

  z-index: 2;

  overflow: hidden;

  border-radius: 24px;

  background: rgba(255, 255, 255, 0.97);

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.35);

}


/* ==========================================
   CABECERA
========================================== */

.login-header {

  padding-top: 35px;

  padding-bottom: 20px;

}


/* LOGO */

.logo-container {

  width: 76px;

  height: 76px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  color: white;

  box-shadow:
    0 10px 25px rgba(37, 99, 235, 0.35);

}


/* TÍTULO */

.login-title {

  font-size: 30px;

  font-weight: 800;

  letter-spacing: -0.5px;

  color: #111827;

}


/* SUBTÍTULO */

.login-subtitle {

  margin-top: 6px;

  color: #6b7280;

  font-size: 14px;

}


/* ==========================================
   FORMULARIO
========================================== */

.login-form {

  padding: 10px 38px 25px;

}


.welcome-text {

  font-size: 21px;

  font-weight: 700;

  color: #111827;

}


.instruction-text {

  margin-top: 4px;

  margin-bottom: 25px;

  color: #6b7280;

  font-size: 14px;

}


/* ==========================================
   INPUTS
========================================== */

.custom-input :deep(.q-field__control) {

  border-radius: 12px;

  height: 58px;

}


.custom-input :deep(.q-field__label) {

  color: #6b7280;

}


.custom-input :deep(.q-field--focused
  .q-field__label) {

  color: #2563eb;

}


.input-icon {

  color: #64748b;

}


.password-icon {

  color: #64748b;

  transition:
    transform 0.2s ease;

}


.password-icon:hover {

  transform: scale(1.1);

}


/* ==========================================
   BOTÓN LOGIN
========================================== */

.login-button {

  height: 56px;

  border-radius: 12px;

  color: white;

  font-weight: 700;

  font-size: 16px;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #4f46e5
    );

  box-shadow:
    0 8px 20px
    rgba(37, 99, 235, 0.3);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

}


.login-button:hover {

  transform: translateY(-2px);

  box-shadow:
    0 12px 25px
    rgba(37, 99, 235, 0.4);

}


/* ==========================================
   PIE
========================================== */

.login-footer {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 15px;

  border-top: 1px solid #e5e7eb;

  color: #64748b;

  font-size: 12px;

}


/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 500px) {

  .login-card {

    width: calc(100% - 30px);

  }


  .login-form {

    padding-left: 25px;

    padding-right: 25px;

  }

}

</style>


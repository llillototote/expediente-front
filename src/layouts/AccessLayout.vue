<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <div class="banner"></div>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../../public/icons/favicon-128x128.png" />
          </q-avatar>
          CADENA SUMINISTRO
        </q-toolbar-title>

        <q-btn dense flat label="registrarse" :to="{ name: 'register' }" />
        <q-btn dense flat label="autenticarse" :to="{ name: 'login' }" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition
          appear
          :enter-active-class="route.meta.transition_enter || 'animated fadeIn'"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <q-footer elevated class="bg-primary text-white">
      <q-toolbar class="row text-center">
        <!-- <q-toolbar-title> </q-toolbar-title> -->

        <div class="col-4">
          <q-btn
            no-caps
            flat
            color="primary"
            text-color="white"
            label="Descargar Locaciones de Copextel."
          />
        </div>

        <div class="col-4">
          <q-btn
            no-caps
            flat
            color="primary"
            text-color="white"
            label="Descargar Ficha cliente"
          />
        </div>

        <div class="col-4">
          <q-btn
            no-caps
            flat
            color="primary"
            text-color="white"
            label="Contáctenos"
          />
        </div>

        <!---->
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts" setup></script>
<style>
.banner {
  height: 120px;
  background-image: url('../../public/banner.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

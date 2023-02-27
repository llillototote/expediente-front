<script lang="ts" setup>
import { NAMESROUTES } from 'src/services/external/permisionDTO';
</script>
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
        <!---->
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<style>
.banner {
  height: 140px;
  background-image: url('../../public/1200.png');
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 389px) {
  .banner {
    height: 90px;
    background-image: url('../../public/320.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media (min-width: 390px) and (max-width: 480px) {
  .banner {
    height: 60px;
    background-image: url('../../public/480.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media (min-width: 481px) and (max-width: 506px) {
  .banner {
    height: 70px;
    background-image: url('../../public/768.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media (min-width: 507px) and (max-width: 727px) {
  .banner {
    height: 90px;
    background-image: url('../../public/768.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

@media (min-width: 727px) and (max-width: 1024px) {
  .banner {
    height: 130px;
    background-image: url('../../public/768.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>

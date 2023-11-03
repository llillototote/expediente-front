<script lang="ts" setup></script>
<template>
  <q-layout view="lHh Lpr lFf">
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
  </q-layout>
</template>
<style></style>

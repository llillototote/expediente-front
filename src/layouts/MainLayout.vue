<script setup lang="ts">
import { NAMESROUTES } from 'src/config/permisionDTO';
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import load from 'components/generic/loading/loadingAndConfiguring.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { usePermissionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { revisarPermisosRouter } from 'src/services/util';

const userStore = useUserStore();
const permissionStore = usePermissionStore();
const loadingStore = useLoadingStore();
const router = useRouter();

const leftDrawerOpen = ref(false);

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Inicio',
    caption: 'Descripción del módulo de inicio',
    icon: 'home',
    link: NAMESROUTES.APP_HOME,
  },
];

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_USER_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Usuarios',
    caption: 'Usuarios internos',
    icon: 'admin_panel_settings',
    link: NAMESROUTES.APP_USER_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_ROLE_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Roles',
    caption: 'Roles con permisos asociadas',
    icon: 'add_moderator',
    link: NAMESROUTES.APP_ROLE_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_PERMISSION_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Permisos',
    caption: 'Descripción del módulo de permisos',
    icon: 'front_hand',
    link: NAMESROUTES.APP_PERMISSION_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_DEPARTMENT_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Departamentos',
    caption: 'Gestion de departamentos',
    icon: 'paid',
    link: NAMESROUTES.APP_DEPARTMENT_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_POSITION_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Puestos',
    caption: 'Gestion de puestos de trabajo',
    icon: 'paid',
    link: NAMESROUTES.APP_POSITION_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_EMPLOYEE_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Empleados',
    caption: 'Gestion de empleados',
    icon: 'paid',
    link: NAMESROUTES.APP_EMPLOYEE_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_RECORD_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Expedientes',
    caption: 'Gestion de expedientes',
    icon: 'paid',
    link: NAMESROUTES.APP_RECORD_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_DOCUMENT_LIST,
    permissionStore.getCodesAssigment
  )
)
  essentialLinks.push({
    title: 'Documentos',
    caption: 'Gestion de documentos asociados a los expedientes',
    icon: 'paid',
    link: NAMESROUTES.APP_DOCUMENT_LIST,
  });

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  userStore.logoutSuccess();
  permissionStore.destroyPermisions();
  router.push({ name: NAMESROUTES.LOGIN });
}
</script>
<template>
  <q-layout view="hHh lpR fFf">
    <load
      :triger="loadingStore.getStatus"
      :key="loadingStore.getStatus"
      message="Cargando..."
    />
    <q-header reveal elevated class="bg-primary text-white">
      <div class="banner"></div>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="../../public/icons/favicon-128x128.png" />
          </q-avatar>
          COPEXTEL
        </q-toolbar-title>

        <q-btn
          icon="account_circle"
          type="button"
          color="white"
          flat
          round
          class="q-ml-sm"
        >
          <q-menu transition-show="flip-right" transition-hide="scale">
            <div class="row no-wrap q-pa-md">
              <div class="column items-center q-mt-sm">
                <q-avatar size="72px" color="primary" text-color="white">
                  {{ userStore.username[0] }}
                </q-avatar>
              </div>

              <q-separator vertical inset class="q-mx-sm" />

              <div class="column">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label caption>{{ userStore.email }}</q-item-label>
                      <q-item-label>{{ userStore.username }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <q-separator vertical inset class="q-mx-sm" />

              <div class="column">
                <q-btn
                  @click="logout"
                  class="q-mt-sm"
                  color="red"
                  icon="power_settings_new"
                  v-close-popup
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list dense class="rounded-borders text-primary">
        <q-item-label header> CADENA SUMINISTROS </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style></style>

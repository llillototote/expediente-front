<script setup lang="ts">
import { NAMESROUTES } from 'src/services/external/permisionDTO';
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import load from 'components/generic/loading/loadingAndConfiguring.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { revisarPermisosRouter } from 'src/services/util';

const userStore = useUserStore();
const permisionStore = usePermisionStore();
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
  userStore.getProfile.authorities.find((aut) =>
    ['ROLE_ADMINISTRADOR', 'ROLE_SUPERADMIN'].includes(aut.authority)
  )
) {
  if (
    revisarPermisosRouter(
      NAMESROUTES.APP_USER_LIST,
      userStore.getProfile.listPermits
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
      NAMESROUTES.APP_USER_CLIENT_LIST,
      userStore.getProfile.listPermits
    )
  )
    essentialLinks.push({
      title: 'Usuarios Clientes',
      caption: 'Usuarios externos',
      icon: 'admin_panel_settings',
      link: NAMESROUTES.APP_USER_CLIENT_LIST,
    });
  if (
    revisarPermisosRouter(
      NAMESROUTES.APP_ROLE_LIST,
      userStore.getProfile.listPermits
    )
  )
    essentialLinks.push({
      title: 'Roles',
      caption: 'Roles con permisos asociadas',
      icon: 'add_moderator',
      link: NAMESROUTES.APP_ROLE_LIST,
    });
}

if (
  userStore.getProfile.authorities.find(
    (aut) => aut.authority == 'ROLE_SUPERADMIN'
  )
) {
  essentialLinks.push({
    title: 'Permisos',
    caption: 'Descripción del módulo de permisos',
    icon: 'front_hand',
    link: NAMESROUTES.APP_PERMISION_LIST,
  });
  essentialLinks.push({
    title: 'División',
    icon: 'approval',
    link: NAMESROUTES.APP_DIVISION_LIST,
  });
  essentialLinks.push({
    title: 'Empresas',
    icon: 'gite',
    link: NAMESROUTES.APP_COMPANY_LIST,
  });
  essentialLinks.push({
    title: 'Casas Matrices',
    icon: 'cabin',
    link: NAMESROUTES.APP_MATRIX_LIST,
  });
}

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_CLIENT_LIST,
    userStore.getProfile.listPermits
  )
)
  essentialLinks.push({
    title: 'Clientes',
    caption: 'Clientes asociados a las demandas',
    icon: 'engineering',
    link: NAMESROUTES.APP_CLIENT_LIST,
  });

if (
  revisarPermisosRouter(
    NAMESROUTES.APP_PRODUCT_LIST,
    userStore.getProfile.listPermits
  )
)
  essentialLinks.push({
    title: 'Productos',
    caption: 'Productos para la confección de demandas',
    icon: 'inventory',
    link: NAMESROUTES.APP_PRODUCT_LIST,
  });

essentialLinks.push({
  title: 'Atención Demandas',
  caption: 'Demandas confeccionadas por clientes',
  icon: 'paid',
  link: NAMESROUTES.APP_DEMAND_LIST,
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  userStore.logoutSuccess();
  permisionStore.destroyPermisions();
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
                  US
                </q-avatar>
              </div>

              <q-separator vertical inset class="q-mx-sm" />

              <div class="column">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label caption>{{
                        userStore.getProfile.userName
                      }}</q-item-label>
                      <q-item-label>{{
                        userStore.getProfile.namePerson
                      }}</q-item-label>
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

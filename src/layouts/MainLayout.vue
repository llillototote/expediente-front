<template>
  <q-layout view="hHh lpR fFf">
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
        <q-item clickable>
          <q-item-section>Gestionar Demanda</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list>
              <q-item dense clickable>
                <q-item-section>Crear solicitud</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <q-menu auto-close anchor="top end" self="top start">
                  <q-list>
                    <q-item dense clickable>
                      <q-item-section>Solicitud de Productos</q-item-section>
                    </q-item>
                    <q-item dense clickable>
                      <q-item-section
                        >Solicitud de Servicios Tecnológicas</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item dense clickable>
                <q-item-section>Modificar Solicitud</q-item-section>
              </q-item>
              <q-item dense clickable>
                <q-item-section>Aprobar Demanda</q-item-section>
              </q-item>
              <q-item dense clickable>
                <q-item-section>Descargar Demanda</q-item-section>
              </q-item>
              <q-item dense clickable>
                <q-item-section>Atender Solicitud</q-item-section>
              </q-item>
              <q-item dense clickable>
                <q-item-section>Clasificar Producto</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-separator />

        <q-item clickable v-close-popup>
          <q-item-section>Compra</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Venta</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
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

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { usePermisionStore } from 'src/stores/permision-store';

const userStore = useUserStore();
const permisionStore = usePermisionStore();
const router = useRouter();

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

const link = ref('');

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Inicio',
    caption: 'Descripcion del módulo de inicio',
    icon: 'home',
    link: '/app',
  },
];

if (
  userStore.getProfile.authorities.find((aut) =>
    ['ROLE_ADMINISTRADOR', 'ROLE_SUPERADMIN'].includes(aut.authority)
  )
) {
  essentialLinks.push({
    title: 'Usuarios',
    caption: 'Descripcion del módulo de usuarios',
    icon: 'admin_panel_settings',
    link: '/app/user',
  });
  essentialLinks.push({
    title: 'Roles',
    caption: 'Descripcion del módulo de roles',
    icon: 'add_moderator',
    link: '/app/role',
  });
}

if (
  userStore.getProfile.authorities.find(
    (aut) => aut.authority == 'ROLE_SUPERADMIN'
  )
) {
  essentialLinks.push({
    title: 'Permisos',
    caption: 'Descripcion del módulo de permisos',
    icon: 'front_hand',
    link: '/app/permision',
  });
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  userStore.logoutSuccess();
  permisionStore.destroyPermisions();
  router.push({ name: 'login' });
}
</script>
<style>
.banner {
  height: 120px;
  background-image: url('../../public/banner.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

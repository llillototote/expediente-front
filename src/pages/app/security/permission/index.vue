<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import { usePermissionStore } from 'src/stores/permision-store';
import { getAllPermission } from 'src/services/api/auth/permission/permission.service';
import { PermissionResponse } from 'src/services/api/auth/permission/permission.types';
import { ResponseExternal } from 'src/common/interface/util';
const permisionStore = usePermissionStore();
const data = ref<PermissionResponse[]>([]);

async function actualizarPermisos() {
  Notify.create({
    message: 'Los permisos no se actualizaron satisfactoriamente',
    textColor: 'white',
    color: 'warning',
    position: 'top-right',
  });
}
onMounted(async () => {
  const resp: ResponseExternal<PermissionResponse[]> = await getAllPermission();
  if (resp.status == 200) {
    if (resp.payload != null) {
      data.value = resp.payload;
    }
  }
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <div class="q-pa-md">
          <q-card dark bordered class="bg-grey-3 my-card">
            <q-card-section>
              <div class="text-h6 text-primary">Permisos del Sistema</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section v-if="data.length > 0">
              <q-list>
                <div v-for="(permiso, index) in data" :key="index">
                  <q-item class="q-mb-sm" v-ripple>
                    <q-item-section avatar>
                      <q-avatar
                        :color="permiso.active ? 'primary' : 'grey-6'"
                        text-color="white"
                      >
                        <q-icon name="front_hand" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label
                        :class="permiso.active ? 'text-primary' : 'text-grey-6'"
                        >{{ permiso.code }}
                      </q-item-label>
                      <q-item-label caption lines="1">{{
                        permiso.description
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-checkbox
                        v-model="permiso.active"
                        @update:model-value="actualizarPermisos"
                      />
                    </q-item-section>
                  </q-item>
                  <q-separator spaced inset />
                </div>
              </q-list>
            </q-card-section>
            <q-card-section v-else>
              <q-card class="my-card" flat bordered>
                <q-card-section>
                  <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                    No hay nada que mostrar
                  </div>
                  <div class="text-caption text-grey">
                    Aun no hay permisos en este grupo
                  </div>
                </q-card-section>
              </q-card>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

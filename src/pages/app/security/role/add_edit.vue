<script setup lang="ts">
import { Notify } from 'quasar';
import {
  SelectField,
  Qtree,
  ResponseExternal,
} from 'src/common/interface/util';
import { NAMESROUTES } from 'src/config/permisionDTO';
import {
  createRole,
  getByIdRole,
  updateRole,
} from 'src/services/api/auth/role/role.service';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermissionStore } from 'src/stores/permision-store';
import {
  RoleRequest,
  RoleResponse,
} from 'src/services/api/auth/role/role.types';
import { useLoadingStore } from 'src/stores/loading-store';
import { PermissionResponse } from 'src/services/api/auth/permission/permission.types';
import { getAllPermission } from 'src/services/api/auth/permission/permission.service';
import { prepareToSelect } from 'src/services/util';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const permissionStore = usePermissionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<number | null>(null);
const title = ref<string>('');

// FORM
const name = ref<string>('');
const descripcion = ref<string>('');

// FORM HELP
const refresh = ref<number>(0);
const tab = ref<string>('details');

const ticked = ref<string[]>([]);
const expanded = ref(['Módulos de permisos']);
const selected = ref<string | null>(null);
const ticked_info = ref<PermissionResponse[]>([]);

const simple = ref<Qtree<string>[]>([
  {
    label: 'Módulos de permisos',
    children: [],
  },
]);

// END FORM HELP
// END FORM

async function obtenerPermisosActivos() {
  const resp: ResponseExternal<PermissionResponse[]> = await getAllPermission();
  if (resp.status == 200) {
    if (resp.payload) {
      simple.value[0].label = 'Módulos de permisos';
      simple.value[0].children = resp.payload
        .filter((it) => it.active)
        .map((it) => {
          return { label: it.code };
        });
    }
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
}

// METHODS FORM
async function onSubmit() {
  if (tab.value == 'permisions') {
    if (name.value == '' || descripcion.value == '') {
      tab.value = 'details';
      return;
    } else if (ticked_info.value.length == 0) {
      return;
    }
  } else if (tab.value == 'details') {
    if (ticked_info.value.length == 0) {
      tab.value = 'permisions';
      return;
    }
  }

  if (mode.value == 'add') {
    if (ticked_info.value.length > 0) {
      const payload: RoleRequest = {
        description: descripcion.value.trim(),
        name: name.value.trim(),
        permissions: ticked_info.value.map((t) => Number(t.id)),
      };
      const resp = await createRole(payload);
      if (resp.status == 201) {
        Notify.create({
          message: 'Correcto, rol creado satisfactoria!',
          textColor: 'white',
          color: 'green',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.APP_ROLE_LIST });
      } else {
        Notify.create({
          message: resp.error,
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
      }
    }
  } else if (mode.value == 'edit' && id.value != null) {
    if (ticked_info.value.length > 0) {
      const payload: RoleRequest = {
        description: descripcion.value.trim(),
        name: name.value.trim(),
        permissions: ticked_info.value.map((t) => Number(t.id)),
      };
      const resp = await updateRole(id.value, payload);
      if (resp.status == 201) {
        Notify.create({
          message: 'Correcto, rol actualizado satisfactoriamente!',
          textColor: 'white',
          color: 'green',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.APP_ROLE_LIST });
      } else {
        Notify.create({
          message: resp.error,
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
      }
    }
  }
}
function onReset() {
  Notify.create({
    message: 'Info, operación abortada!',
    textColor: 'white',
    color: 'blue',
    position: 'top-right',
  });
  router.push({ name: NAMESROUTES.APP_ROLE_LIST });
}
// END METHODS FORM

const getPermissionsID = (tickes: string[]) => {
  console.log('ticked', tickes);
  const tickesFinded: PermissionResponse[] = [];
  tickes.forEach((tick) => {
    const finded: PermissionResponse | undefined =
      permissionStore.permissionsAll.find((it) => it.code === tick);
    if (finded) tickesFinded.push(finded);
  });

  ticked_info.value = tickesFinded;
};

const showInfo = (e: any) => {
  console.log('selected', e);
};

onMounted(async () => {
  loadingStore.active();
  await obtenerPermisosActivos();
  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar rol';
  } else {
    title.value = 'Modificar rol';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      const recuperate: ResponseExternal<RoleResponse> = await getByIdRole(
        id.value
      );
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          descripcion.value = payload.description;
          name.value = payload.name;
          ticked.value = payload.permissions.map((it) => it.code);
          getPermissionsID(ticked.value);
        } else alert('payload vacio');
      } else alert('usuario no recuperado');
    }
  }
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row q-pa-sm">
    <div class="col-12">
      <q-card dark bordered class="bg-grey-3 my-card">
        <q-card-section>
          <div class="text-h6 text-primary">{{ title }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          <q-form
            ref="myForm"
            @submit.prevent="onSubmit"
            @reset="onReset"
            :key="refresh"
          >
            <q-card class="no-shadow bg-grey-3">
              <q-tabs
                v-model="tab"
                dense
                class="text-primary bg-grey-3"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="details" label="Detalles" />
                <q-tab name="permisions" label="Permisos" />
              </q-tabs>

              <q-separator />
              <q-tab-panels v-model="tab" animated class="bg-grey-2">
                <q-tab-panel name="details">
                  <div class="row">
                    <div class="col-8 q-pa-sm offset-2">
                      <q-input
                        dense
                        outlined
                        bg-color="white"
                        v-model="name"
                        label="Nombre *"
                        hint="nombre del rol"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.trim().length > 0) ||
                            'Por favor introduce el nombre del rol',
                        ]"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8 offset-2 q-pa-sm">
                      <q-input
                        v-model="descripcion"
                        outlined
                        bg-color="white"
                        type="textarea"
                        hint="Descripción del alcanze del rol"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.trim().length > 0) ||
                            'Por favor introduce una descripción para el rol',
                        ]"
                      />
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="permisions">
                  <div class="row">
                    <q-tree
                      class="col-5 text-primary"
                      :nodes="simple"
                      node-key="label"
                      tick-strategy="leaf"
                      selected-color="primary"
                      v-model:selected="selected"
                      v-model:ticked="ticked"
                      @update:selected="
                        (e) => {
                          showInfo(e);
                        }
                      "
                      @update:ticked="
                        () => {
                          getPermissionsID(ticked);
                        }
                      "
                      v-model:expanded="expanded"
                    />
                    <div class="col-7">
                      <div v-if="ticked_info.length > 0">
                        <q-list bordered dense padding>
                          <q-item-label header>Seleccionados</q-item-label>
                          <div
                            v-for="tick in ticked_info"
                            :key="`ticked-${tick.id}`"
                          >
                            <q-item>
                              <q-item-section>
                                <q-item-label>
                                  <q-chip
                                    color="primary"
                                    text-color="white"
                                    icon="directions"
                                  >
                                    {{ tick.code }}
                                  </q-chip>
                                </q-item-label>
                                <q-item-label caption lines="2">{{
                                  tick.description
                                }}</q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-separator spaced inset />
                          </div>
                        </q-list>
                      </div>
                      <q-card v-else class="no-shadow">
                        <q-card-section>
                          <q-card class="my-card" flat bordered>
                            <q-card-section>
                              <div class="text-h6 q-mt-sm q-mb-xs text-grey">
                                No hay nada que mostrar
                              </div>
                              <div class="text-caption text-grey">
                                Aun no hay permisos seleccionados
                              </div>
                            </q-card-section>
                          </q-card>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
            <div class="row">
              <div class="col-8 q-pa-sm">
                <q-btn label="Aceptar" type="submit" color="primary" />
                <q-btn
                  label="Salir"
                  type="reset"
                  flat
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

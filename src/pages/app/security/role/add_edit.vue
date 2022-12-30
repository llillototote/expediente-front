<script setup lang="ts">
import { SelectField, Qtree } from 'src/common/interface/util';
import { CODES, ENTITY } from 'src/services/external/permisionDTO';
import {
  createRole,
  getByIdRole,
  updateRole,
} from 'src/services/external/role';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermisionStore } from 'src/stores/permision-store';
import {
  RoleCreateRequest,
  RoleUpdateRequest,
} from 'src/services/external/roleDTO';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const permisionStore = usePermisionStore();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<string | null>(null);
const title = ref<string>('');

// FORM
const name = ref<string>('');
const descripcion = ref<string>('');

// FORM HELP
const refresh = ref<number>(0);
const tab = ref<string>('details');

const ticked = ref<CODES[]>([]);
const expanded = ref(['Módulos de permisos']);
const ticked_info = ref<SelectField[]>([]);
const simple = ref<Qtree<CODES>[]>([
  {
    label: 'Módulos de permisos',
    children: [
      {
        label: ENTITY.USUARIO,
        children: [
          { label: CODES.USERS_LIST_ALL },
          { label: CODES.USER_LIST_BY_ID },
          { label: CODES.USER_CREATE },
          { label: CODES.USER_UPDATE_BY_ID },
          { label: CODES.USER_DELETE_BY_ID },
        ],
      },
      {
        label: ENTITY.ROL,
        children: [
          { label: CODES.ROLS_LIST_ALL },
          { label: CODES.ROL_LIST_BY_ID },
          { label: CODES.ROL_CREATE },
          { label: CODES.ROL_UPDATE_BY_ID },
          { label: CODES.ROL_DELETE_BY_ID },
        ],
      },
    ],
  },
]);

// END FORM HELP
// END FORM

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
  console.log(1);
  if (mode.value == 'add') {
    if (ticked_info.value.length > 0) {
      const payload: RoleCreateRequest = {
        descriptionRol: descripcion.value,
        nameRol: name.value,
        permits: ticked_info.value.map((t) => t.value),
      };
      const resp = await createRole(payload);
      console.log(resp);
    }
  } else if (mode.value == 'edit' && id.value != null) {
    if (ticked_info.value.length > 0) {
      const payload: RoleUpdateRequest = {
        descriptionRol: descripcion.value,
        nameRol: name.value,
        permits: ticked_info.value.map((t) => t.value),
      };
      const resp = await updateRole(id.value, payload);
      console.log(resp);
    }
  }
}
function onReset() {
  console.log(1);
  router.push({ name: 'role_list' });
}
// END METHODS FORM

onMounted(async () => {
  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar rol';
  } else {
    title.value = 'Modificar rol';
    id.value = route.query?.payload ? route.query?.payload.toString() : null;
    if (id.value != null) {
      const recuperate = await getByIdRole(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          console.log(payload);
          descripcion.value = payload.rolEntity.descriptionRol;
          name.value = payload.rolEntity.nameRol;
          ticked.value = payload.namePermits;
          ticked_info.value = permisionStore.getPermisionsID(ticked.value);
          console.log(ticked.value);
          ticked_info.value;
        } else alert('payload vacio');
      } else alert('usuario no recuperado');
    }
  }
});
</script>
<template>
  <q-page class="row q-pa-sm">
    <div class="col-12">
      <h4>{{ title }}</h4>
      <q-form
        ref="myForm"
        @submit.prevent="onSubmit"
        @reset="onReset"
        :key="refresh"
      >
        <q-card class="no-shadow">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="details" label="Detalles" />
            <q-tab name="permisions" label="Permisos" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="details">
              <div class="text-h6">Detalles</div>
              <div class="row">
                <div class="col-8 q-pa-sm offset-2">
                  <q-input
                    dense
                    outlined
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
                    type="textarea"
                    hint="Descripcion del alcanze del rol"
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
              <div class="text-h6">Permisos</div>
              <div class="row">
                <q-tree
                  class="col-5"
                  :nodes="simple"
                  node-key="label"
                  tick-strategy="leaf"
                  v-model:ticked="ticked"
                  @update:ticked="
                    () => {
                      ticked_info = permisionStore.getPermisionsID(ticked);
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
                        :key="`ticked-${tick.value}`"
                      >
                        <q-item clickable v-ripple>
                          <q-item-section>
                            <q-item-label caption>
                              {{ tick.label }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator />
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
              label="Cancelar"
              type="reset"
              flat
              color="primary"
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

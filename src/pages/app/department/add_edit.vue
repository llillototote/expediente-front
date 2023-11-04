<script setup lang="ts">
import { Notify } from 'quasar';
import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { prepareToSelect } from 'src/services/util';

import { NAMESROUTES } from 'src/config/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';

import {
  DepartmentRequest,
  DepartmentResponse,
} from 'src/services/api/bussiness/department/department.types';
import {
  createDepartment,
  getByIdDepartment,
  updateDepartment,
} from 'src/services/api/bussiness/department/department.service';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<number | null>(null);
const title = ref<string>('');

// FORM
const nombre = ref<string>('');

// FORM HELP

const refresh = ref<number>(0);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: DepartmentRequest = {
      name: nombre.value.trim(),
    };
    const resp: ResponseExternal<DepartmentResponse> = await createDepartment(
      payload
    );
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, departamento creado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_DEPARTMENT_LIST });
    } else if (resp.status == 401) {
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.LOGIN });
    } else {
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
    }
  } else if (mode.value == 'edit' && id.value != null) {
    const payload: DepartmentRequest = {
      name: nombre.value.trim(),
    };
    const resp = await updateDepartment(id.value, payload);
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, departamento actualizado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_DEPARTMENT_LIST });
    } else if (resp.status == 401) {
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.LOGIN });
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

function onReset() {
  Notify.create({
    message: 'Info, operación abortada!',
    textColor: 'white',
    color: 'blue',
    position: 'top-right',
  });
  router.push({ name: NAMESROUTES.APP_DEPARTMENT_LIST });
}

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar Departamento';
  } else {
    title.value = 'Modificar Departamento';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      const recuperate = await getByIdDepartment(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          nombre.value = payload.name;
        } else alert('payload vacio');
      } else if (recuperate.status == 401) {
        Notify.create({
          message: recuperate.error,
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.LOGIN });
      } else alert('departamento no recuperado');
    }
  }
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row q-pa-sm q-ma-sm">
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
            <div class="row">
              <div class="col-12 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="nombre"
                  label="Nombre *"
                  hint="tu nombre"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce un nombre',
                  ]"
                />
              </div>
            </div>

            <div>
              <q-btn label="Aceptar" type="submit" color="primary" />
              <q-btn
                label="Salir"
                type="reset"
                flat
                color="primary"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

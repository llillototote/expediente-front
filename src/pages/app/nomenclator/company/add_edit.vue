<script setup lang="ts">
import { Notify } from 'quasar';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NAMESROUTES } from 'src/services/external/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';
import {
  createCompany,
  getByIdCompany,
  updateCompany,
} from 'src/services/external/nomenclator/company';
import {
  CompanyCreateRequest,
  CompanyUpdateRequest,
} from 'src/services/external/nomenclator/companyDTO';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<string | null>(null);
const title = ref<string>('');

// FORM
const nombre = ref<string>('');
const descripcion = ref<string>('');
const acronimo = ref<string>('');
const address = ref<string>('');
const codigo = ref<string>('');

// FORM HELP

const refresh = ref<number>(0);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: CompanyCreateRequest = {
      codeCompany: codigo.value.trim(),
      acronymCompany: acronimo.value.trim(),
      addressCompany: address.value.trim(),
      nameCompany: nombre.value.trim(),
      descriptionCompany: descripcion.value.trim(),
    };
    const resp = await createCompany(payload);
    console.log(resp);
    if (resp.status == 200) {
      Notify.create({
        message: 'Correcto, division creada satisfactoria!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_COMPANY_LIST });
    } else {
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
    }
  } else if (mode.value == 'edit' && id.value != null) {
    const payload: CompanyUpdateRequest = {
      codeCompany: codigo.value.trim(),
      acronymCompany: acronimo.value.trim(),
      addressCompany: address.value.trim(),
      nameCompany: nombre.value.trim(),
      descriptionCompany: descripcion.value.trim(),
    };
    const resp = await updateCompany(id.value, payload);
    console.log(resp);
    if (resp.status == 200) {
      Notify.create({
        message: 'Correcto, empresa actualizada satisfactoria!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_COMPANY_LIST });
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
  router.push({ name: NAMESROUTES.APP_COMPANY_LIST });
}

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();
  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar Empresa';
  } else {
    title.value = 'Modificar Empresa';
    id.value = route.query?.payload ? route.query?.payload.toString() : null;
    if (id.value != null) {
      const recuperate = await getByIdCompany(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          codigo.value = payload.codeCompany;
          nombre.value = payload.nameCompany;
          descripcion.value = payload.descriptionCompany;
          acronimo.value = payload.acronymCompany;
          address.value = payload.addressCompany;
        } else alert('payload vacio');
      } else alert('Empresa no recuperado');
    }
  }
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row q-pa-sm q-ma-sm">
    <div class="col-12">
      <h4>{{ title }}</h4>
      <q-form
        ref="myForm"
        @submit.prevent="onSubmit"
        @reset="onReset"
        :key="refresh"
      >
        <div class="row">
          <div class="col-6 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="nombre"
              label="Nombre *"
              hint="tu nombre"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu nombre',
              ]"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="acronimo"
              label="Acrónimo *"
              hint="tu acrónimo"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce un acrónimo',
              ]"
            />
          </div>

          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="codigo"
              label="Código *"
              hint="tu código"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce un código',
              ]"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="address"
              label="Dirección *"
              hint="tu dirección"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce una dirección',
              ]"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-6 q-pa-sm">
            <q-input
              v-model="descripcion"
              dense
              outlined
              type="textarea"
              label="Descripción *"
              hint="Descripción"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce alguna descripción',
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
    </div>
  </q-page>
</template>

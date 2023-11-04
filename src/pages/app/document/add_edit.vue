<script setup lang="ts">
import { Notify } from 'quasar';
import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { prepareToSelect } from 'src/services/util';

import { NAMESROUTES } from 'src/config/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';

import { RecordResponse } from 'src/services/api/bussiness/record/record.types';
import {
  createRecord,
  getAllRecord,
  getByIdRecord,
  updateRecord,
} from 'src/services/api/bussiness/record/record.service';
import { getAllPosition } from 'src/services/api/bussiness/position/position.service';
import { PositionResponse } from 'src/services/api/bussiness/position/position.types';
import { getAllEmployee } from 'src/services/api/bussiness/employee/employee.service';
import { EmployeeResponse } from 'src/services/api/bussiness/employee/employee.types';
import { DepartmentResponse } from 'src/services/api/bussiness/department/department.types';
import { getAllDepartment } from 'src/services/api/bussiness/department/department.service';
import {
  DocumentRequest,
  DocumentResponse,
} from 'src/services/api/bussiness/document/document.types';
import {
  createDocument,
  getByIdDocument,
  updateDocument,
} from 'src/services/api/bussiness/document/document.service';

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
const record = ref<number | null>(null);
const location = ref<string>('');
const type = ref<string>('');
// FORM HELP

const refresh = ref<number>(0);
const records = ref<SelectField[]>([]);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: DocumentRequest = {
      location: location.value.trim(),
      name: nombre.value.trim(),
      record: Number(record.value),
      type: type.value.trim(),
    };
    const resp: ResponseExternal<DocumentResponse> = await createDocument(
      payload
    );
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, expediente creado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_DOCUMENT_LIST });
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
    const payload: DocumentRequest = {
      location: location.value.trim(),
      name: nombre.value.trim(),
      record: Number(record.value),
      type: type.value.trim(),
    };
    const resp = await updateDocument(id.value, payload);
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, expediente actualizado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_DOCUMENT_LIST });
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
  router.push({ name: NAMESROUTES.APP_DOCUMENT_LIST });
}
async function obtenerExpedientes() {
  const resp: ResponseExternal<RecordResponse[]> = await getAllRecord();
  if (resp.status == 200) {
    if (resp.payload) {
      records.value = prepareToSelect<RecordResponse>(
        resp.payload,
        'comment',
        'id'
      );
    }
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
}

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();

  await obtenerExpedientes();

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar Documento';
  } else {
    title.value = 'Modificar Documento';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      const recuperate = await getByIdDocument(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          record.value = payload.record.id;
          location.value = payload.location;
          nombre.value = payload.name;
          type.value = payload.type;
        } else alert('payload vacio');
      } else if (recuperate.status == 401) {
        Notify.create({
          message: recuperate.error,
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.LOGIN });
      } else alert('documento no recuperado');
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
              <div class="col-8 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="nombre"
                  label="Nombre *"
                  hint="nombre del documento"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce un nombre',
                  ]"
                />
              </div>
              <div class="col-4 q-pa-sm">
                <q-select
                  bg-color="white"
                  outlined
                  dense
                  v-model="record"
                  :options="records"
                  hint="seleccione un Expediente"
                  label="Expediente"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona algun expediente',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="type"
                  label="Tipo de documento *"
                  hint="tipo de documento"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce un tipo de documento',
                  ]"
                />
              </div>
              <div class="col-8 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="location"
                  label="Ubicacion *"
                  hint="ubicacion del documento"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce una ubicacion',
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

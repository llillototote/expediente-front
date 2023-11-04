<script setup lang="ts">
import { Notify } from 'quasar';
import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { prepareToSelect } from 'src/services/util';

import { NAMESROUTES } from 'src/config/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';

import {
  RecordRequest,
  RecordResponse,
} from 'src/services/api/bussiness/record/record.types';
import {
  createRecord,
  getByIdRecord,
  updateRecord,
} from 'src/services/api/bussiness/record/record.service';
import { getAllPosition } from 'src/services/api/bussiness/position/position.service';
import { PositionResponse } from 'src/services/api/bussiness/position/position.types';
import { getAllEmployee } from 'src/services/api/bussiness/employee/employee.service';
import { EmployeeResponse } from 'src/services/api/bussiness/employee/employee.types';
import { DepartmentResponse } from 'src/services/api/bussiness/department/department.types';
import { getAllDepartment } from 'src/services/api/bussiness/department/department.service';

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
const position = ref<number | null>(null);
const department = ref<number | null>(null);
const employee = ref<number | null>(null);
const assessment = ref<string>('');
const salary = ref<number>(0);
const comment = ref<string>('');
// FORM HELP

const refresh = ref<number>(0);
const positions = ref<SelectField[]>([]);
const employees = ref<SelectField[]>([]);
const departments = ref<SelectField[]>([]);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: RecordRequest = {
      employee: Number(employee.value),
      department: Number(department.value),
      position: Number(position.value),
      assessment: assessment.value.trim(),
      salary: salary.value,
      comment: comment.value.trim(),
    };
    const resp: ResponseExternal<RecordResponse> = await createRecord(payload);
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, expediente creado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_RECORD_LIST });
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
    const payload: RecordRequest = {
      employee: Number(employee.value),
      department: Number(department.value),
      position: Number(position.value),
      assessment: assessment.value.trim(),
      salary: salary.value,
      comment: comment.value.trim(),
    };
    const resp = await updateRecord(id.value, payload);
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, expediente actualizado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_RECORD_LIST });
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
  router.push({ name: NAMESROUTES.APP_RECORD_LIST });
}

async function obtenerPuestos() {
  const resp: ResponseExternal<PositionResponse[]> = await getAllPosition();
  if (resp.status == 200) {
    if (resp.payload) {
      positions.value = prepareToSelect<PositionResponse>(
        resp.payload,
        'name',
        'id'
      );
    }
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
}
async function obtenerDepartamentos() {
  const resp: ResponseExternal<DepartmentResponse[]> = await getAllDepartment();
  if (resp.status == 200) {
    if (resp.payload) {
      departments.value = prepareToSelect<DepartmentResponse>(
        resp.payload,
        'name',
        'id'
      );
    }
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
}
async function obtenerEmpleados() {
  const resp: ResponseExternal<EmployeeResponse[]> = await getAllEmployee();
  if (resp.status == 200) {
    if (resp.payload) {
      employees.value = prepareToSelect<EmployeeResponse>(
        resp.payload,
        'name',
        'id'
      );
    }
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
}

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();

  await obtenerDepartamentos();
  await obtenerEmpleados();
  await obtenerPuestos();

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar Expediente';
  } else {
    title.value = 'Modificar Expediente';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      const recuperate = await getByIdRecord(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          employee.value = payload.employee.id;
          department.value = payload.departament.id;
          position.value = payload.position.id;
          assessment.value = payload.assessment;
          salary.value = payload.salary;
          comment.value = payload.comment;
        } else alert('payload vacio');
      } else if (recuperate.status == 401) {
        Notify.create({
          message: recuperate.error,
          textColor: 'white',
          color: 'warning',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.LOGIN });
      } else alert('expediente no recuperado');
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
              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="assessment"
                  label="Evaluacion *"
                  hint="tu evaluacion"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce una evaluacion',
                  ]"
                />
              </div>
              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model.number="salary"
                  label="Salario con 2 decimales *"
                  mask="#.##"
                  fill-mask="0"
                  reverse-fill-mask
                  hint="Salario: #.##"
                  input-class="text-right"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val > 0) || 'Por favor introduce un salario',
                  ]"
                />
              </div>
              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="comment"
                  label="Comentario *"
                  hint="tu comentario"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce un comentario',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-4 q-pa-sm">
                <q-select
                  bg-color="white"
                  outlined
                  dense
                  v-model="department"
                  :options="departments"
                  hint="seleccione un Departamento"
                  label="Departamento"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona algun departamento',
                  ]"
                />
              </div>

              <div class="col-4 q-pa-sm">
                <q-select
                  bg-color="white"
                  outlined
                  dense
                  v-model="position"
                  :options="positions"
                  hint="seleccione un Puesto de trabajo"
                  label="Puestos de trabajo"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona algun puesto',
                  ]"
                />
              </div>

              <div class="col-4 q-pa-sm">
                <q-select
                  bg-color="white"
                  outlined
                  dense
                  v-model="employee"
                  :options="employees"
                  hint="seleccione un Empleado"
                  label="Empleado"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona algun empleado',
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

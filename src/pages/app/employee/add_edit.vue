<script setup lang="ts">
import { Notify } from 'quasar';
import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  newEmailIsValid,
  validarNewPass,
  validateCI,
} from 'src/common/validations/validate';

import { prepareToSelect } from 'src/services/util';

import { NAMESROUTES } from 'src/config/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';

import {
  EmployeeRequest,
  EmployeeResponse,
} from 'src/services/api/bussiness/employee/employee.types';
import {
  createEmployee,
  getByIdEmployee,
  updateEmployee,
} from 'src/services/api/bussiness/employee/employee.service';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<number | null>(null);
const title = ref<string>('');

// FORM
const name = ref<string>('');
const lastName = ref<string>('');
const email = ref<string>('');
const phone = ref<string>('');
const dateBirtday = ref<string>('2023/10/16');
const address = ref<string>('');

// FORM HELP

const refresh = ref<number>(0);
const msg_email = ref('');
// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: EmployeeRequest = {
      name: name.value.trim(),
      address: address.value.trim(),
      dateBirtday: dateBirtday.value.trim(),
      email: email.value.trim(),
      lastName: lastName.value.trim(),
      phone: phone.value.trim(),
    };
    const resp: ResponseExternal<EmployeeResponse> = await createEmployee(
      payload
    );
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, departamento creado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_EMPLOYEE_LIST });
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
    const payload: EmployeeRequest = {
      name: name.value.trim(),
      address: address.value.trim(),
      dateBirtday: dateBirtday.value.trim(),
      email: email.value.trim(),
      lastName: lastName.value.trim(),
      phone: phone.value.trim(),
    };
    const resp = await updateEmployee(id.value, payload);
    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, departamento actualizado satisfactoriamente!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_EMPLOYEE_LIST });
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
  router.push({ name: NAMESROUTES.APP_EMPLOYEE_LIST });
}

const validateEmail = (email: string) => {
  const { msg, status } = newEmailIsValid(email);
  msg_email.value = msg;
  return !status;
};

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar Empleado';
  } else {
    title.value = 'Modificar Empleado';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      const recuperate = await getByIdEmployee(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          name.value = payload.name;
          address.value = payload.address;
          dateBirtday.value = payload.dateBirtday;
          email.value = payload.email;
          lastName.value = payload.lastName;
          phone.value = payload.phone;
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
              <div class="col-6 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="name"
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

              <div class="col-6 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="lastName"
                  label="Apellido *"
                  hint="tus apellidos"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tus apellidos',
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
                  v-model="email"
                  label="Correo electrónico *"
                  hint="correo valido"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tu correo electrónico',
                    (val) => (val && validateEmail(val)) || msg_email,
                  ]"
                />
              </div>

              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="phone"
                  label="Telefono *"
                  hint="tu telefono aqui"
                  mask="+(##) ########"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length == 14) ||
                      'Por favor introduce tu telefono',
                  ]"
                />
              </div>

              <div class="col-4 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="dateBirtday"
                  mask="date"
                  :rules="['date']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateBirtday">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row">
              <div class="col-12 q-pa-sm">
                <q-input
                  bg-color="white"
                  dense
                  outlined
                  v-model="address"
                  label="Direccion *"
                  hint="tu direccion"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tu direccion',
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

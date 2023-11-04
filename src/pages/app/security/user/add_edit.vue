<script setup lang="ts">
import { Notify } from 'quasar';
import { ResponseExternal, SelectField } from 'src/common/interface/util';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  newEmailIsValid,
  validateCI,
  validarNewPass,
} from 'src/common/validations/validate';
import { prepareToSelect } from 'src/services/util';
import { getAllRole } from 'src/services/api/auth/role/role.service';
import { RoleResponse } from 'src/services/api/auth/role/role.types';
import {
  UserRequest,
  UserResponse,
} from 'src/services/api/auth/user/user.types';
import {
  getByIdUser,
  createUser,
  updateUser,
} from 'src/services/api/auth/user/user.service';
import { NAMESROUTES } from 'src/config/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';

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
const correo = ref<string>('');
const status = ref<boolean>(true);
const usuario = ref<string>('');
const password = ref<string>('');
const role = ref<number[]>([]);

// FORM HELP
const repassword = ref<string>('');
const isPwd = ref<boolean>(true);
const isPwdRe = ref<boolean>(true);
const refresh = ref<number>(0);
const changepass = ref<boolean>(true);
const roles = ref<SelectField[]>([]);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    const payload: UserRequest = {
      //name: nombre.value.trim(),
      //active: status.value,
      email: correo.value.trim(),
      secret: password.value,
      roles: role.value,
      username: usuario.value.trim(),
    };
    const resp = await createUser(payload);

    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, usuario creado satisfactoria!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_USER_LIST });
    } else {
      Notify.create({
        message: resp.error,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
    }
  } else if (mode.value == 'edit' && id.value != null) {
    const pass = changepass.value
      ? {
          passwordPerson: password.value,
        }
      : {};
    const payload: UserRequest = {
      //name: nombre.value.trim(),
      //active: status.value,
      email: correo.value.trim(),
      secret: password.value,
      roles: role.value,
      username: usuario.value.trim(),
    };
    const resp = await updateUser(id.value, payload);

    if (resp.status == 201) {
      Notify.create({
        message: 'Correcto, usuario actualizado satisfactoria!',
        textColor: 'white',
        color: 'green',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.APP_USER_LIST });
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
  router.push({ name: NAMESROUTES.APP_USER_LIST });
}

const msg_email = ref('');
const msg_pass = ref('');

const validateEmail = (email: string) => {
  const { msg, status } = newEmailIsValid(email);
  msg_email.value = msg;
  return !status;
};

const validatePass = (pass: string) => {
  const { msgs, flag } = validarNewPass(pass);
  msg_pass.value = msgs[0];
  return flag;
};

// END METHODS FORM

onMounted(async () => {
  loadingStore.active();

  const resp: ResponseExternal<RoleResponse[]> = await getAllRole();
  if (resp.status == 200) {
    if (resp.payload) {
      roles.value = prepareToSelect(resp.payload, 'name', 'id');
    }
  }

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar usuario';
  } else {
    title.value = 'Modificar usuario';
    id.value = route.query?.payload
      ? Number(route.query?.payload.toString())
      : null;
    if (id.value != null) {
      console.log('recuperando usaurio');
      const recuperate = await getByIdUser(id.value);

      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          //nombre.value = payload.username;
          correo.value = payload.email;
          //status.value = payload.active;
          usuario.value = payload.username;
          role.value = payload.roles.map((rolid: RoleResponse) => rolid.id);
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
            <div class="row">
              <div class="col-6 q-pa-sm">
                <q-input
                  dense
                  outlined
                  bg-color="white"
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

              <div class="col-3 q-pa-sm">
                <q-input
                  dense
                  outlined
                  bg-color="white"
                  v-model="usuario"
                  label="Usuario *"
                  hint="tu usuario"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tu usuario',
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-3 q-pa-sm">
                <q-input
                  dense
                  outlined
                  bg-color="white"
                  v-model="correo"
                  label="Correo electrónico *"
                  hint="tu correo electrónico"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tu correo electrónico',
                    (val) => (val && validateEmail(val)) || msg_email,
                  ]"
                />
              </div>
              <div class="col-3 q-pa-sm">
                <q-select
                  outlined
                  dense
                  bg-color="white"
                  v-model="role"
                  multiple
                  :options="roles"
                  use-chips
                  hint="seleccione uno o varios roles"
                  label="Roles"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor selecciona algun rol',
                  ]"
                >
                  <template
                    v-slot:option="{ itemProps, opt, selected, toggleOption }"
                  >
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        <q-item-label>{{ opt.label }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle
                          :model-value="selected"
                          @update:model-value="toggleOption(opt)"
                        />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-3 q-pa-sm">
                <q-checkbox
                  v-model="status"
                  label="Activo"
                  class="text-black"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-3 q-pa-sm">
                <q-toggle
                  class="text-black"
                  v-if="mode == 'edit'"
                  v-model="changepass"
                  color="primary"
                  label="Cambiar Contraseña"
                  @update:model-value="refresh++"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-3 q-pa-sm">
                <q-input
                  v-if="mode == 'add' || changepass"
                  dense
                  bg-color="white"
                  label="Contraseña *"
                  ref="fieldPass"
                  v-model="password"
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  hint="tu contraseña"
                  autocomplete="off"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.trim().length > 0) ||
                      'Por favor introduce tu nueva contraseña',
                    (val) => (val && validatePass(val)) || msg_pass,
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-3 q-pa-sm">
                <q-input
                  v-if="mode == 'add' || changepass"
                  dense
                  bg-color="white"
                  label="Confirmar contraseña *"
                  ref="fieldPass"
                  v-model="repassword"
                  outlined
                  :type="isPwdRe ? 'password' : 'text'"
                  hint="repite tu contraseña"
                  autocomplete="off"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor repite tu contraseña',
                    (val) =>
                      (val && val == password) ||
                      'Por favor has que coincidan tus contraseñas',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdRe ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdRe = !isPwdRe"
                    />
                  </template>
                </q-input>
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

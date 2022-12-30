<script setup lang="ts">
import { SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { validateCI, validateEmail } from 'src/common/validations/validate';
import { prepareToSelect } from 'src/services/util';
import { getAllRole } from 'src/services/external/role';
import { RoleResponse } from 'src/services/external/roleDTO';
import {
  UserCreateRequest,
  UserUpdateRequest,
  GENDER,
  ProvinceResponse,
} from 'src/services/external/userDTO';
import {
  getByIdUser,
  createUser,
  updateUser,
} from 'src/services/external/user';
import { getAllProvinces } from 'src/services/external/nomenclador';

// USE GENERAL
const route = useRoute();
const router = useRouter();
// END USE GENERAL

const mode = ref<string>('add');
const id = ref<string | null>(null);
const title = ref<string>('');

// FORM
const nombre = ref<string>('');
const apellido1 = ref<string>('');
const apellido2 = ref<string>('');
const genero = ref<GENDER>(GENDER.M);
const correo = ref<string>('');
const ci = ref<string>('');
const status = ref<boolean>(true);
const usuario = ref<string>('');
const password = ref<string>('');
const role = ref<string[]>([]);
const province = ref<SelectField | null>(null);

// FORM HELP
const repassword = ref<string>('');
const isPwd = ref<boolean>(true);
const isPwdRe = ref<boolean>(true);
const refresh = ref<number>(0);
const changepass = ref<boolean>(true);
const roles = ref<SelectField[]>([]);
const provinces = ref<SelectField[]>([]);
const provincesOptions = ref<SelectField[]>([]);
const generos = ref<SelectField[]>([
  { label: 'Masculino', value: GENDER.M },
  { label: 'Femenino', value: GENDER.F },
]);
// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    if (province.value != null) {
      const payload: UserCreateRequest = {
        namePerson: nombre.value,
        activePerson: status.value,
        emailPerson: correo.value,
        firstLastNamePerson: apellido1.value,
        secondLastNamePerson: apellido2.value,
        genderPerson: genero.value,
        identityCardPerson: ci.value,
        passwordPerson: password.value,
        rols: role.value,
        usernamePerson: usuario.value,
        provincePerson: province.value.value,
      };
      const resp = await createUser(payload);
      console.log(resp);
    }
  } else if (mode.value == 'edit' && id.value != null) {
    const pass = changepass.value
      ? {
          passwordPerson: password.value,
        }
      : {};
    if (province.value != null) {
      const payload: UserUpdateRequest = {
        namePerson: nombre.value,
        activePerson: status.value,
        emailPerson: correo.value,
        firstLastNamePerson: apellido1.value,
        secondLastNamePerson: apellido2.value,
        genderPerson: genero.value,
        identityCardPerson: ci.value,
        ...pass,
        rols: role.value,
        usernamePerson: usuario.value,
        provincePerson: province.value.value,
      };
      const resp = await updateUser(id.value, payload);
      console.log(resp);
    }
  }
}

function onReset() {
  console.log(1);
  router.push({ name: 'user_list' });
}

const filterFnProv = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      provinces.value = provincesOptions.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    provinces.value = provincesOptions.value.filter(
      (v: any) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

// END METHODS FORM

onMounted(async () => {
  let obj_roles = await getAllRole();
  let role_prepared: SelectField[] = [];
  if (obj_roles.status == 200) {
    if (obj_roles.payload) {
      let rols: RoleResponse[] = obj_roles.payload;
      role_prepared = prepareToSelect(rols, 'nameRol', 'pkRol');
      roles.value = role_prepared;
    }
  }

  let obj_provinces = await getAllProvinces();
  let provinces_prepared: SelectField[] = [];
  if (obj_provinces.status == 200) {
    if (obj_provinces.payload) {
      let provincs: ProvinceResponse[] = obj_provinces.payload;
      provinces_prepared = prepareToSelect(
        provincs,
        'provinceName',
        'provinceID'
      );
      provinces.value = provinces_prepared;
      provincesOptions.value = provinces_prepared;
    }
  }

  mode.value = route.query?.mode ? route.query?.mode.toString() : 'add';
  if (mode.value == 'add') {
    title.value = 'Adicionar usuario';
  } else {
    title.value = 'Modificar usuario';
    id.value = route.query?.payload ? route.query?.payload.toString() : null;
    if (id.value != null) {
      const recuperate = await getByIdUser(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          nombre.value = payload.user.namePerson;
          apellido1.value = payload.user.firstLastNamePerson;
          apellido2.value = payload.user.secondLastNamePerson;
          correo.value = payload.user.emailPerson;
          ci.value = payload.user.identityCardPerson;
          status.value = payload.user.activePerson;
          usuario.value = payload.user.usernamePerson;
          genero.value = payload.user.genderPerson;
          const traspaso: string[] = payload.user.rols.map(
            (rolid: RoleResponse) => rolid.pkRol
          );
          role.value = traspaso;
          province.value = {
            label: payload.province.provinceName,
            value: payload.province.provinceID,
          };
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
        <div class="row">
          <div class="col-3 q-pa-sm">
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
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="apellido1"
              label="Primer apellido *"
              hint="tu primer apellido"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu primer apellido',
              ]"
            />
          </div>
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="apellido2"
              label="Segundo apellido *"
              hint="tu segundo apellido"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu segundo apellido',
              ]"
            />
          </div>
          <div class="col-3 q-pa-sm">
            <div class="q-gutter-sm">
              <q-option-group
                :options="generos"
                type="radio"
                v-model="genero"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="correo"
              label="Correo electrónico *"
              hint="tu correo electrónico"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu correo electrónico',
                (val) =>
                  (val && validateEmail(val)) ||
                  'Por favor introduce un correo electrónico válido',
              ]"
            />
          </div>
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
              v-model="ci"
              label="CI *"
              hint="tu carnet de identidad"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu carnet de identidad',
                (val) =>
                  (val && validateCI(val)) ||
                  'Por favor introduce un carnet de identidad válido',
              ]"
            />
          </div>
          <div class="col-3 q-pa-sm">
            <q-input
              dense
              outlined
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
          <div class="col-3 q-pa-sm">
            <q-toggle
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
                  (val && val.length > 0) || 'Por favor repite tu contraseña',
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
          <div class="col-3 q-pa-sm">
            <q-select
              outlined
              dense
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
                  (val && val.length > 0) || 'Por favor selecciona algun rol',
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
            <q-checkbox v-model="status" label="Activo" />
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pa-sm">
            <q-select
              dense
              outlined
              transition-show="scale"
              transition-hide="scale"
              v-model="province"
              use-input
              input-debounce="0"
              label="Provincia *"
              hint="tu provincia aqui"
              :options="provinces"
              @filter="filterFnProv"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val != null) || 'Por favor selecciona una provincia',
              ]"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div>
          <q-btn label="Aceptar" type="submit" color="primary" />
          <q-btn
            label="Cancelar"
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

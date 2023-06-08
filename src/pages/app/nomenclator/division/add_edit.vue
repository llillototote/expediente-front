<script setup lang="ts">
import { Notify } from 'quasar';
import { SelectField } from 'src/common/interface/util';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { newEmailIsValid } from 'src/common/validations/validate';
import { prepareToSelect } from 'src/services/util';

import { getAllProvinces } from 'src/services/external/nomenclator/province';
import { NAMESROUTES } from 'src/services/external/permisionDTO';
import { useLoadingStore } from 'src/stores/loading-store';
import {
  getByIdDivision,
  createDivision,
  updateDivision,
} from 'src/services/external/nomenclator/division';
import {
  DivisionCreateRequest,
  DivisionShort,
} from 'src/services/external/nomenclator/divisionDTO';
import { ProvinceResponse } from 'src/services/external/nomenclator/provinceDTO';
import { DivisionUpdateRequest } from 'src/services/external/nomenclator/divisionDTO';

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
const province = ref<SelectField | null>(null);

// FORM HELP

const refresh = ref<number>(0);
const provinces = ref<SelectField[]>([]);
const provincesOptions = ref<SelectField[]>([]);

// END FORM HELP
// END FORM

// METHODS FORM
async function onSubmit() {
  if (mode.value == 'add') {
    if (province.value != null) {
      const payload: DivisionCreateRequest = {
        descriptionTerritorialDivision: descripcion.value.trim(),
        nameTerritorial: nombre.value.trim(),
        fkProvince: province.value.value,
      };
      const resp = await createDivision(payload);
      console.log(resp);
      if (resp.status == 200) {
        Notify.create({
          message: 'Correcto, division creada satisfactoria!',
          textColor: 'white',
          color: 'green',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.APP_DIVISION_LIST });
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
    if (province.value != null) {
      const payload: DivisionUpdateRequest = {
        nameTerritorial: nombre.value.trim(),
        descriptionTerritorialDivision: descripcion.value.trim(),
        fkProvince: province.value.value,
      };
      const resp = await updateDivision(id.value, payload);
      console.log(resp);
      if (resp.status == 200) {
        Notify.create({
          message: 'Correcto, division actualizada satisfactoria!',
          textColor: 'white',
          color: 'green',
          position: 'top-right',
        });
        router.push({ name: NAMESROUTES.APP_DIVISION_LIST });
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
  router.push({ name: NAMESROUTES.APP_DIVISION_LIST });
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
  loadingStore.active();

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
    title.value = 'Adicionar division';
  } else {
    title.value = 'Modificar division';
    id.value = route.query?.payload ? route.query?.payload.toString() : null;
    if (id.value != null) {
      const recuperate = await getByIdDivision(id.value);
      if (recuperate.status == 200) {
        const { payload } = recuperate;
        if (payload != null) {
          nombre.value = payload.nameTerritorial;
          descripcion.value = payload.descriptionTerritorialDivision;
          const provFind = provinces.value.find(
            (prov) => prov.value == payload.fkProvince
          );
          if (provFind) province.value = provFind;
        } else alert('payload vacio');
      } else alert('division no recuperado');
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

        <div class="row">
          <div class="col-6 q-pa-sm">
            <q-input
              v-model="descripcion"
              dense
              outlined
              type="textarea"
              label="Descripcion *"
              hint="Descripcion"
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

<script setup lang="ts">
import { SelectField } from 'src/common/interface/util';
import { reactive, ref, computed, onMounted } from 'vue';
import { getAllProvinces } from '../../services/external/nomenclador';
import { prepareToSelect } from '../../services/util';
//import loadingAndConfiguring from '../../components/generic/loading/loadingAndConfiguring.vue';

const estadoLogin = ref<string>('');
const loading = ref<boolean>(false);
const exitCountActive = ref<boolean>(false);
const exitCountExpired = ref<boolean>(false);
const exist_user_binding = ref<boolean>(false);
const exist_sesion = ref<boolean>(false);

interface ProvinciaControl {
  model: null | string;
  stringOptions: SelectField[];
  options: SelectField[];
}

const select_prov: ProvinciaControl = reactive({
  model: null,
  stringOptions: [],
  options: [],
});

const filterFnProv = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      select_prov.options = select_prov.stringOptions;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    select_prov.options = select_prov.stringOptions.filter(
      (v: any) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const LOGGE_USER = reactive({
  avatar: '',
  correo: '',
  usuario: '',
});

const user_finded = reactive({
  correo: '',
  usuario: '',
  activo: false,
  enlinea: false,
});

const form = reactive({
  isPwd: true,
  isPwdRe: true,
  user: '',
  password: '',
});

const canSubmitLoginUser = computed(() => {
  return true;
});
const canSubmitSearchUser = computed(() => {
  return true;
});

const useOtherCount = () => console.log('method');
const onReset = () => console.log('method');
const onSubmit = () => console.log('method');
const loadForm = () => true;
const obtenerUsuarioSiExiste = () => console.log('method');
const verifyToken = () => console.log('method');
const logout = () => console.log('method');

onMounted(async () => {
  let obj_provincias = await getAllProvinces();
  console.log(obj_provincias);
  let prov_prepared: SelectField[] = [];
  if (obj_provincias.status == 200) {
    if (obj_provincias.payload != null) {
      let provincias = obj_provincias.payload;
      prov_prepared = await prepareToSelect(
        provincias,
        'provinceName',
        'provinceID'
      );
    }
  }

  select_prov.options = prov_prepared;
  select_prov.stringOptions = prov_prepared;
});
</script>
<template>
  <q-page class="q-pa-md">
    <!--<loadingAndConfiguring
        :triger="loading"
        :key="loading"
        message="Cargando..."
      />-->

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row">
        <div class="col-11 offset-1">
          <div class="row">
            <div class="col-5 q-pa-sm">
              <q-input
                dense
                outlined
                v-model="form.user"
                label="Usuario *"
                hint="tu usuario aqui"
              />
            </div>
            <div class="col-5 q-pa-sm">
              <q-select
                dense
                outlined
                transition-show="scale"
                transition-hide="scale"
                v-model="select_prov.model"
                use-input
                input-debounce="0"
                label="Provincia *"
                hint="tu provincia aqui"
                :options="select_prov.options"
                @filter="filterFnProv"
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
            <div class="col-5 q-pa-sm">
              <q-input
                dense
                outlined
                v-model="form.user"
                label="Correo electrónico *"
                hint="correo valido"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-5 q-pa-sm">
              <q-input
                dense
                label="Contraseña *"
                ref="fieldPass"
                v-model="form.password"
                outlined
                :type="form.isPwd ? 'password' : 'text'"
                :hint="estadoLogin"
                autocomplete="off"
              >
                <template v-slot:append>
                  <q-icon
                    :name="form.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="form.isPwd = !form.isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-5 q-pa-sm">
              <q-input
                dense
                label="Confirmar contraseña *"
                ref="fieldPass"
                v-model="form.password"
                outlined
                :type="form.isPwdRe ? 'password' : 'text'"
                :hint="estadoLogin"
                autocomplete="off"
              >
                <template v-slot:append>
                  <q-icon
                    :name="form.isPwdRe ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="form.isPwdRe = !form.isPwdRe"
                  />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col-5 q-pa-sm q-mt-2">
              <q-btn
                label="Aceptar"
                type="submit"
                color="primary"
                :disable="!canSubmitSearchUser"
              />
              <q-btn
                label="Limpiar"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

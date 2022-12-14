<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { obtenerProvincias } from '../../services/external/nomenclador';
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
  isPwd: false,
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
  let obj_provincias = await obtenerProvincias();
  console.log(obj_provincias);
  let prov_prepared = [];
  if (obj_provincias.status == 200) {
    let provincias = obj_provincias.data;
    prov_prepared = await prepareToSelect(provincias, 'name', 'id');
  }

  select_prov.options = prov_prepared;
  select_prov.stringOptions = prov_prepared;
});
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="width: 400px">
      <!--<loadingAndConfiguring
        :triger="loading"
        :key="loading"
        message="Cargando..."
      />-->

      <q-form class="q-gutter-md" v-if="exitCountActive">
        <q-card class="my-card no-shadow">
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle2">Sesión activa</div>
            <div class="text-subtitle1">Puede continuar como:</div>
          </q-card-section>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ LOGGE_USER.avatar }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ LOGGE_USER.usuario }}</q-item-label>
              <q-item-label caption>{{ LOGGE_USER.correo }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-card-actions>
            <q-btn
              label="Continuar"
              type="button"
              @click="verifyToken"
              color="primary"
            />
            <q-btn
              label="Limpiar"
              type="button"
              @click="logout"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </q-card-actions>
        </q-card>
      </q-form>

      <q-form class="q-gutter-md" v-if="exitCountExpired">
        <q-card class="my-card no-shadow">
          <q-card-section class="bg-warning text-white">
            <div class="text-subtitle2">Sesión expirada</div>
            <div class="text-subtitle1">
              Esta sesión lleva activa hace mucho tiempo
            </div>
          </q-card-section>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ LOGGE_USER.avatar }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ LOGGE_USER.usuario }}</q-item-label>
              <q-item-label caption>{{ LOGGE_USER.correo }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-card-actions>
            <q-btn
              label="Limpiar"
              @click="logout"
              type="button"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </q-card-actions>
        </q-card>
      </q-form>

      <q-form
        @submit="obtenerUsuarioSiExiste"
        @reset="onReset"
        class="q-gutter-md"
        v-show="!exist_user_binding"
        v-if="!exist_sesion"
      >
        <q-card class="my-card no-shadow">
          <q-card-section>
            <q-select
              filled
              transition-show="scale"
              transition-hide="scale"
              v-model="select_prov.model"
              use-input
              input-debounce="0"
              label="Filtra tu Provincia"
              hint="tu provincia aqui"
              :options="select_prov.options"
              @filter="filterFnProv"
              behavior="dialog"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-card-section>
            <q-input
              filled
              v-model="form.user"
              label="Teclea tu usuario *"
              hint="tu usuario aqui"
            />
          </q-card-section>

          <q-card-actions>
            <q-btn
              label="Acceder"
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
          </q-card-actions>
        </q-card>
      </q-form>

      <div class="q-gutter-md" v-show="exist_user_binding" v-if="!exist_sesion">
        <q-card class="my-card no-shadow">
          <q-item>
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                v-if="user_finded.usuario"
              >
                {{ user_finded.usuario[0] + user_finded.usuario[1] }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ user_finded.usuario }}</q-item-label>
              <q-item-label caption>{{ user_finded.correo }} </q-item-label>
            </q-item-section>
          </q-item>

          <q-card-section v-if="!user_finded.activo">
            <q-banner inline-actions rounded class="bg-orange text-white">
              <template v-slot:avatar>
                <q-icon name="no_accounts" />
              </template>
              El usuario no está activo.
            </q-banner>
          </q-card-section>

          <q-card-section v-if="user_finded.enlinea">
            <q-banner inline-actions rounded class="bg-orange text-white">
              <template v-slot:avatar>
                <q-icon name="no_accounts" />
              </template>
              El usuario ya tiene una sesión iniciada.
            </q-banner>
          </q-card-section>
          <q-card-section v-if="loadForm()">
            <q-input
              ref="fieldPass"
              v-model="form.password"
              filled
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
          </q-card-section>

          <q-card-actions>
            <q-btn
              v-if="user_finded.activo && !user_finded.enlinea"
              label="Acceder"
              @click="onSubmit"
              color="primary"
              :disable="!canSubmitLoginUser"
            />
            <q-btn
              v-if="user_finded.activo && !user_finded.enlinea"
              label="Limpiar"
              @click="onReset"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              label="Usar otra Cuenta"
              type="button"
              @click="useOtherCount"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

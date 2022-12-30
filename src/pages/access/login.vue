<script setup lang="ts">
import { SelectField } from 'src/common/interface/util';
import { getAllPermision } from 'src/services/external/permision';
import { login } from 'src/services/external/user';
import { usePermisionStore } from 'src/stores/permision-store';
import { useUserStore } from 'src/stores/user-store';
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
//import loadingAndConfiguring from '../../components/generic/loading/loadingAndConfiguring.vue';

const estadoLogin = ref<string>('Intentos de acceso');
const loading = ref<boolean>(false);
const exitCountActive = ref<boolean>(false);
const exitCountExpired = ref<boolean>(false);
const exist_user_binding = ref<boolean>(false);
const exist_sesion = ref<boolean>(false);

const userStore = useUserStore();
const permisionStore = usePermisionStore();
const router = useRouter();

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
  user: '', //'super_admin',
  password: '', //'CpxPrivado2022**'
});

const canSubmitLoginUser = computed(() => {
  return true;
});
const canSubmitSearchUser = computed(() => {
  return true;
});

const useOtherCount = () => console.log('method');
const onReset = () => console.log('method');
const onSubmit = async () => {
  const resp = await login({ username: form.user, password: form.password });
  if (resp.status == 200) {
    if (resp.payload) {
      userStore.loginSuccess(resp.payload);
      const per = await getAllPermision();
      console.log(per);
      if (per.status == 200) {
        if (per.payload) {
          permisionStore.setPermisionsApp(
            per.payload,
            resp.payload.listPermits
          );
          console.log('permisos desplegados');
        }
      }
      router.push({ name: 'app' });
    }
  }
};
const loadForm = () => true;
const obtenerUsuarioSiExiste = () => console.log('method');
const verifyToken = () => console.log('method');
const logout = () => console.log('method');

onMounted(() => {
  console.log('montado');
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
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        v-if="!exist_sesion"
      >
        <q-card class="my-card no-shadow">
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="form.user"
              label="Usuario *"
              hint="tu usuario aqui"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) ||
                  'Por favor introduce tu usuario',
              ]"
            />
          </q-card-section>

          <q-card-section>
            <q-input
              dense
              label="Contraseña *"
              ref="fieldPass"
              v-model="form.password"
              outlined
              :type="form.isPwd ? 'password' : 'text'"
              :hint="estadoLogin"
              autocomplete="off"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Por favor introduce tu contraseña',
              ]"
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
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Por favor introduce tu contraseña',
              ]"
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

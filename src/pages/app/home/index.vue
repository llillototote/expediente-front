<script setup lang="ts">
import { SelectField } from 'src/common/interface/util';
import { reactive, ref, computed, onMounted } from 'vue';
//import loadingAndConfiguring from '../../components/generic/loading/loadingAndConfiguring.vue';

const estadoLogin = ref<string>('Intentos de acceso');
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

onMounted(() => {
  console.log('montado');
});
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md" style="width: 500px">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <img src="../../../../public/copextel.png" alt="" class="" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

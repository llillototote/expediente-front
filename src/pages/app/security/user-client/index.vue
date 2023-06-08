<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import {
  deleteByIdUserClient,
  getAllUserClient,
} from 'src/services/external/userClient';
import { maskObject } from 'src/services/util';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { UserClientResponse } from 'src/services/external/userClientDTO';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.USUARIO))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Editar',
    icon: 'edit_note',
  });
if (permisionStore.havePermision('deleteById', ENTITY.USUARIO))
  actions.push({
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    tooltip: 'Eliminar',
    icon: 'delete',
  });

const refresh = ref(0);

async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    'Quieres eliminar el usuario',
    `Estás seguro que deseas eliminar el usuario ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdUserClient(row['pkUser']);
    if (resp.status == 200) {
      await listarUsuarios();
      Notify.create({
        message: 'Info, usuario eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el usuario!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_USER_CLIENT_WRITE,
    query: { mode: 'edit', payload: row['pkUser'] },
  });
}

async function listarUsuarios() {
  const resp = await getAllUserClient();
  if (resp.status == 200) {
    const mask: Mask<UserClientResponse> = {
      nameUser: 'nombre',
      usernameUser: 'usuario',
      phoneUser: 'teléfono',
      emailUser: 'correo',
      companyUser: 'empresa',
      activeUser: 'estado',
      identityCardUser: 'identityCardUser',
      pkUser: 'pkUser',
      rols: 'rols',
      provinceUser: 'provinceUser',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
}

onMounted(async () => {
  loadingStore.active();
  await listarUsuarios();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <table-component
        v-if="permisionStore.havePermision('listAll', ENTITY.USUARIO)"
        :key="refresh"
        title="Usuarios externos"
        :data="seed"
        option="nombre"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['pkUser', 'rols', 'identityCardUser', 'provinceUser', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>

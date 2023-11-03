<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction, ResponseExternal } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import {
  deleteByIdUser,
  getAllUser,
} from 'src/services/api/auth/user/user.service';
import { maskObject } from 'src/services/util';
import { NAMESROUTES } from 'src/config/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermissionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { UserResponse } from 'src/services/api/auth/user/user.types';

// USE GENERAL
const router = useRouter();
const permissionStore = usePermissionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permissionStore.havePermission('UPDATE_USER'))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Editar',
    icon: 'edit_note',
  });
if (permissionStore.havePermission('DELETE_USER'))
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
    `Estás seguro que deseas eliminar el usuario ${row['USUARIO']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdUser(row['pkPerson']);
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
    name: NAMESROUTES.APP_USER_WRITE,
    query: { mode: 'edit', payload: row['pkPerson'] },
  });
}

async function listarUsuarios() {
  const resp: ResponseExternal<UserResponse[]> = await getAllUser();
  if (resp.status == 200) {
    const mask: Mask<UserResponse> = {
      id: 'id',
      username: 'USUARIO',
      email: 'CORREO',
      roles: 'roles',
      createdAt: 'FECHA_CREADO',
      updatedAt: 'FECHA_MODIFICADO',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  } else if (resp.status == 401) router.push({ name: NAMESROUTES.LOGIN });
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
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permissionStore.havePermission('CREATE_USER')"
          color="primary"
          label="Adicionar"
          :to="{ name: NAMESROUTES.APP_USER_WRITE, query: { mode: 'add' } }"
        />
      </div>

      <table-component
        v-if="permissionStore.havePermission('ALL_USER')"
        :key="refresh"
        title="Usuarios"
        :data="seed"
        option="USUARIO"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['id', 'roles', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>

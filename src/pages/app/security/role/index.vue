<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import {
  ButtonAction,
  ResponseExternal,
  SelectField,
} from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import {
  deleteByIdRole,
  getAllRole,
} from 'src/services/api/auth/role/role.service';
import { maskObject, prepareToSelect } from 'src/services/util';
import { RoleResponse } from 'src/services/api/auth/role/role.types';
import { NAMESROUTES } from 'src/config/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermissionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';

// USE GENERAL
const router = useRouter();
const permissionStore = usePermissionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permissionStore.havePermission('UPDATE_ROLE'))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Editar',
    icon: 'edit_note',
  });
if (permissionStore.havePermission('DELETE_ROLE'))
  actions.push({
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    tooltip: 'Eliminar',
    icon: 'delete',
  });

const refresh = ref(0);
const loadingBtn = ref<boolean>(false);
async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    'Quieres eliminar el rol',
    `Estás seguro que deseas eliminar el rol ${row['NOMBRE']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdRole(row['id']);
    if (resp.status == 200) {
      await listarRoles();
      Notify.create({
        message: 'Info, rol eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el rol!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_ROLE_WRITE,
    query: { mode: 'edit', payload: row['id'] },
  });
}

async function listarRoles() {
  const resp: ResponseExternal<RoleResponse[]> = await getAllRole();
  if (resp.status == 200) {
    const mask: Mask<RoleResponse> = {
      id: 'id',
      name: 'NOMBRE',
      description: 'DESCRIPCIÓN',
      permissions: 'permissions',
      createdAt: 'FECHA_CREADO',
      updatedAt: 'FECHA_MODIFICADO',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
}

async function sync() {
  loadingBtn.value = true;
  loadingBtn.value = false;
}

onMounted(async () => {
  loadingStore.active();
  await listarRoles();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <div class="row">
          <div class="col s2">
            <q-btn
              v-if="permissionStore.havePermission('CREATE_ROLE')"
              color="primary"
              label="Adicionar"
              :to="{ name: NAMESROUTES.APP_ROLE_WRITE, query: { mode: 'add' } }"
            />
          </div>
        </div>
      </div>

      <table-component
        v-if="permissionStore.havePermission('ALL_ROLE')"
        :key="refresh"
        title="Roles"
        :data="seed"
        option="DESCRIPCIÓN"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['id', 'permissions', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>

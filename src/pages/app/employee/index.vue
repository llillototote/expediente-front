<script setup lang="ts">
import { Notify } from 'quasar';
import { ACTIONS } from 'src/common/enum/actions';
import { useRouter } from 'vue-router';
import { usePermissionStore } from 'src/stores/permision-store';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ButtonAction } from 'src/common/interface/util';
import { maskObject } from 'src/services/util';
import { Mask } from 'src/services/external/utilDTO';
import { useLoadingStore } from 'src/stores/loading-store';
import { NAMESROUTES } from 'src/config/permisionDTO';
import promiseDialog from 'src/services/promiseDialog';
import {
  deleteByIdEmployee,
  getAllEmployee,
} from 'src/services/api/bussiness/employee/employee.service';
import { EmployeeResponse } from 'src/services/api/bussiness/employee/employee.types';

// USE GENERAL
const router = useRouter();
const permissionStore = usePermissionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permissionStore.havePermission('UPDATE_EMPLOYEE'))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    tooltip: 'Editar',
    icon: 'edit_note',
  });
if (permissionStore.havePermission('DELETE_EMPLOYEE'))
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
    'Quieres eliminar el departamento',
    `Estás seguro que deseas eliminar el departamento ${row['NOMBRE']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdEmployee(row['id']);
    if (resp.status == 204) {
      await listarAllEmployee();
      Notify.create({
        message: 'Info, departamento eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else if (resp.status == 401) {
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el departamento!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
      router.push({ name: NAMESROUTES.LOGIN });
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

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_EMPLOYEE_WRITE,
    query: { mode: 'edit', payload: row['id'] },
  });
}

async function listarAllEmployee() {
  const resp = await getAllEmployee();
  if (resp.status == 200) {
    const mask: Mask<EmployeeResponse> = {
      id: 'id',
      name: 'NOMBRE',
      address: 'DIRECCION',
      dateBirtday: 'FECHA_CUMPLEANOS',
      email: 'CORREO',
      lastName: 'APELLIDOS',
      phone: 'TELEFONO',
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
  await listarAllEmployee();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permissionStore.havePermission('CREATE_EMPLOYEE')"
          color="primary"
          label="Adicionar"
          :to="{
            name: NAMESROUTES.APP_EMPLOYEE_WRITE,
            query: { mode: 'add' },
          }"
        />
      </div>

      <table-component
        :key="refresh"
        title="Empleados"
        :data="seed"
        option="NOMBRE"
        :actions="actions"
        :hide="['index', 'id']"
        @delete="eliminar"
        @edit="editar"
      >
      </table-component>
    </div>
  </q-page>
</template>

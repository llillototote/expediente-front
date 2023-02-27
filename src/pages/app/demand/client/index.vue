<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref, toRefs } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { deleteByIdUser } from 'src/services/external/user';
import { getAllClient, uploadListClient } from 'src/services/external/client';
import { maskObject } from 'src/services/util';
import { UserResponse } from 'src/services/external/userDTO';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { ClientResponse } from 'src/services/external/clientDTO';
import { useLoadingStore } from 'src/stores/loading-store';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.CLIENTE))
  actions.push({
    action: ACTIONS.edit,
    color: 'grey',
    text_color: 'white',
    icon: 'edit_note',
  });
if (permisionStore.havePermision('deleteById', ENTITY.CLIENTE))
  actions.push({
    action: ACTIONS.delete,
    color: 'primary',
    text_color: 'white',
    icon: 'delete',
  });

const refresh = ref(0);
const uploader = ref(null);

async function eliminar(payload: any) {
  const { row } = payload;
  let desicion = await promiseDialog.confirm(
    `Quieres eliminar el usuario`,
    `Estás seguro que deseas eliminar el cliente con code ${row['codeClient']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdUser(row['idClient']);
    if (resp.status == 200) {
      await listarClientes();
      Notify.create({
        message: `Info, usuario eliminado satisfactoriamente!`,
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: `Advertencia, No se pudo eliminar el cliente!`,
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_CLIENT_WRITE,
    query: { mode: 'edit', payload: row['idClient'] },
  });
}

async function listarClientes() {
  const resp = await getAllClient();
  if (resp.status == 200) {
    const mask: Mask<ClientResponse> = {
      idClient: 'idClient',
      codeClient: 'codigo',
      nameClient: 'nombre',
      provinceClient: 'provincia',
      codeStatus: 'cod_estado',
      statusClient: 'estado_cliente',
      dateValidClient: 'fecha_valid',
      userName: 'usuario',
      demands: 'demands',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: any) => maskObject(item, mask));
      seed.value = re;
    }

    refresh.value++;
  }
}

async function factoryFn(files: any, updateProgress: any) {
  const params = {
    file: files[0],
  };

  console.log(params);
  const resp = await uploadListClient(params);
  console.log(resp);
  if (resp.status == 200) {
    Notify.create({
      message: `Correcto, fichero importado satisfactoriamente!`,
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });
    uploader.value.reset();
    loadingStore.active();
    await listarClientes();
    loadingStore.inactive();
  } else {
    Notify.create({
      message: resp.error,
      textColor: 'white',
      color: 'warning',
      position: 'top-right',
    });
  }
}

function onRejected(rejectedEntries: any) {
  Notify.create({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
}

onMounted(async () => {
  loadingStore.active();
  await listarClientes();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <!--<q-btn
          v-if="permisionStore.havePermision('create', ENTITY.CLIENTE)"
          color="primary"
          label="Adicionar"
          :to="{ name: NAMESROUTES.APP_CLIENT_WRITE, query: { mode: 'add' } }"
        />-->
        <q-uploader
          style="max-width: 300px"
          :factory="factoryFn"
          ref="uploader"
          label="Subir fichero excel de clientes"
          accept=".xlsx,
           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
         application/vnd.ms-excel"
          @rejected="onRejected"
        />
      </div>

      <table-component
        v-if="permisionStore.havePermision('listAll', ENTITY.CLIENTE)"
        :key="refresh"
        title="Clientes"
        :data="seed"
        option="codeClient"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['idClient', 'demands', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import { maskObject } from 'src/services/util';
import { Mask } from 'src/services/external/utilDTO';
import { useLoadingStore } from 'src/stores/loading-store';
import { usePermisionStore } from 'src/stores/permision-store';
import {
  deleteByIdCompany,
  getAllCompany,
  uploadListCompany,
} from 'src/services/external/nomenclator/company';
import { CompanyResponse } from 'src/services/external/nomenclator/companyDTO';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import promiseDialog from 'src/services/promiseDialog';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const uploader = ref(null);
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
    'Quieres eliminar la empresa',
    `Estás seguro que deseas eliminar la empresa ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdCompany(row['idCompany']);
    if (resp.status == 200) {
      await listarEmpresas();
      Notify.create({
        message: 'Info, empresa eliminada satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar la empresa!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_COMPANY_WRITE,
    query: { mode: 'edit', payload: row['idCompany'] },
  });
}

async function listarEmpresas() {
  const resp = await getAllCompany();
  if (resp.status == 200) {
    const mask: Mask<CompanyResponse> = {
      idCompany: 'idCompany',
      nameCompany: 'nombre',
      acronymCompany: 'acrónimo',
      descriptionCompany: 'descripción',
      addressCompany: 'dirección',
      codeCompany: 'código',
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

  const resp = await uploadListCompany(params);
  if (resp.status == 200) {
    Notify.create({
      message: 'Correcto, fichero importado satisfactoriamente!',
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });
    uploader.value.reset();
    loadingStore.active();
    await listarEmpresas();
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
  await listarEmpresas();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <div class="row">
          <div class="col">
            <q-btn
              v-if="permisionStore.havePermision('create', ENTITY.USUARIO)"
              color="primary"
              label="Adicionar"
              :to="{
                name: NAMESROUTES.APP_COMPANY_WRITE,
                query: { mode: 'add' },
              }"
            />
          </div>
          <div class="col">
            <q-uploader
              style="max-width: 300px"
              :factory="factoryFn"
              ref="uploader"
              label="Subir fichero excel de empresas"
              accept=".xlsx,
           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
         application/vnd.ms-excel"
              @rejected="onRejected"
            />
          </div>
        </div>
      </div>

      <table-component
        :key="refresh"
        title="Empresas"
        :data="seed"
        option="nombre"
        :actions="actions"
        :hide="['idCompany', 'index']"
        @delete="eliminar"
        @edit="editar"
      >
      </table-component>
    </div>
  </q-page>
</template>

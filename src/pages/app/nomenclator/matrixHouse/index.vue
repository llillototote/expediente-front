<script setup lang="ts">
import { Notify } from 'quasar';
import { ACTIONS } from 'src/common/enum/actions';
import { useRouter } from 'vue-router';
import { usePermisionStore } from 'src/stores/permision-store';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ButtonAction } from 'src/common/interface/util';
import { maskObject } from 'src/services/util';
import { Mask } from 'src/services/external/utilDTO';
import { useLoadingStore } from 'src/stores/loading-store';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import promiseDialog from 'src/services/promiseDialog';
import {
  getAllMatrixHouse,
  getByIdMatrixHouse,
} from 'src/services/external/nomenclator/matrixHouse';
import { MatrixHouseResponse } from 'src/services/external/nomenclator/matrixHouseDTO';

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
    'Quieres eliminar la casa matriz',
    `Estás seguro que deseas eliminar la casa matriz ${row['nombre']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await getByIdMatrixHouse(row['pkMatrixHouse']);
    if (resp.status == 200) {
      await listarCasasMatrices();
      Notify.create({
        message: 'Info, casa matriz eliminada satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar la casa matriz!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_MATRIX_WRITE,
    query: { mode: 'edit', payload: row['pkMatrixHouse'] },
  });
}

async function listarCasasMatrices() {
  const resp = await getAllMatrixHouse();
  if (resp.status == 200) {
    const mask: Mask<MatrixHouseResponse> = {
      pkMatrixHouse: 'pkMatrixHouse',
      codeMatrixHouse: 'código',
      nameHouse: 'nombre',
      descriptionMatrixHouse: 'descripción',
      categoryMatrixHouse: 'categoria',
      provinceMatrixHouse: 'provincia',
      deletedHouse: 'deletedHouse',
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
  await listarCasasMatrices();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.USUARIO)"
          color="primary"
          label="Adicionar"
          :to="{ name: NAMESROUTES.APP_MATRIX_WRITE, query: { mode: 'add' } }"
        />
      </div>

      <table-component
        :key="refresh"
        title="Casas Matrices"
        :data="seed"
        option="nombre"
        :actions="actions"
        :hide="['pkMatrixHouse', 'index', 'deletedHouse']"
        @delete="eliminar"
        @edit="editar"
      >
      </table-component>
    </div>
  </q-page>
</template>

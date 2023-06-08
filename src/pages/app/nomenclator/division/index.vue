<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import promiseDialog from 'src/services/promiseDialog';
import { maskObject } from 'src/services/util';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import {
  deleteByIdDivision,
  getAllDivision,
} from 'src/services/external/nomenclator/division';
import { DivisionShort } from 'src/services/external/nomenclator/divisionDTO';

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
    'Quieres eliminar la división',
    `Estás seguro que deseas eliminar la división ${row['division']} ?`,
    'Aceptar'
  );
  if (desicion) {
    const resp = await deleteByIdDivision(row['pkTerritorialDivision']);
    if (resp.status == 200) {
      await listarDivisiones();
      Notify.create({
        message: 'Info, división eliminado satisfactoriamente!',
        textColor: 'white',
        color: 'blue',
        position: 'top-right',
      });
    } else
      Notify.create({
        message: 'Advertencia, No se pudo eliminar el división!',
        textColor: 'white',
        color: 'warning',
        position: 'top-right',
      });
  }
}

function editar(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_DIVISION_WRITE,
    query: { mode: 'edit', payload: row['pkTerritorialDivision'] },
  });
}

async function listarDivisiones() {
  const resp = await getAllDivision();
  if (resp.status == 200) {
    const mask: Mask<DivisionShort> = {
      pkTerritorialDivision: 'pkTerritorialDivision',
      fkProvince: 'provincia',
      nameTerritorial: 'division',
      descriptionTerritorialDivision: 'descripcion',
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
  await listarDivisiones();
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
          :to="{ name: NAMESROUTES.APP_DIVISION_WRITE, query: { mode: 'add' } }"
        />
      </div>

      <table-component
        :key="refresh"
        title="Divisiones"
        :data="seed"
        option="name"
        :actions="actions"
        @edit="editar"
        @delete="eliminar"
        :hide="['pkTerritorialDivision', 'index']"
      >
      </table-component>
    </div>
  </q-page>
</template>

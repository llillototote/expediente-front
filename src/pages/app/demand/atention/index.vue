<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref, computed } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction, SelectField } from 'src/common/interface/util';
import { useRouter } from 'vue-router';
import {
  atenderDemand,
  transferirDemand,
  getAllDemandByComercial,
} from 'src/services/external/demand';
import { maskObject, prepareToSelect } from 'src/services/util';
import {
  AtentionDemandRequest,
  TransferDemandRequest,
  DemandResponse,
  DemandResponseOriginal,
} from 'src/services/external/demandDTO';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { ModeSelection } from 'src/common/enum/framework';
import { getAllMatrixHouse } from 'src/services/external/nomenclator/matrixHouse';
import { getAllDivision } from 'src/services/external/nomenclator/division';
import { DivisionShort } from 'src/services/external/nomenclator/divisionDTO';
import { MatrixHouseResponse } from 'src/services/external/nomenclator/matrixHouseDTO';

// USE GENERAL
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL

const seed = ref<any[]>([]);

const divisionsData = ref<DivisionShort[]>([]);
const divisions = ref<SelectField[]>([]);
const division = ref<SelectField | null>();

const housesData = ref<MatrixHouseResponse[]>([]);
const houses = ref<SelectField[]>([]);
const house = ref<SelectField | null>();

//SELECTED TABLE
const dataSelected = ref<any[]>([]);
const eventSelected = (a: any) => {
  dataSelected.value = a;
  //refreshClient.value++;
};
const actions: ButtonAction[] = [];
if (permisionStore.havePermision('updateById', ENTITY.DEMANDA))
  actions.push({
    action: ACTIONS.edit,
    color: 'red',
    tooltip: 'Transferir',
    text_color: 'white',
    icon: 'alt_route',
    disabledCriteria: {
      field: 'estado',
      value: ['no Aprobada'],
    },
  });
if (permisionStore.havePermision('listById', ENTITY.DEMANDA))
  actions.push({
    action: ACTIONS.delete,
    color: 'blue',
    text_color: 'white',
    tooltip: 'Ver',
    icon: 'description',
    disabledCriteria: {
      field: 'estado',
      value: ['no Aprobada'],
    },
  });

const refresh = ref(0);
const transfer = ref(false);
const toTransfer = ref('division');
const whoTransfer = ref<string | 'multiple'>('');

const ican = computed(() => {
  return dataSelected.value.length > 0;
});

const selected_count = computed((): string => {
  return dataSelected.value.length > 0 ? `${dataSelected.value.length}` : '';
});

async function ver(payload: any) {
  const { row } = payload;
  router.push({
    name: NAMESROUTES.APP_ATENT_DEMAND,
    query: { mode: 'no-edit', payload: row['idDemand'] },
  });
}

function transferir(payload: any) {
  const { row } = payload;
  whoTransfer.value = row.idDemand;
  transfer.value = true;
}

function transferirMultiple() {
  whoTransfer.value = 'multiple';
  transfer.value = true;
}

async function transferirOperation() {
  let demandsID = [];
  if (whoTransfer.value == 'multiple') {
    demandsID = dataSelected.value.map((it) => it.idDemand);
  } else {
    demandsID = [whoTransfer.value];
  }
  transferirSelected(demandsID);
}

async function transferirSelected(demandsID: string[]) {
  const payload = {
    matrix: toTransfer.value == 'housematrix' ? house.value?.value : null,
    division: toTransfer.value == 'division' ? division.value?.value : null,
    demandsID,
  } as TransferDemandRequest;
  const resp = await transferirDemand(payload);
  if (resp.status == 200) {
    Notify.create({
      message:
        'Info, demandas seleccionadas fueron transferidas satisfactoriamente!',
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });
    await listarDemandas();
  } else {
    Notify.create({
      message: 'Error al transferir demandas',
      textColor: 'white',
      color: 'red',
      position: 'top-right',
    });
  }

  //clean form and close modal
  toTransfer.value = 'division';
  house.value = null;
  division.value = null;
  transfer.value = false;
}

async function listarDemandas() {
  const resp = await getAllDemandByComercial();
  if (resp.status == 200) {
    const mask: Mask<DemandResponseOriginal> = {
      idDemand: 'idDemand',
      codeDemand: 'codigo',
      registeredDate: 'fecha_solicitud',
      statusDemand: 'estado',
      demandClientDTO: 'demandClientDTO',
      demandProductDTOs: 'demandProductDTOs',
      totalPriceCLDemand: 'imp_CL',
      totalPriceCUPDemand: 'imp_CUP',
      totalPriceMLCDemand: 'imp_MLC',
    };
    if (resp.payload != null) {
      const re = resp.payload.map((item: DemandResponseOriginal) =>
        maskObject(item, mask)
      );
      seed.value = re;
    }

    refresh.value++;
  }
}

async function atenderDemandas(
  status: 'Aprobada' | 'Guardada' | 'EnProceso' | 'Atendida'
) {
  const payload = {
    status,
    demandsID: dataSelected.value.map((it) => it.idDemand),
  } as AtentionDemandRequest;
  const resp = await atenderDemand(payload);
  console.log(resp);
  if (resp.status == 200) {
    Notify.create({
      message: `Info, demandas seleccionadas cambiadas al estado de ${status} satisfactoriamente!`,
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });
    await listarDemandas();
  } else {
    Notify.create({
      message: resp.error,
      textColor: 'white',
      color: 'red',
      position: 'top-right',
    });
  }
}

const getAllDivisions = async () => {
  const resp = await getAllDivision();
  if (resp.status === 200 && resp.payload != null)
    divisionsData.value = resp.payload;
  const divisions_prepared = prepareToSelect(
    divisionsData.value,
    'nameTerritorial',
    'pkTerritorialDivision'
  );
  divisions.value = divisions_prepared;
};

const getAllHouses = async () => {
  const resp = await getAllMatrixHouse();
  if (resp.status === 200 && resp.payload != null)
    housesData.value = resp.payload;
  const houses_prepared = prepareToSelect(
    housesData.value,
    'nameHouse',
    'pkMatrixHouse'
  );
  houses.value = houses_prepared;
};

onMounted(async () => {
  loadingStore.active();
  await getAllDivisions();
  await getAllHouses();
  await listarDemandas();
  loadingStore.inactive();
});
</script>
<template>
  <q-page class="row">
    <div class="col s12">
      <div class="q-pa-md q-gutter-sm">
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Exportar"
          :to="{ name: NAMESROUTES.APP_ATENT_DEMAND, query: { mode: 'add' } }"
          :disable="!ican"
        >
          <q-tooltip class="bg-grey">Exportar demandas seleccionadas</q-tooltip>
        </q-btn>
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Liberar"
          @click="atenderDemandas('Guardada')"
          :disable="!ican"
        >
          <q-tooltip class="bg-grey"
            >Liberar demandas seleccionadas para que el cliente la
            modifique</q-tooltip
          >
        </q-btn>
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Aplicar"
          @click="atenderDemandas('EnProceso')"
          :disable="!ican"
        >
          <q-tooltip class="bg-grey"
            >Las demandas seleccionadas pasan a estado de en
            EnProceso</q-tooltip
          >
        </q-btn>
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Guardar"
          @click="atenderDemandas('Atendida')"
          :disable="!ican"
        >
          <q-tooltip class="bg-grey"
            >Las demandas seleccionadas pasan a estado de atendidas</q-tooltip
          >
        </q-btn>
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Transferir"
          @click="transferirMultiple()"
          :disable="!ican"
        >
          <q-tooltip class="bg-grey"
            >Las demandas seleccionadas pasan a estado de transferida</q-tooltip
          >
        </q-btn>
        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Cancelar"
          :to="{ name: NAMESROUTES.APP_HOME }"
        />
      </div>

      <table-component
        :key="refresh"
        title="Demandas de clientes"
        :data="seed"
        option="descripcion"
        :actions="actions"
        @edit="transferir"
        @delete="ver"
        :hide="['idDemand', 'demandClientDTO', 'demandProductDTOs', 'index']"
        :selection="ModeSelection.multiple"
        :selectedProps="dataSelected"
        @selected="eventSelected"
      >
      </table-component>

      <q-dialog
        v-model="transfer"
        transition-show="rotate"
        transition-hide="rotate"
      >
        <q-card>
          <q-form @submit.prevent="transferirOperation()">
            <q-card-section>
              <div class="text-h6">Transferir demanda</div>
            </q-card-section>

            <q-card-section style="max-height: 50vh" class="scroll">
              <p>Desea tranferir la demanda a una División o Casa Matriz?</p>

              <q-list>
                <!--
        Rendering a <label> tag (notice tag="label")
        so QRadios will respond to clicks on QItems to
        change Toggle state.
      -->

                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-radio v-model="toTransfer" val="division" color="teal" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>División</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-radio
                      v-model="toTransfer"
                      val="housematrix"
                      color="orange"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Casa Matriz</q-item-label>
                    <q-item-label caption
                      >Las casas matrices solo pertenecen a la provincia Habana
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section v-if="toTransfer == 'division'">
              <div class="col-3 q-pa-sm">
                <q-select
                  dense
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="division"
                  use-input
                  input-debounce="0"
                  label="División *"
                  hint="tu división aqui"
                  :options="divisions"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona una división',
                  ]"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card-section>

            <q-card-section v-else-if="toTransfer == 'housematrix'">
              <div class="col-3 q-pa-sm">
                <q-select
                  dense
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="house"
                  use-input
                  input-debounce="0"
                  label="Casa matriz *"
                  hint="tu casa matriz aqui"
                  :options="houses"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      'Por favor selecciona una casa matriz',
                  ]"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn flat label="Transferir" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

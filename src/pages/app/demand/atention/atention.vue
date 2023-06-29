<script setup lang="ts">
import { Notify } from 'quasar';
import { onMounted, ref, computed } from 'vue';
import tableComponent from 'components/generic/tablas/table.vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction, SelectField } from 'src/common/interface/util';
import { useRouter, useRoute } from 'vue-router';
import {
  comprarDemand,
  exportBuySolicitByDemand,
  exportCotizationByDemand,
  getAllPlaceToBuy,
  getByIdDemand,
} from 'src/services/external/demand';
import { maskObject, prepareToSelect } from 'src/services/util';
import {
  AtentionDemandRequest,
  OfferAndBuyRequest,
  TransferDemandRequest,
  DemandProductDTO,
  ProductForSaleDTO,
  PlaceToBuyResponse,
} from 'src/services/external/demandDTO';
import { ENTITY, NAMESROUTES } from 'src/services/external/permisionDTO';
import { Mask } from 'src/services/external/utilDTO';
import { usePermisionStore } from 'src/stores/permision-store';
import { useLoadingStore } from 'src/stores/loading-store';
import { ModeSelection } from 'src/common/enum/framework';

// USE GENERAL
const route = useRoute();
const router = useRouter();
const permisionStore = usePermisionStore();
const loadingStore = useLoadingStore();
// END USE GENERAL
const id = ref<string | null>(null);
const seed = ref<any[]>([]);

const placesData = ref<PlaceToBuyResponse[]>([]);
const places = ref<SelectField[]>([]);
const place = ref<SelectField | null>();

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
    tooltip: 'Atender',
    text_color: 'white',
    icon: 'all_inbox',
    disabledCriteria: {
      field: 'estado',
      value: ['no Aprobada'],
    },
  });

const refresh = ref(0);

const acomprar = ref(0);
const ofertado = ref(0);
const transfer = ref(false);
const whoBuy = ref<string | 'multiple'>('');

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
    query: { mode: 'no-edit', payload: row['idProduct'] },
  });
}

function comprar(payload: any) {
  const { row } = payload;
  whoBuy.value = row['idProduct'];
  acomprar.value = row['a_comprar'];
  ofertado.value = row['ofertado'];
  transfer.value = true;
}

function comprarMultiple() {
  whoBuy.value = 'multiple';
  acomprar.value = 0;
  ofertado.value = 0;
  transfer.value = true;
}

async function comprarOperation() {
  let productForSaleDTOs: ProductForSaleDTO[] = [];
  if (whoBuy.value == 'multiple') {
    productForSaleDTOs = dataSelected.value.map((it) => {
      return {
        productID: it['idProduct'],
        offered: ofertado.value,
        toBuy: acomprar.value,
        idPlaceToBuy: place.value?.value,
      } as ProductForSaleDTO;
    });
  } else {
    productForSaleDTOs = [
      {
        productID: whoBuy.value,
        offered: ofertado.value,
        toBuy: acomprar.value,
        idPlaceToBuy: place.value?.value,
      } as ProductForSaleDTO,
    ];
  }
  comprarSelected(productForSaleDTOs);
}

async function comprarSelected(productForSaleDTOs: ProductForSaleDTO[]) {
  const payload = {
    demandId: id.value,
    productForSaleDTOs,
  } as OfferAndBuyRequest;
  const resp = await comprarDemand(payload);
  if (resp.status == 200) {
    Notify.create({
      message:
        'Info, demandas seleccionadas fueron transferidas satisfactoriamente!',
      textColor: 'white',
      color: 'green',
      position: 'top-right',
    });

    await listarDemanda();
    //clean form and close modal

    ofertado.value = 0;
    acomprar.value = 0;
    transfer.value = false;
  }
}

async function listarDemanda() {
  if (id.value != null) {
    const resp = await getByIdDemand(id.value);
    if (resp.status == 200) {
      const mask: Mask<DemandProductDTO> = {
        idProduct: 'idProduct',
        codeProduct: 'código',
        descriptionProduct: 'descripción',
        umProduct: 'um',
        priceCLProduct: 'precio_CL',
        priceCUPProduct: 'precio_CUP',
        priceMLCProduct: 'precio_MLC',
        quantityProduct: 'cantidad',
        totalPriceCLProduct: 'imp_CL',
        totalPriceCUPProduct: 'imp_CUP',
        totalPriceMLCProduct: 'imp_MLC',
        offeredProduct: 'ofertado',
        tobuyProduct: 'a_comprar',
        attended: 'atendido',
        placeToBuy: 'donde_comprar',
      };
      if (resp.payload != null) {
        const re = resp.payload.demandProductDTOs.map(
          (item: DemandProductDTO) => maskObject(item, mask)
        );
        seed.value = re;
      }

      refresh.value++;
    }
  }
}

const getAllPlaces = async () => {
  const resp = await getAllPlaceToBuy();
  if (resp.status === 200 && resp.payload != null)
    placesData.value = resp.payload;
  const places_prepared = prepareToSelect(
    placesData.value,
    'placeName',
    'idPlace'
  );
  places.value = places_prepared;
};

const descargarSolicitud = async () => {
  if (id.value != null) {
    exportBuySolicitByDemand(id.value);
  }
};

const descargarCotizacion = async () => {
  if (id.value != null) {
    exportCotizationByDemand(id.value);
  }
};

onMounted(async () => {
  loadingStore.active();
  id.value = route.query?.payload ? route.query?.payload.toString() : null;
  if (id.value != null) {
    await listarDemanda();
  }
  await getAllPlaces();
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
          label="Exportar solicitud"
          @click="descargarSolicitud"
        >
          <q-tooltip class="bg-grey">Exportar solicitud</q-tooltip>
        </q-btn>

        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="Exportar cotización"
          @click="descargarCotizacion"
        >
          <q-tooltip class="bg-grey">Exportar cotización</q-tooltip>
        </q-btn>

        <q-btn
          v-if="permisionStore.havePermision('create', ENTITY.DEMANDA)"
          color="primary"
          label="A Comprar"
          @click="comprarMultiple()"
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
          :to="{ name: NAMESROUTES.APP_DEMAND_LIST }"
        />
      </div>

      <table-component
        :key="refresh"
        title="Demanda"
        :data="seed"
        option="descripcion"
        :actions="actions"
        @edit="comprar"
        :hide="['idProduct', 'index']"
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
          <q-form @submit.prevent="comprarOperation()">
            <q-card-section>
              <div class="text-h6">Atender Producto</div>
            </q-card-section>

            <q-card-section style="max-height: 50vh" class="scroll">
              <q-list>
                <!--
        Rendering a <label> tag (notice tag="label")
        so QRadios will respond to clicks on QItems to
        change Toggle state.
      -->
                <q-item>
                  <q-item-section top>
                    <q-item-label lines="1">
                      <q-chip square color="primary" text-color="white">
                        Ofertado
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                          class="bg-grey"
                        >
                          Ofertado
                        </q-tooltip>
                      </q-chip>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-input
                        outlined
                        dense
                        type="number"
                        v-model.number="ofertado"
                        min="0"
                        label="Ofertado"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val != null && val >= 0 && `${val}` != '') ||
                            'Por favor selecciona una cantidad mayor o igual a cero',
                        ]"
                      />
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section top>
                    <q-item-label lines="1">
                      <q-chip square color="primary" text-color="white">
                        A Comprar
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                          class="bg-grey"
                        >
                          A comprar
                        </q-tooltip>
                      </q-chip>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-input
                        outlined
                        dense
                        type="number"
                        v-model.number="acomprar"
                        min="0"
                        label="A comprar"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val != null && val >= 0 && `${val}` != '') ||
                            'Por favor selecciona una cantidad mayor o igual a cero',
                        ]"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-section>
              <div class="col-3 q-pa-sm">
                <q-select
                  dense
                  outlined
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="place"
                  use-input
                  input-debounce="0"
                  label="Donde Comprar *"
                  hint="seleccione aqui"
                  behavior="dialog"
                  :options="places"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val != null) ||
                      acomprar == 0 ||
                      'Por favor selecciona en donde comprar',
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
              <q-btn flat label="Guardar" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

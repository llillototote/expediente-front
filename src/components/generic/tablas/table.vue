<script setup lang="ts">
import { prepareDataToTabla } from 'src/services/util';
import { ref, computed, nextTick, watch } from 'vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';
import { ModeSelection } from 'src/common/enum/framework';

import checkbox from '../individual/checkbox.vue';
import defaultText from '../individual/defaultText.vue';

export interface TableComplexProps {
  data: any[];
  option: string;
  title?: string;
  selection?: ModeSelection;
  selectedProps?: any[];
  filterProps?: any[];
  actions: ButtonAction[];
  hide: string[];
  grid?: boolean;
}
const props = withDefaults(defineProps<TableComplexProps>(), {
  title: 'Entidad',
});

const emit = defineEmits([
  'edit',
  'delete',
  'show',
  'selected',
  'elevate-filter',
]);

const { columns, data } = prepareDataToTabla(
  props.data,
  props.actions.length > 0 && props.data.length > 0,
  props.hide
);

// we generate lots of rows here
let allRows = data;
/*let allRows = [];
for (let i = 0; i < 10; i++) {
  allRows = allRows.concat(data.slice(0).map((r) => ({ ...r })));
}*/
allRows.forEach((row, index) => {
  row.index = index;
});

const pageSize = 50;
const lastPage = Math.ceil(allRows.length / pageSize);

const nextPage = ref(2);
const loading = ref(false);
const fields: string[] =
  props.data.length > 0
    ? Object.keys(props.data[0]).filter(
        (key: string) => !props.hide.includes(key)
      )
    : [];
const switchColumns = ref(fields);
const visibleColumns = ref(fields);
const filterColumns = ref(fields);

//PARA MANEJAR LOS FILTROS ORDENADOS
const textColumns = ref<any>(
  props.filterProps && props.filterProps.length == 3 ? props.filterProps[0] : {}
);
filterColumns.value.forEach(
  (it: string) =>
    (textColumns.value[it] =
      textColumns.value[it] == null ? '' : textColumns.value[it])
);

const boleanColumns = ref<any>(
  props.filterProps && props.filterProps.length == 4 ? props.filterProps[0] : {}
);
filterColumns.value.forEach(
  (it: string) =>
    (boleanColumns.value[it] =
      boleanColumns.value[it] == null ? '' : boleanColumns.value[it])
);

const orderFilterColumns = ref<string[]>(
  props.filterProps && props.filterProps.length == 3 ? props.filterProps[1] : []
);
const checkColumns = ref<string[]>(
  props.filterProps && props.filterProps.length == 3 ? props.filterProps[2] : []
);

//EMITIR FILTROS PARA QUE NO SE PIERDAN AL ACTUALIZAR EL COMPPONENT
watch(checkColumns, (oldvalue, newvalue) => {
  //RESPET ORDER
  emit('elevate-filter', [
    textColumns,
    orderFilterColumns,
    checkColumns,
    boleanColumns,
  ]);
});

watch(checkColumns, (oldvalue, newvalue) => {
  //RESPET ORDER
  emit('elevate-filter', [
    textColumns,
    orderFilterColumns,
    checkColumns,
    boleanColumns,
  ]);
});

//PARA MANEJAR LAS SELECCIONES
const selected = ref<any[]>(props.selectedProps ? props.selectedProps : []);
//EMITIR SELECCION
watch(selected, (oldvalue, newvalue) => {
  emit('selected', selected.value);
});

//DESABILITAR ACTIONS EN LA TUPLA
const fnDisabledCriteria = (a: any, v: any[]): boolean => {
  return v.includes(a);
};
//MODO DE VISUALIZACION DE LA TABLA
const isgrid = ref<boolean>(props.grid ? props.grid : false);

const rows = computed(() =>
  checkfilter().slice(0, pageSize * (nextPage.value - 1))
);

function aparejar() {
  Object.keys(boleanColumns.value).forEach((key) => {
    if (typeof boleanColumns.value[key] == 'boolean') {
      textColumns.value[key] = boleanColumns.value[key] ? 'true' : 'false';
    }
  });
  checkfilter();
}

function checkfilter() {
  let filtro = allRows;

  filterColumns.value.forEach((column) => {
    if (textColumns.value[column] != '') {
      if (
        !orderFilterColumns.value.includes(column) &&
        checkColumns.value.includes(column)
      ) {
        orderFilterColumns.value.push(column);
      } else if (
        orderFilterColumns.value.includes(column) &&
        !checkColumns.value.includes(column)
      ) {
        orderFilterColumns.value.splice(
          orderFilterColumns.value.indexOf(column),
          1
        );
      }
    } else {
      if (
        orderFilterColumns.value.includes(column) ||
        checkColumns.value.includes(column)
      )
        orderFilterColumns.value.splice(
          orderFilterColumns.value.indexOf(column),
          1
        );
    }
  });

  orderFilterColumns.value.forEach((column) => {
    filtro = filtro.filter((it) =>
      textColumns.value[column] != '' && checkColumns.value.includes(column)
        ? machea(it[column], textColumns.value[column])
        : true
    );
  });
  return filtro;
}

function machea(variable: string | boolean, valor: any) {
  if (typeof variable === 'boolean') {
    if (variable && (valor == 'true' || valor == true)) {
      return true;
    } else if (!variable && (valor == 'false' || valor == false)) {
      return true;
    } else return false;
  } else {
    if (typeof variable === 'string') {
      return `${variable.toLowerCase()}`.includes(valor.toLowerCase());
    } else return `${variable}`.includes(valor);
  }
}

const pagination = { rowsPerPage: 0 };

function onScroll({ to, ref }: { to: number; ref: any }) {
  const lastIndex = rows.value.length - 1;

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true;

    setTimeout(() => {
      nextPage.value++;
      nextTick(() => {
        ref.refresh();
        loading.value = false;
      });
    }, 500);
  }
}
//EMITIR ACCIONES DE LA TUPLA
const emitir = (motive: ACTIONS, payload: any) => emit(motive, payload);

const setComponent = (props: any) => {
  //console.log([props.col, props.row[props.col.name]]);

  if (typeof props.row[props.col.name] === 'boolean') {
    return checkbox;
  }

  return defaultText;
};

const clearFilterBoolean = (item: string) => {
  textColumns.value[item] = '';
  boleanColumns.value[item] = '';
};
</script>

<template>
  <div class="q-pa-md">
    <div class="q-pa-md" v-if="data.length > 0">
      <q-table
        v-if="!props.selection"
        :class="`${
          props.data.length > 0 ? 'my-sticky-dynamic' : ''
        } my-sticky-header-table`"
        title="Entidad"
        :grid="isgrid"
        :rows="rows"
        :columns="columns"
        :loading="false"
        row-key="index"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
        :visible-columns="visibleColumns"
        no-data-label="No hay datos que mostrar"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">{{ title }}</div>

          <q-space />

          <div v-if="$q.screen.gt.xs" class="col">
            <q-btn
              v-for="(item, index) in switchColumns"
              :key="index"
              :label="item"
              type="button"
              color="primary"
              flat
              class="q-ml-sm"
            >
              <q-badge
                color="primary"
                v-if="textColumns[item] != '' && checkColumns.includes(item)"
                >{{ orderFilterColumns.indexOf(item) + 1 }}</q-badge
              >
              <q-menu transition-show="flip-right" transition-hide="scale">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <q-list>
                      <q-item>
                        <q-item-section
                          v-if="
                            data.length > 0 &&
                            typeof data[0][item] === 'boolean'
                          "
                        >
                          <q-item-label caption>
                            <q-checkbox
                              left-label
                              label="usar filtro"
                              v-model="checkColumns"
                              :val="item"
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                              @input="checkfilter"
                            />

                            <q-toggle
                              left-label
                              label="filtro"
                              v-model="boleanColumns[item]"
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              @update:model-value="aparejar"
                            />

                            <q-btn
                              round
                              size="xs"
                              v-if="textColumns[item] != ''"
                              icon="cancel"
                              @click="clearFilterBoolean(item)"
                            />
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-else>
                          <div>
                            <q-input
                              dense
                              v-model="textColumns[item]"
                              debounce="500"
                              outlined
                              placeholder="Filtrar"
                              hint="usar filtro"
                            >
                              <template v-slot:prepend>
                                <q-checkbox
                                  left-label
                                  v-model="checkColumns"
                                  :val="item"
                                  checked-icon="task_alt"
                                  unchecked-icon="highlight_off"
                                  @input="checkfilter"
                                />
                              </template>
                              <template v-slot:append>
                                <q-icon
                                  v-if="textColumns[item] != ''"
                                  name="cancel"
                                  @click.stop.prevent="textColumns[item] = ''"
                                  class="cursor-pointer"
                                />
                                <q-icon
                                  v-if="textColumns[item] == ''"
                                  name="filter_alt"
                                />
                              </template>
                            </q-input>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>campo visible</q-item-label>
                        </q-item-section>
                        <div>
                          <q-toggle
                            v-model="visibleColumns"
                            :val="item"
                            :disable="index == 0"
                          />
                        </div>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
          <q-select
            v-else
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <component
              :is="setComponent(props)"
              v-bind="{
                label: props.col.name,
                value: props.row[props.col.name],
              }"
            ></component>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn
                v-for="(item, index) in actions"
                :key="index"
                :color="item.color"
                :text-color="item.text_color"
                :icon="item.icon"
                @click="emitir(item.action, props)"
                :disable="
                  item.disabledCriteria
                    ? fnDisabledCriteria(
                        props.row[item.disabledCriteria.field],
                        item.disabledCriteria.value
                      )
                    : false
                "
              >
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                  class="bg-primary"
                >
                  {{ item.tooltip }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>

      <q-table
        v-else
        title="Entidad"
        :grid="isgrid"
        :selection="props.selection"
        v-model:selected="selected"
        :rows="rows"
        :columns="columns"
        :loading="false"
        row-key="index"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        @virtual-scroll="onScroll"
        :visible-columns="visibleColumns"
        no-data-label="No hay datos que mostrar"
      >
        <template v-slot:top="props">
          <div class="col-2 q-table__title">{{ title }}</div>

          <q-space />

          <div v-if="$q.screen.gt.xs" class="col">
            <q-btn
              v-for="(item, index) in switchColumns"
              :key="index"
              :label="item"
              type="button"
              color="primary"
              flat
              class="q-ml-sm"
            >
              <q-badge
                color="primary"
                v-if="textColumns[item] != '' && checkColumns.includes(item)"
                >{{ orderFilterColumns.indexOf(item) + 1 }}</q-badge
              >
              <q-menu transition-show="flip-right" transition-hide="scale">
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <q-list>
                      <q-item>
                        <q-item-section
                          v-if="
                            data.length > 0 &&
                            typeof data[0][item] === 'boolean'
                          "
                        >
                          <q-item-label caption>
                            <q-checkbox
                              left-label
                              label="usar filtro"
                              v-model="checkColumns"
                              :val="item"
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                              @input="checkfilter"
                            />

                            <q-toggle
                              left-label
                              label="filtro"
                              v-model="boleanColumns[item]"
                              checked-icon="check"
                              color="red"
                              unchecked-icon="clear"
                              @update:model-value="aparejar"
                            />

                            <q-btn
                              round
                              size="xs"
                              v-if="textColumns[item] != ''"
                              icon="cancel"
                              @click="clearFilterBoolean(item)"
                            />
                          </q-item-label>
                        </q-item-section>
                        <q-item-section v-else>
                          <div>
                            <q-input
                              dense
                              v-model="textColumns[item]"
                              debounce="500"
                              outlined
                              placeholder="Filtrar"
                              hint="usar filtro"
                            >
                              <template v-slot:prepend>
                                <q-checkbox
                                  left-label
                                  v-model="checkColumns"
                                  :val="item"
                                  checked-icon="task_alt"
                                  unchecked-icon="highlight_off"
                                  @input="checkfilter"
                                />
                              </template>
                              <template v-slot:append>
                                <q-icon
                                  v-if="textColumns[item] != ''"
                                  name="cancel"
                                  @click.stop.prevent="textColumns[item] = ''"
                                  class="cursor-pointer"
                                />
                                <q-icon
                                  v-if="textColumns[item] == ''"
                                  name="filter_alt"
                                />
                              </template>
                            </q-input>
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>campo visible</q-item-label>
                        </q-item-section>
                        <div>
                          <q-toggle
                            v-model="visibleColumns"
                            :val="item"
                            :disable="index == 0"
                          />
                        </div>
                      </q-item>
                    </q-list>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
          <q-select
            v-else
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            style="min-width: 150px"
          />

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <component
              :is="setComponent(props)"
              v-bind="{
                label: props.col.name,
                value: props.row[props.col.name],
              }"
            ></component>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="q-pa-md q-gutter-sm">
              <q-btn
                v-for="(item, index) in actions"
                :key="index"
                :color="item.color"
                :text-color="item.text_color"
                :icon="item.icon"
                @click="emitir(item.action, props)"
                :disable="
                  item.disabledCriteria
                    ? fnDisabledCriteria(
                        props.row[item.disabledCriteria.field],
                        item.disabledCriteria.value
                      )
                    : true
                "
              >
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                  class="bg-primary"
                >
                  {{ item.tooltip }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <div v-else>
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6 q-mt-sm q-mb-xs text-grey">
            No hay nada que mostrar
          </div>
          <div class="text-caption text-grey">No hay datos</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style lang="sass">

.my-sticky-dynamic
  /* height or max-height is important */
  height: 380px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: white,

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>

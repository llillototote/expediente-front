<template>
  <div class="q-pa-md">
    <q-table
      :class="`${
        props.data.length > 0 ? 'my-sticky-dynamic' : ''
      } my-sticky-header-table`"
      title="Entidad"
      :rows="rows"
      :columns="columns"
      :loading="loading"
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
            <q-menu transition-show="flip-right" transition-hide="scale">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption
                          >usar filtro
                          <q-badge color="primary">{{ search }}</q-badge>
                        </q-item-label>

                        <div>
                          <q-input
                            dense
                            v-model="textColumns[item]"
                            debounce="500"
                            outlined
                            placeholder="Filtrar"
                            hint=""
                          >
                            <template v-slot:prepend>
                              <q-checkbox
                                left-label
                                v-model="filterColumns"
                                :val="item"
                                checked-icon="task_alt"
                                unchecked-icon="highlight_off"
                                @update:model-value="checkfilter"
                              />
                            </template>
                            <template v-slot:append>
                              <q-icon name="filter_alt" />
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
                        <q-toggle v-model="visibleColumns" :val="item" />
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
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { prepareDataToTabla } from 'src/services/util';
import { ref, computed, nextTick } from 'vue';
import { ACTIONS } from 'src/common/enum/actions';
import { ButtonAction } from 'src/common/interface/util';

export interface TableComplexProps {
  data: any[];
  option: string;
  title?: string;
  actions: ButtonAction[];
  hide: string[];
}
const props = withDefaults(defineProps<TableComplexProps>(), {
  title: 'Entidad',
});

const emit = defineEmits(['edit', 'delete', 'show']);

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
const textColumns = ref<any>({});
filterColumns.value.forEach((it: string) => (textColumns.value[it] = ''));

const rows = computed(() =>
  checkfilter().slice(0, pageSize * (nextPage.value - 1))
);

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

const emitir = (motive: ACTIONS, payload: any) => emit(motive, payload);
const search = ref('');

function checkfilter() {
  let filtro = allRows;
  filterColumns.value.forEach((column) => {
    filtro = filtro.filter((it) =>
      textColumns.value[column] != ''
        ? it[column].includes(textColumns.value[column])
        : true
    );
  });
  return filtro;
}
</script>

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

<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :rows="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      :filter="filter"
      grid
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox
                dense
                v-model="props.selected"
                :label="props.row.name"
              />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item
                v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
import { prepareDataToTablaPanoramic } from '../../services/utilities';
import mitt from 'mitt';
const EBConfSelected = mitt();
export { EBConfSelected };

export default {
  props: {
    entity: {
      required: true,
    },
    checks: {
      required: true,
    },
    title: {
      default: 'lista',
    },
    array: {
      required: true,
    },
    sub: {
      default: false,
    },
    nombre: {
      required: true,
    },
  },
  data() {
    return {
      filter: '',
      selected: [],
      columns: [],
      data: [],
    };
  },
  mounted() {
    this.configurarData();
    this.cargarChecked();
  },
  watch: {
    selected(e) {
      let ids = e.map((item) => item.codigo);
      EBConfSelected.emit(this.entity, ids);
    },
  },
  methods: {
    configurarData() {
      let arr;
      if (this.sub) {
        arr = this.array.map((item) => {
          const keys = Object.keys(item[this.sub]);
          let a = {};
          keys.forEach((key) => {
            let b = {};
            if (item[this.sub][key] != null) {
              b[key] = item[this.sub][key];
              a = { ...a, ...b };
            }
          });
          return {
            name: item[this.nombre],
            codigo: item.id,
            ...a,
          };
        });
      } else {
        arr = this.array.map((item) => {
          const keys = Object.keys(item);
          let a = {};
          keys.forEach((key) => {
            let b = {};
            if (item[key] != null) {
              b[key] = item[key];
              a = { ...a, ...b };
            }
          });
          return {
            name: item[this.nombre],
            codigo: item.id,
            ...a,
          };
        });
      }

      let { columns, data } = prepareDataToTablaPanoramic(arr);
      this.columns = columns;
      this.data = data;
    },
    cargarChecked() {
      this.checks.forEach((check) => {
        let finded = this.data.find((item) => item.codigo == check);
        if (finded) {
          let f = { ...finded };
          if (!this.selected.includes(f)) this.selected.push(f);
        }
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>

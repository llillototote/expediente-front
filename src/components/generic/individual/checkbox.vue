<script lang="ts" setup>
import { ref } from 'vue';
export interface CheckBoxProps {
  value: boolean;
  label: string;
  disable?: boolean;
}
const props = withDefaults(defineProps<CheckBoxProps>(), {
  label: '',
  disable: true,
});
const status = ref(props.value);
const disable = ref(props.disable);
</script>
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-toggle
      v-model="status"
      checked-icon="check"
      color="green"
      unchecked-icon="clear"
      :disable="disable"
    />
  </div>
</template>

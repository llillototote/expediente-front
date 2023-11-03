<script lang="ts" setup>
import { ref } from 'vue';
export interface CheckBoxProps {
  value?: string | number;
}
const props = withDefaults(defineProps<CheckBoxProps>(), {
  value: '',
});

const cellClass = (value: string) => {
  return 'q-pa-md q-gutter-sm ajustetext';
};

const value = ref(props.value);
</script>
<template>
  <div :class="cellClass(value)">
    {{ value }}
  </div>
</template>
<style scoped>
.ajustetext {
  white-space: pre-wrap;
}
</style>

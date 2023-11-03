import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
  }),
  getters: {
    getStatus: (state) => state.loading,
  },
  actions: {
    active() {
      this.loading = true;
    },
    inactive() {
      this.loading = false;
    },
  },
});

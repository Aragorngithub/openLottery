import { defineStore } from "pinia";

export const useCommonDataStore = defineStore('commonData', {
  state: () => ({
    commonData: {}
  }),
  actions: {
    saveCommonData (commonData) {
      this.$patch({ commonData });
    }
  }
});

export const useLotNameListStore = defineStore({
  id: 'lotNameList',
  state: () => ({
    lotNameList: []
  }),
  actions: {
    saveLotName (lotName) {
      this.lotNameList.push(lotName)
    },
    clearLotNameList () {
      this.lotNameList.length = 0;
    }
  }
});
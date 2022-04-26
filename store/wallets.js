// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    walletid: '',
  },
  // mutations are the ones capable of changing the state
  mutations: {
    change(state, walletid) {
      state.walletid = walletid
    },
  },
  // we need to add a way to look at the state. We do so using getters.
  // Notice how getters is an object. walletid is a property of this object, which accepts the state as the parameter,
  // and returns the wallletid property of the state.
  getters: {
    walletid: (state) => state.walletid,
  },
})
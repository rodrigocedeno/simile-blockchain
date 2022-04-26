
export const state = () => ({
  walletid: '',
})

export const mutations = {
  change(state, walletid) {
    state.walletid = walletid
  }
}

export const getters = {
  walletid(state) {return state.walletid},
}

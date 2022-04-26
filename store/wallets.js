// store/index.js

export const state = () => ({
    wallets: [],
})

export const mutations = {
    addWallet(state, wallet){
        state.wallets.push(wallet)
    },
    removeWallet(state, walletID){
    state.wallets = state.wallets.filter((wallet) => wallet.id !== walletID)}
}

export const actions = {}

export const getters = {}
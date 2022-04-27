<template>
  <div class="card text-center">
    <div class="card-header"></div>
    <div class="card-body">
      <h5 class="card-title">Login Page</h5>
      <p class="card-text">Please enter your wallet number</p>
      <div class="mb-3 row"></div>
      <div class="mb-3 row">
        <label for="walletId" class="col-sm-2 col-form-label">Wallet</label>
        <div class="col-sm-10">
        <input class="form-control" v-model="walletnum" />
        </div>
      </div>
      <a href="test" class="btn btn-primary" @click="persist">Login</a>
      <a href="" class="btn btn-primary" @click="deleteWallet">Delete</a>
    </div>
    <div class="card-footer text-muted"></div>
  </div>
</template>

<script>
export default {
  layout: 'menu',

  data() {
    return {
      walletnum: '',
    }
  },

  mounted() {
    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    }
  },
  methods: {
    persist() {
      localStorage.walletnum = this.walletnum
    },
    deleteWallet(){
      localStorage.walletnum = ''
    }
  },
}
</script>

<style></style>

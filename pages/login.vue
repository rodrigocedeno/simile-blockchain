<template>
<!-- Super cool tutorial where I got the idea of client-side storage https://v2.vuejs.org/v2/cookbook/client-side-storage.html?redirect=true -->
  <div class="card text-center">
    <div class="card-header"></div>
    <div class="card-body">
      <h5 class="card-title">Login Page</h5>
      <p class="card-text">Please enter your wallet number</p>
      <div class="mb-3 row"></div>
      <div class="mb-3 row">
        <label for="walletId" class="col-sm-2 col-form-label">Wallet</label>
        <div class="col-sm-10">
        <input v-model="walletnum" class="form-control"/>
        </div>
      </div>
      <a href="/" class="btn btn-primary" @click="persist">Login</a>
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
  },
}
</script>

<style></style>

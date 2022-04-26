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
          <input type="text" class="form-control" id="inputWallet" />
        </div>
      </div>
      <a href="test" class="btn btn-primary">Login</a>
    </div>
    <div class="card-footer text-muted"></div>
  </div>
</template>

<script>

export default {
  layout: 'menu',

  data() {
    return {
      walletid: '',
    }
  },

  methods: {
    async login() {
      try {
        await this.$store.dispatch('local', {
          walletid: this.walletid,
        })
      } catch (e) {
        this.formError = e.message
      }
      this.$session.start()
    },
  },
}
</script>

<style></style>

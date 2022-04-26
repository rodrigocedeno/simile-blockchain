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
          <input @input="changed" name="inputWallet" />
        </div>
      </div>
      <a href="test" class="btn btn-primary">Login</a>
    </div>
    <div class="card-footer text-muted"></div>
    <p>wallet ID: {{ $store.getters.walletid }} $$</p>
  </div>
</template>

<script>
export default {
  layout: 'menu',
  methods: {
    changed(event) {
      this.$store.commit('change', event.target.value)
      alert(event.target.value)
    },
  },
}
</script>

<style></style>

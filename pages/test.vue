<template>
  <div class="container">
    <h3>Test Page</h3>
    <p>wallet ID: {{ walletnum }}</p>
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
      this.walletnum = localStorage.walletnum
    
  },
}
</script>

<style></style>

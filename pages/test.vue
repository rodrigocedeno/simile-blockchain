<template>

  
<div class="container">
  <h3>Test Page</h3>
  <p> {{wallets}} </p>
</div>

</template>

<script>
export default {
 layout:'menu',

  computed: {
    wallets(){
      return this.$store.wallets.state.wallets
    }
    
  }
}
</script>

<style>

</style>
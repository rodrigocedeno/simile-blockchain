<template>
  <div class="container">
    <h1>List of points to validate</h1>
    <div>
      {{this.example}}
    </div>
  </div>
</template>

<script>
// import { getObservations } from '../../static/blockchain.js'

export default {
  layout: 'menu',

  data() {
    return {
      walletnum: '',
      example:'',
    }
  },

  mounted() {
    // this.example = JSON.stringify(getObservations.cellAddresses);

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

<style>
.container {
  margin: 0 auto;
  text-align: center;
  padding: 30px;
}

.content {
  text-align: center;
  align-content: center;
}
</style>

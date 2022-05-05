<template>
  <div class="container">
    <div v-if="observationList">
      <h1>List of points to validate</h1>
      <div v-for="observation in observationList" :key="observation.s2index">
        <p v-for="obsHashes in observation.fileHashes" :key="obsHashes">
          <strong>Hash:</strong> {{ obsHashes }} <strong>Coords:</strong>
          {{ observation.s2Index }}
          {{ convertIndex(observation.s2Index)}}
        </p>
      </div>
      <div>
        <p v-for="hash in observationList[0].fileHashes" :key="hash">
          <strong>Hash:</strong> {{ hash }} <strong>Coords:</strong>
          {{ observationList[0].s2Index }}
        </p>
      </div>
    </div>
    <div v-else>
      <h1>Loading Observations...</h1>
    </div>
  </div>
</template>

<script>
import * as blockchain from '../../static/js/blockchain.js'

export default {
  layout: 'menu',

  data() {
    return {
      walletnum: '',
      observationList: '',
      coords:1,
    }
  },

  async mounted() {
    this.observationList = await blockchain.getObservations()

    // eslint-disable-next-line no-console
    // console.log(jsonData)
    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    }
  },
  methods: {
    persist() {
      localStorage.walletnum = this.walletnum
    },
    convertIndex(s2index){
      this.coords = blockchain.getCoordFromIndex(blockchain.removeHexPrefix(s2index))
      return this.coords
    }
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

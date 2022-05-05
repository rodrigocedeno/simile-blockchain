<template>
  <div class="container">
    <div v-if="observationList">
      <div class="row2">
        <div class="column2">
          <h1>List of points to validate</h1>
          <div
            v-for="observation in observationList"
            :key="observation.s2index"
          >
            <div
              v-for="obsHashes in observation.fileHashes"
              :key="obsHashes"
              @click="viewObservation(observation.s2Index, obsHashes)"
            >
              <strong>Hash:</strong> {{ obsHashes }}
              <strong> Latitude:</strong>
              {{ convertIndex(observation.s2Index).lat
              }}<strong> Longitude:</strong>
              {{ convertIndex(observation.s2Index).lng }}
            </div>
          </div>
        </div>
        <div class="column"></div>
        {{ countvotes }}
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
      coords: 1,
      contents: '',
      votes: '',
      file: '',
      countvotes: '',
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
    convertIndex(s2index) {
      this.coords = blockchain.getCoordFromIndex(
        blockchain.removeHexPrefix(s2index)
      )
      return this.coords
    },
    calculateVote(votes) {
      let positive = 0;
    
      for (let i=0; i<votes.length; i++) {
       
        if (votes[i] === "2") {
          positive++;
        }
      }
      return (positive / votes.length) * 100
      
    },

    async viewObservation(s2Index, fileHash) {
      this.votes = await blockchain.getAllFileVotes(s2Index, fileHash)
      const multihash = blockchain.getIpfsMultihash(
        blockchain.removeHexPrefix(fileHash)
      )
      this.file = await blockchain.readFromIpfs(multihash)
      this.countvotes = this.calculateVote(this.votes)
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

.column2 {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row2:after {
  content: '';
  display: table;
  clear: both;
}
</style>

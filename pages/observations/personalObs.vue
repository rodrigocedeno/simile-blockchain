<template>
  <div class="container">
    <div v-if="observationList">
      <div class="row2">
        <div class="column2">
          <h1>Here you can edit your personal observations</h1>
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
        <div class="column">{{ updateResult }}</div>

        <div class="form-group row">
          <label for="privateKey" class="col-sm-2 col-form-label"
            >Private Key</label
          >
          <div class="col-sm-10">
            <input
              v-model="privateKey"
              type="string"
              class="form-control"
              placeholder="Private Key"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="JSON">JSON file input</label>
          <input
            type="file"
            class="form-control-file"
            required
            @change="readFile"
          />
        </div>
        <br />
        <a
          class="btn btn-outline-secondary"
          role="button"
          @click="deleteObservation()"
          >Delete observation</a
        >
        <a class="btn btn-outline-success" role="button" @click="updateObservation()">Edit observation </a>
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
      coords: '',
      currentObsHash: '',
      currentObsIndex: '',
      privateKey: '',
      contents: '',
      votes: '',
      file: '',
      countVotes: '',
      voteResult: '',
      deleteResult: '',
      updateResult: '',
      newFileString: '',
    }
  },

  async mounted() {
    this.observationList = await blockchain.getUserObservations(
      localStorage.walletnum
    )

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
      let positive = 0

      for (let i = 0; i < votes.length; i++) {
        if (votes[i] === '2') {
          positive++
        }
      }
      return (positive / votes.length) * 100
    },

    async readFile(event) {
      const file = await event.target.files[0].text()
      this.newFileString = file
      // this.result = JSON.stringify(file, undefined, 2)
    },

    async viewObservation(s2Index, fileHash) {
      this.currentObsHash = fileHash
      this.currentObsIndex = s2Index
      this.votes = await blockchain.getAllFileVotes(s2Index, fileHash)
      const multihash = blockchain.getIpfsMultihash(
        blockchain.removeHexPrefix(fileHash)
      )
      this.file = await blockchain.readFromIpfs(multihash)
      this.countVotes = this.calculateVote(this.votes)
    },

    async deleteObservation() {
      this.deleteResult = await blockchain.deleteObservation(
        this.currentObsHash,
        blockchain.removeHexPrefix(this.currentObsIndex),
        localStorage.walletnum,
        this.privateKey
      )
    },

    async updateObservation() {
      this.updateResult = await blockchain.updateObservation(
        this.currentObsHash,
        this.newFileString,
        blockchain.removeHexPrefix(this.currentObsIndex),
        localStorage.walletnum,
        this.privateKey
      );
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

<template>
  <div>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body>
      <div class="container">
        <div v-if="observationList">
          <div class="row">
            <div class="col">
              <div>
                <h1>List of points to validate</h1>
                <div
                  v-for="observation in observationList"
                  :key="observation.s2index"
                >
                  <ul class="list-group">
                    <li
                      v-for="obsHashes in observation.fileHashes"
                      :key="obsHashes"
                      class="btn btn-outline-dark"
                      @click="viewObservation(observation.s2Index, obsHashes)"
                    >
                      <strong>Hash:</strong> {{ obsHashes }}
                      <strong> Latitude:</strong>
                      {{ convertIndex(observation.s2Index).lat
                      }}<strong> Longitude:</strong>
                      {{ convertIndex(observation.s2Index).lng }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="currentObsHash" class="col">
              <div class="card">
                <h1 class="card-title">Details of Selected Point:</h1>
                <p><strong> Hash: </strong> {{ currentObsHash }}</p>
                <br />
                <p><strong>Latitude: </strong> {{ coords.lat }}</p>
                <br />
                <p><strong>Longitude: </strong> {{ coords.lng }}</p>
                <br />
                <p><strong>JSON file data: </strong></p>
                <span style="white-space: pre">{{ pretty(file) }}</span>
                <br />
                <div>
                  <strong>
                    Please enter your private key and click on accept or reject
                  </strong>
                </div>
                <br />
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
                <br />
                <div class="justify-content-start">
                  <a
                    class="btn btn-outline-danger"
                    role="button"
                    @click="sendVote(1)"
                    >Reject Point</a
                  >
                  <a
                    class="btn btn-outline-success"
                    role="button"
                    @click="sendVote(2)"
                    >Accept Point</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="row">
            </div>
          </div>
        </div>
        <div v-else>
          <h1>Loading observations to review...</h1>
        </div>
      </div>
      <div class="d-flex justify-content-center p-2">
      <div id="map" class="map"></div>
      </div>
      {{coords2}}
    </body>
  </div>
</template>

<script>
import 'ol/ol.css'
import {fromLonLat} from 'ol/proj'
import { View, Map } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import OSM from 'ol/source/OSM'
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
      file: '{}',
      countVotes: '',
      voteResult: '',
      prettyJSON: '',
      osmCoords: '',
      coords2: '',
    }
  },

  async mounted() {
    this.observationList = await blockchain.getObservations()
    this.coords2 = this.coords.lng
    // eslint-disable-next-line no-console
    // console.log(jsonData)
    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    }

    /* eslint-disable no-new */
    new Map({
      layers: this.layers(),
      target: 'map',
      view: new View({
        center: [0,0],
        zoom: 4,
      }),
    })
  },
  methods: {
    layers() {
      const layers = [
        new TileLayer({
          source: new OSM(),
        }),
      ]
      return layers
    },
    myFromLonLat(lon,lat){
      this.osmCoords = fromLonLat(lon,lat)
      return this.osmCoords
    },
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

    async sendVote(vote) {
      this.voteResult = await blockchain.voteObservation(
        this.currentObsHash,
        blockchain.removeHexPrefix(this.currentObsIndex),
        vote,
        localStorage.walletnum,
        this.privateKey
      )
      this.privateKey = ''
    },

    pretty(file) {
      // const test = JSON.stringify((JSON.parse(file.slice(0,1))), null, 2);
      this.prettyJSON = JSON.stringify(JSON.parse(file), undefined, 2)
      return this.prettyJSON
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  text-align: left;
  padding: 30px;
}

.content {
  text-align: left;
  align-content: left;
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

pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}
.map {
  height: 400px;
  width: 75%;
  align-content: center;
}
</style>

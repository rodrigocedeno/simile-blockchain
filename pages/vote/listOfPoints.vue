<template>
  <div>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body>
      <div class="container">
        <div v-if="observationJSON.length === lengthList">
          <div class="row">
            <div class="col">
              <div class="infoSize">
                <h1>List of points to validate</h1>
                <ul class="list-group">
                  <li
                    v-for="observation in observationJSON"
                    :key="observation.id"
                    class="btn btn-outline-dark"
                    @click="
                      ;[
                        (showObs = true),
                        (myHash = observation.hash),
                        (myLat = observation.lat),
                        (myLng = observation.lng),
                        (myVote = observation.vote),
                        (myFile = observation.file),
                        mapCoords(observation.lat, observation.lng),
                        layers(),
                      ]
                    "
                  >
                    <strong>Hash:</strong> {{ observation.hash }}
                    <strong> Latitude:</strong>
                    {{ observation.lat }}<strong> Longitude:</strong>
                    {{ observation.lng }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-show="showObs" class="col">
              <div class="infoSize">
                <h1 class="card-title">Details of Selected Point:</h1>
                <p><strong> Hash: </strong> {{ myHash }}</p>
                <br />
                <p>
                  <strong>Latitude: </strong>
                  {{ myLat }}
                </p>
                <br />
                <p>
                  <strong>Longitude: </strong>
                  {{ myLng }}
                </p>
                <br />
                <p v-if="vote">
                  <strong>Percentage of positive votes: </strong>
                  {{ myVote }}
                </p>
                <p v-else>
                  <strong>Observation still not voted </strong>
                </p>
                <br />
                <p><strong>JSON file data: </strong></p>
                <span style="white-space: pre">{{ myFile }} </span>
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
            <div class="row"></div>
          </div>
        </div>
        <div v-else>
          <h1>Loading observations to review...</h1>
        </div>
      </div>
      <div class="d-flex justify-content-center p-2">
        <div id="map" class="map"></div>
      </div>
    </body>
  </div>
</template>

<script>
import 'ol/ol.css'
import { fromLonLat } from 'ol/proj'
import { View, Map } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { Icon, Style } from 'ol/style'
// import {Modify} from 'ol/interaction';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import OSM from 'ol/source/OSM'
import * as blockchain from '../../static/js/blockchain.js'
import marker from '../../assets/marker.png'

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
      osmCoords: [0, 0],
      lat: [0],
      lng: [0],
      map: '',
      observationJSON: [],
      vote: '',
      showObs: false,
      myHash: '',
      myLat: '',
      myLng: '',
      myVote: '',
      myFile: '',
      completeList: null,
      lengthList: '',
    }
  },

  async mounted() {
    // eslint-disable-next-line no-console

    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    }
    this.observationList = await blockchain.getObservations()
    // Object.defineProperty(this.observationList, 'fileHashes', {
    //   configurable: true,
    //   writable: true,
    // })
    this.observationJSON = []

    for (let i = 0; i < this.observationList.length; i++) {
      if (this.observationList[i].fileHashes.length > 0) {
        const currentInd = this.convertIndex(this.observationList[i].s2Index)

        for (let j = 0; j < this.observationList[i].fileHashes.length; j++) {
          const currVote = await blockchain.getAllFileVotes(
            this.observationList[i].s2Index,
            this.observationList[i].fileHashes[j]
          )
          const currHash = this.observationList[i].fileHashes[j]
          const multiHash = blockchain.getIpfsMultihash(
            blockchain.removeHexPrefix(currHash)
          )
          let currFile = '{}'
          try {
            currFile = await blockchain.readFromIpfs(multiHash)
          } catch (err) {
            currFile = 'error'
          }

          if (currFile === 'error') {
            currFile =
              '{IPFS error, please verify that your connection allows conneciton with the IPFS.}'
          }
          const countVotes = this.calculateVote(currVote)
          this.observationJSON.push({
            s2Index: `${this.observationList[i].s2Index}`,
            lat: `${currentInd.lat}`,
            lng: `${currentInd.lng}`,
            hash: `${currHash}`,
            vote: `${countVotes}`,
            file: `${currFile}`,
          })
        }
      }
    }
    this.lengthList = this.observationJSON.length
    /* eslint-disable no-new */
    /* eslint-disable no-unused-vars */
    this.map = new Map({
      layers: this.layers(),
      target: 'map',
      view: new View({
        center: [this.osmCoords[0], this.osmCoords[1]],
        zoom: 0,
      }),
    })
  },

  methods: {
    mapCoords(lat, lng) {
      this.osmCoords = fromLonLat([lng, lat])
      this.osmLat = this.osmCoords[1]
      this.osmLng = this.osmCoords[0]
      this.map.getView().setCenter([this.osmCoords[0], this.osmCoords[1]])
      this.map.getView().setZoom(6)
    },
    layers() {
      const layers = new TileLayer({
        source: new OSM(),
      })

      const iconFeature = new Feature({
        // geometry: new Point(this.osmCoords[0], this.osmCoords[1]),
        geometry: new Point([this.osmCoords[1], this.osmCoords[0]]),
        name: 'Marker',
      })
      // iconFeature.setGeometry([this.osmCoords[1], this.osmCoords[0]])
      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: marker,
        }),
      })
      iconFeature.setStyle(iconStyle)

      const vectorSourceIcon = new VectorSource({
        features: [iconFeature],
      })
      // Create the OL vector layer object ot add to the map
      const vectorLayerIcon = new VectorLayer({
        source: vectorSourceIcon,
      })
      return [layers, vectorLayerIcon]
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
      this.prettyJSON = JSON.stringify(JSON.parse(file), undefined, 2)
      // every time the function will format the JSON, it will also update the map
      this.osmCoords = fromLonLat([this.coords.lng, this.coords.lat])
      this.map.getView().setCenter([this.osmCoords[0], this.osmCoords[1]])
      this.map.getView().setZoom(5)
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
.infoSize {
  max-height: 800px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>

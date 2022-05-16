<template>
  <div>
    <head>
      <meta charset="UTF-8" />
      <title>Single Image WMS</title>
      <style>
        .map {
          width: 100%;
          height: 400px;
        }
      </style>
    </head>
    <body>
      <div id="map" class="map"></div>
    </body>
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map } from 'ol'
import OSM from 'ol/source/OSM'
import View from 'ol/View'
import { Tile as TileLayer } from 'ol/layer'
export default {
  mounted() {
    /* eslint-disable no-new */
    new Map({
      layers: this.layers(),
      target: 'map',
      view: new View({
        center: [-10997148, 4569099],
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
  },
}
</script>

<style></style>

<template>
  <span>
    <!-- Intro image component, here with contact background image -->
    <!--IntroImage :background_image="'background/background_contact.jpg'" /-->

    <!-- Intro container -->
    <main class="container">
      <header>
        <h1>Upload new observation</h1>
      </header>
      <section>
        <p>
          With SIMILE Geoblockchain you can upload new observations to the
          network. You only need to complete the form and upload a JSON file!
        </p>
      </section>
    </main>

    <div class="contact-form">
      <form @submit.prevent="onsubmit">
        <div class="form-group row">
          <label for="Wallet" 
            >Your current wallet ID is {{ walletnum }}</label
          >
        </div>
        <br />
        <div class="form-group row">
          <label for="privateKey" class="col-sm-2 col-form-label">Private Key</label>
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
        <div class="form-group row">
          <label for="Latitude" class="col-sm-2 col-form-label">Latitude</label>
          <div class="col-sm-10">
            <input
              v-model.number="lat"
              type="number"
              class="form-control"
              placeholder="Latitude of new observation"
              required
              step="any"
            />
          </div>
        </div>
        <br />
        <div class="form-group row">
          <label for="Longitude" class="col-sm-2 col-form-label"
            >Longitude</label
          >
          <div class="col-sm-10">
            <input
              v-model.number="lng"
              type="number"
              class="form-control"
              placeholder="Longitude of new observation"
              required
              step="any"
            />
          </div>
        </div>
        <br />
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
    <div id="result">{{result}}</div>
  </span>
</template>

<script>
import * as blockchain from '../../static/js/blockchain.js';
export default {
  layout: 'menu',

  data() {
    return {
      walletnum: '',
      privateKey: '',
      lat: '',
      lng: '',
      fileString: '',
      result: '',
    }
  },
  mounted() {
    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    } else {
      this.$router.push('/login')
    }
  },
  methods: {
    async readFile(event) {
      const file = await event.target.files[0].text();
      this.fileString = file;
      // this.result = JSON.stringify(file, undefined, 2)
      
    },

    onsubmit() {      
      const result = blockchain.addObservation(this.lat, this.lng, this.fileString, localStorage.walletnum, this.privateKey);
      
      result.then(val => {
      // got value here
        this.result = val;
      }).catch(e => {
      // error
      this.result = "error";
      });  
      
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
.contact-form {
  display: block;
  background-color: #f1f1f1;
  margin: auto;
  padding: 20px;
  text-align: center;
  width: 55%;
}
</style>

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
      <form>
<<<<<<< HEAD
        <div class="form-group row">
          <label for="Wallet" 
            >Your current wallet ID is {{ walletnum }}</label
          >
        </div>
        <br />
        <div class="form-group row">
          <label for="personalToken" class="col-sm-2 col-form-label">Personal Token</label>
          <div class="col-sm-10">
            <input
              id="inputToken"
              type="number"
              class="form-control"
              placeholder="Personal token"
              required
            />
          </div>
=======
        <div class="form-group">
          <label for="Wallet" class="col-form-label"> Your wallet number is: {{walletnum}}</label>
          
>>>>>>> 7f1a293713e42cc2c201c452c7e18af7f8730ce2
        </div>
        <br />
        <div class="form-group row">
          <label for="Latitude" class="col-sm-2 col-form-label">Latitude</label>
          <div class="col-sm-10">
            <input
              id="inputLatitude"
              type="number"
              class="form-control"
              placeholder="Latitude of new observation"
              required
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
              id="inputLongitude"
              type="number"
              class="form-control"
              placeholder="Longitude of new observation"
              required
            />
          </div>
        </div>
        <br />
        <div class="form-group">
          <label for="JSON">JSON file input</label>
          <input
            id="FormControlJSON"
            type="file"
            class="form-control-file"
            required
          />
        </div>
        <br />
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </span>
</template>

<script>
export default {
  layout: 'menu',
<<<<<<< HEAD
=======
    data() {
    return {
      walletnum: '',
    }
  },
  mounted() {
      this.walletnum = localStorage.walletnum
    },
}

>>>>>>> 7f1a293713e42cc2c201c452c7e18af7f8730ce2

  data() {
    return {
      walletnum: '',
    }
  },
  mounted() {
    if (localStorage.walletnum) {
      this.walletnum = localStorage.walletnum
    } else {
      this.$router.push('/login')
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
.contact-form {
  display: block;
  background-color: #f1f1f1;
  margin: auto;
  padding: 20px;
  text-align: center;
  width: 55%;
}
</style>

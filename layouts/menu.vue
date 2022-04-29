<template>
  <div class="container-menu">
    <div class="main-page">
      <nav
        class="navbar navbar-expand-lg navbar-light"
        style="background-color: #18bc9c"
      >
        <div class="container-fluid">
          <a class="navbar-brand text-white" href="/">SIMILE Geoblockchain</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            id="navbarNav"
            class="collapse navbar-collapse justify-content-end"
          >
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/observations/new">New Observation</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/vote/listOfPoints"
                  >Validate Observations</a
                >
              </li>
              <li v-if="walletnum">
                <a class="nav-link" href="/observations/personalObs"
                  >Personal Observations</a
                >
              </li>
              <div v-if="walletnum" class="d-flex justify-content-end">
                <form class="d-flex">
                  <button
                    class="btn btn-outline-light white me-2"
                    type="submit"
                    @click="deleteWallet"
                  >
                    LogOut
                  </button>
                </form>
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <div class="d-flex justify-content-end p-2">Your current Wallet ID is: {{ walletnum }}</div>
      <div class="content">
        <Nuxt />
      </div>
      <div class="footer">
        <div class="footer-images">
          <img src="../assets/geolab.png" alt="GEOLab" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  methods: {
    deleteWallet() {
      localStorage.walletnum = ''
    },
  },
}
</script>

<style>
.header {
  height: 80px;
  background: #18bc9c;
  color: white;
  font-size: 25px;
  display: flex;
  text-align: center;
  align-items: center;
  padding: 10px;
}
.footer {
  background: white;
  color: white;
  font-size: 25px;
  display: flex;
  text-align: center;
  align-items: center;
  padding: 30px;
  justify-content: right;
  
}
.container-menu {
  padding: 3px;
}
</style>

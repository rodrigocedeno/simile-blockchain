<template>
  <div class="container2">
    <h1>Welcome to SIMILE Geoblockchain!</h1>
    <br />
    <body class="subcontainer">
      <h2>What do you want to do?</h2>
      <br />
      <a
        class="btn btn-outline-secondary"
        href="/vote/listOfPoints"
        role="button"
        >Review Observations</a
      >
      <a class="btn btn-outline-success" href="/observations/new" role="button"
        >New Observation</a
      >
    </body>
  </div>
</template>
<script>
export default {
  layout: 'menu',
}
</script>

<style>
.container2 {
  margin: 0 auto;
  text-align: center;
  padding: 30px;
}
.subcontainer {
  margin: 0 auto;
  text-align: center;
  padding: 30px;
}
</style>

<template>
  <div class="home">
    <el-image :src="logo"></el-image>
    <h1 v-loading="loading">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'Welcome Home',
      loading: true,
      logo: require('../assets/logo.png')
    }
  },
  mounted: function () {
    this.$axios
      .get('ping')
      .then()
      .catch(error => { this.msg = error })
      .finally(this.loading = false)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
.home {
  margin-top: 10px;
}
</style>

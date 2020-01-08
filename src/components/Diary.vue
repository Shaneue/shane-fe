<template>
  <el-container>
    <el-aside width="40%">
      <el-calendar v-model="value">
        <template v-slot:dateCell="{date, data}">
          <p
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ date.getDate() }} {{ data.isSelected ? handleClick(data) : '' }}</p>
        </template>
      </el-calendar>
    </el-aside>
    <el-main></el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      value: new Date()
    }
  },
  methods: {
    handleClick(data) {
      console.log(data)
      return '✔️'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
</style>

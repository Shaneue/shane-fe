<template>
  <el-container>
    <el-aside width="40%">
      <el-calendar v-model="value" ref="calendar">
        <template v-slot:dateCell="{date, data}">
          <p
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ date.getDate() }} {{ handleData(data) ?'😊': '' }} {{ data.isSelected ? handleClick(data) : '' }}</p>
        </template>
      </el-calendar>
    </el-aside>
    <el-main>
      <el-container>
        <el-aside width="15%">
          <el-table
            :data="tableData"
            empty-text="EMPTY TABLE"
            style="width: 100%"
            border
            max-height="700"
            @row-click="tableClick"
          >
            <el-table-column align="center" fixed :formatter="cellFormatter" label="DATE"></el-table-column>
          </el-table>
        </el-aside>
        <el-main></el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      tableData: []
    }
  },
  methods: {
    handleClick(data) {
      return '✔️'
    },
    handleData(data) {
      return this.tableData.includes(data.day)
    },
    cellFormatter(row) {
      return row
    },
    tableClick(row) {
      this.value = new Date(row)
    }
  },
  created() {
    this.$axios({
      method: 'get',
      url: 'diary'
    }).then(response => {
      if (response.data.status === 0) {
        this.tableData.push(...response.data.data)
      } else {
        this.$global.error(response.data.message)
      }
    }).catch((error) => {
      this.$global.error(error)
    })
  },
  mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
</style>

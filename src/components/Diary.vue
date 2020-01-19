<template>
  <el-container>
    <el-aside width="40%">
      <el-calendar v-model="value" ref="calendar">
        <template v-slot:dateCell="{date, data}">
          <p
            :class="data.isSelected ? 'is-selected' : ''"
          >{{ date.getDate() }} {{ handleData(data) ?'😊': '' }} {{ picked(data) }}</p>
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
        <el-main>
          <el-page-header
            :content="diary.date===null?'PLEASE PICK A DAY':(diary.date.year+'-'+diary.date.month+'-'+diary.date.date)"
            @back="clean"
            title="CLEAN"
          ></el-page-header>
          <el-form :model="diary" style="margin-top:20px">
            <el-form-item label="SUMMARY" prop="extend" :label-width="formLabelWidth">
              <el-input type="textarea" autosize v-model="diary.extend"></el-input>
            </el-form-item>
            <el-form-item
              :label-width="formLabelWidth"
              v-for="(item, index) in diary.items"
              :label="'ITEM' + index"
              :key="index"
              :prop="'items.' + index +'.content'"
              :rules="{required: true, message: 'NO EMPTY'}"
            >
              <el-input
                v-model="item.start"
                onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                maxlength="2"
                class="input_time"
              ></el-input>
              <el-input
                v-model="item.end"
                onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                maxlength="2"
                class="input_time"
              ></el-input>
              <el-input v-model="item.content" class="input_ext"></el-input>
              <el-button size="small" @click.prevent="removeItem(item)">DEL</el-button>
            </el-form-item>
          </el-form>
          <span>
            <el-button @click="addItem">NEW ITEM</el-button>
            <el-button type="primary" @click.prevent="update">UPDATE</el-button>
          </span>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
      tableData: [],
      formLabelWidth: '120px',
      diary: {
        extend: '',
        items: [],
        date: null
      }
    }
  },
  methods: {
    clean() {
      this.diary.extend = ''
      this.diary.items = []
    },
    update() {
      let date = this.diary.date
      this.$confirm('WILL OVERWRITE ' + (date === null ? 'PLEASE PICK A DAY' : (date.year + '-' + date.month + '-' + date.date)), 'CONFIRM', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL',
        type: 'warning',
        center: false
      }).then(() => {
        this.$axios({
          method: 'post',
          url: 'diary',
          data: this.diary
        }).then(response => {
          if (response.data.status === 0) {
            this.$global.success(response.data.message)
            this.init()
          } else {
            this.$global.error(response.data.message)
          }
        }).catch((error) => {
          this.$global.error(error)
        })
      }).catch(() => {
        this.$global.info('CANCELL')
      })
    },
    removeItem(item) {
      var index = this.diary.items.indexOf(item)
      if (index !== -1) {
        this.diary.items.splice(index, 1)
      }
    },
    addItem() {
      this.diary.items.push({ start: '', end: '', content: '' })
    },
    picked(data) {
      if (data.isSelected) {
        return this.handleClick(data)
      } else {
        return ''
      }
    },
    handleClick(data) {
      let splits = data.day.split('-')
      this.diary.date = {
        year: splits[0],
        month: splits[1],
        date: splits[2]
      }
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
      let splits = row.split('-')
      this.diary.date = {
        year: splits[0],
        month: splits[1],
        date: splits[2]
      }
      this.$axios({
        method: 'get',
        url: 'diary/' + splits[0] + '/' + splits[1] + '/' + splits[2]
      }).then(response => {
        if (response.data.status === 0) {
          this.diary = response.data.data
        } else {
          this.$global.error(response.data.message)
        }
      }).catch((error) => {
        this.$global.error(error)
      })
    },
    init() {
      this.$axios({
        method: 'get',
        url: 'diary'
      }).then(response => {
        if (response.data.status === 0) {
          this.tableData = []
          this.tableData.push(...response.data.data)
        } else {
          this.$global.error(response.data.message)
        }
      }).catch((error) => {
        this.$global.error(error)
      })
    }
  },
  created() {
    this.init()
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

.input_time {
  width: 10%;
}

.input_ext {
  width: 60%;
}
</style>

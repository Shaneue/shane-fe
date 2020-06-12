<template>
  <el-container class="memo">
    <el-aside width="20%">
      <el-button @click="reName" size="small">RENAME</el-button>
      <el-button @click="create" size="small">CREATE</el-button>
      <el-button @click="del" size="small">DELETE</el-button>
      <el-tree
        style="margin-top:20px"
        :data="category"
        node-key="topic"
        @node-click="handleNodeClick"
        :props="defaultProps"
        highlight-current
        ref="tree"
        empty-text="EMPTY LIST"
      ></el-tree>
    </el-aside>
    <el-main>
      <el-button disabled type="info" size="medium">{{info}}</el-button>
      <el-button @click="update" size="medium">UPDATE</el-button>
      <el-input
        type="textarea"
        v-model="content"
        :autosize="{ minRows: 4, maxRows: 24}"
        style="margin-top:10px"
      ></el-input>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Memo',
  data() {
    return {
      msg: 'Memo',
      category: [{
        topic: 'TOPIC'
      }],
      content: '',
      info: 'NULL',
      key: '',
      defaultProps: {
        label: 'topic'
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$axios({ method: 'get', url: 'memo/' + data.k }).then(response => {
        if (response.data.status === 0) {
          this.content = response.data.data
          this.info = data.topic
          this.key = data.k
        } else {
          this.$global.error(response.data.message)
        }
      }).catch((error) => {
        this.$global.error(error)
      })
    },
    update() {
      this.$axios({
        method: 'post',
        url: 'memo/' + this.key + '/' + this.info,
        data: this.content,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      }).then(response => {
        if (response.data.status === 0) {
          this.$global.info('SUCCESS')
          this.init()
        } else {
          this.$global.error(response.data.message)
        }
      }).catch((error) => {
        this.$global.error(error)
      })
    },
    del() {
      if (!this.checkInfo()) {
        return
      }
      this.$confirm('WILL DELETE MEMO', 'CONFIRMATION', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL',
        type: 'warning',
        center: false
      }).then(() => {
        this.$axios({
          method: 'delete',
          url: 'memo/' + this.info
        }).then(response => {
          if (response.data.status === 0) {
            this.$global.info('SUCCESS')
            this.clear()
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
    create() {
      this.$prompt('ENTER NEW TOPIC', 'CREATE', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL'
      }).then(({ value }) => {
        this.$axios({
          method: 'post',
          url: 'memo/' + value
        }).then(response => {
          if (response.data.status === 0) {
            this.$global.info('SUCCESS')
            this.clear()
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
    reName() {
      if (!this.checkInfo()) {
        return
      }
      this.$prompt('ENTER NEW TOPIC', 'RENAME', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL'
      }).then(({ value }) => {
        this.$axios({
          method: 'post',
          url: 'memo',
          data: {
            oldName: this.info,
            newName: value
          }
        }).then(response => {
          if (response.data.status === 0) {
            this.$global.info('SUCCESS')
            this.clear()
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
    clear() {
      this.info = 'NULL'
      this.content = ''
      this.init()
    },
    checkInfo() {
      if (this.info === 'NULL') {
        this.$global.error('ITEM should be SELECTED first')
        return false
      }
      return true
    },
    init() {
      this.$axios({ method: 'get', url: 'memo/list' }).then(response => {
        if (response.data.status === 0) {
          this.category = response.data.data
        } else {
          this.$global.error(response.data.message)
        }
      }).catch((error) => {
        this.$global.error(error)
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-aside {
  margin-top: 20px;
}
</style>

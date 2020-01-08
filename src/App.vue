<template>
  <div id="app">
    <div id="menu">
      <el-menu
        :default-active="activeFunction"
        mode="horizontal"
        :unique-opened="true"
        :router="true"
      >
        <el-menu-item index="/">HOME</el-menu-item>
        <el-menu-item index="/memo">MEMO</el-menu-item>
        <el-menu-item index="/password">PASSWORD</el-menu-item>
        <el-menu-item index="/diary">DIARY</el-menu-item>
        <el-menu-item @click="open">
          <U>DOWNLOAD</U>
        </el-menu-item>
        <el-menu-item @click="dialogVisible = true">
          <U>UPLOAD</U>
        </el-menu-item>
        <el-menu-item>
          <a href="https://b.shaneu.cn" target="blank">BLOG</a>
        </el-menu-item>
      </el-menu>

      <el-dialog title="UPLOAD" :visible.sync="dialogVisible" width="50%">
        <el-upload
          action="resources/upload"
          name="zip"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">Pick a resources zip</el-button>
          <div slot="tip" class="el-upload__tip">.zip ONLY</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">CANCELL</el-button>
        </span>
      </el-dialog>

      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  name: 'App',
  computed: {
    activeFunction() { return this.$route.path }
  },
  methods: {
    open() {
      this.$confirm('WILL DOWNLOAD RESOURCE', 'CONFIRM', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL',
        type: 'warning',
        center: false
      }).then(() => {
        this.$global.success('SUCCESS')
        this.$axios({
          method: 'get',
          url: 'resources',
          responseType: 'blob'
        }).then(response => {
          this.$download(response)
        }).catch((error) => {
          this.$global.error(error)
        })
      }).catch(() => {
        this.$global.info('CANCELL')
      })
    },
    beforeUpload(file) {
      const isZIP = file.type === 'application/x-zip-compressed'
      const isTooLarge = file.size / 1024 / 1024 < 10

      if (!isZIP) {
        this.$global.error('.zip ONLY')
      }
      if (!isTooLarge) {
        this.$global.error('Can not exceed 10MB')
      }
      return isZIP && isTooLarge
    },
    handleSuccess(response, file, fileList) {
      this.dialogVisible = false
      if (response.status === 0) {
        this.$global.info(response.message)
      } else {
        this.$global.error(response.message)
      }
    },
    handleError(error, file, fileList) {
      this.dialogVisible = false
      this.$global.error(error.status.toString())
    }
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script type="text/javascript">
import Vue from 'vue'
const offset = 60
Vue.prototype.$global = {
  info: function (message) {
    return Vue.prototype.$message.info({ message: message, offset: offset })
  },
  error: function (message) {
    return Vue.prototype.$message.error({ message: message, offset: offset })
  },
  success: function (message) {
    return Vue.prototype.$message.success({ message: message, offset: offset })
  }
}

Vue.prototype.$download = function (response) {
  if (!response) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([response.data]))
  let link = document.createElement('a')
  let filename = response.headers['content-disposition'].split(';')[1].split('filename=')[1]
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)

  document.body.appendChild(link)
  link.click()
}

export default {

}
</script>

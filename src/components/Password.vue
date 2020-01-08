<template>
  <el-container class="password">
    <el-header>
      <el-button @click="newPassword">CREATE</el-button>&#8195;&#8195;
      <el-input
        class="input_fixed"
        v-model="search"
        placeholder="Enter Keyword"
        prefix-icon="el-icon-search"
        @keyup.enter.native="enter_code"
      ></el-input>&#8195;&#8195;CODE:&#160;&#160;
      <el-input
        class="input_fixed"
        v-model="code"
        placeholder="Enter Code"
        show-password
        @keyup.enter.native="enter_code"
      ></el-input>
    </el-header>
    <el-main>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form :model="form" ref="form">
          <el-form-item
            label="DESCRIPTION"
            prop="where"
            :label-width="formLabelWidth"
            :rules="{required: true, message: 'NO EMPTY'}"
          >
            <el-input v-model="form.where" placeholder="ENTER DESCRIPTION" class="input_new_pass"></el-input>
          </el-form-item>
          <el-form-item
            label="ACCOUNT"
            prop="account"
            :label-width="formLabelWidth"
            :rules="{required: true, message: 'NO EMPTY'}"
          >
            <el-input v-model="form.account" placeholder="ENTER ACCOUNT" class="input_new_pass"></el-input>
          </el-form-item>
          <el-form-item
            label="PASSWORD"
            prop="password"
            :label-width="formLabelWidth"
            :rules="{required: true, message: 'NO EMPTY'}"
          >
            <el-input
              v-model="form.password"
              placeholder="ENTER PASSWORD"
              class="input_new_pass"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            v-for="(remark, index) in form.ext"
            :label="'REMARKS' + index"
            :key="index"
            :prop="'ext.' + index +'.key'"
            :rules="{required: true, message: 'NO EMPTY'}"
          >
            <el-input v-model="remark.key" class="input_ext" placeholder="KEY"></el-input>
            <el-input v-model="remark.value" class="input_ext" placeholder="VALUE"></el-input>
            <el-button size="small" @click.prevent="removeRemark(remark)">DEL</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clear">CLEAR</el-button>
          <el-button @click="addRemark">NEW REMARK</el-button>
          <el-button type="primary" @click.prevent="submitForm('form')">YES</el-button>
        </span>
      </el-dialog>
      <el-table :data="tableData" empty-text="EMPTY" style="width: 100%" border max-height="500">
        <el-table-column align="center" fixed prop="w" label="DESCRIPTION" width="150"></el-table-column>
        <el-table-column align="center" prop="a" label="ACCOUNT" width="180"></el-table-column>
        <el-table-column align="center" prop="p" label="PASSWORD" width="180"></el-table-column>
        <el-table-column align="center" prop="e" label="COMMENTS" width="250"></el-table-column>
        <el-table-column align="center" prop="t" label="LAST UPDATED" width="180"></el-table-column>
        <el-table-column align="center" fixed="right" label="OPERATIONS" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="show_hide(scope.$index, tableData)"
            >S/H</el-button>
            <el-button @click="edit(scope.row)" type="text" size="small">EDIT</el-button>
            <el-button @click="del(scope.row)" type="text" size="small">DEL</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>

const hide = '******'

export default {
  name: 'Password',
  data() {
    return {
      msg: 'PASSWORD',
      code: '',
      search: '',
      tableData: [],
      passwords: {},
      dialogVisible: false,
      dialogTitle: '',
      form: {
        where: '',
        account: '',
        password: '',
        id: '',
        ext: [],
        code: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleClose(done) {
      this.form = {
        where: '',
        account: '',
        password: '',
        id: '',
        ext: [],
        code: ''
      }
      this.$refs['form'].resetFields()
      done()
    },
    submitForm(formName) {
      if (!this.checkCode()) {
        return
      }
      var method = 'put'
      if (this.form.id === '') {
        method = 'post'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.code = this.code
          this.$axios({ method: method, url: 'password', data: this.form }).then(response => {
            if (response.data.status === 0) {
              this.$global.info('SUCCESS')
              this.dialogVisible = false
              this.clear()
              this.enter_code()
            } else {
              this.$global.error(response.data.message)
            }
          }).catch((error) => {
            this.$global.error(error)
          })
        } else {
          return false
        }
      })
    },
    checkCode() {
      if (this.code === '') {
        this.$global.error('Code CANT be Empty')
        return false
      }
      return true
    },
    clear() {
      this.form = {
        where: '',
        account: '',
        password: '',
        id: '',
        ext: [],
        code: ''
      }
      this.$refs['form'].resetFields()
    },
    removeRemark(item) {
      var index = this.form.ext.indexOf(item)
      if (index !== -1) {
        this.form.ext.splice(index, 1)
      }
    },
    addRemark() {
      this.form.ext.push({
        value: '',
        key: ''
      })
    },
    enter_code() {
      if (!this.checkCode()) {
        return
      }
      this.$axios({
        method: 'post',
        url: 'passwords',
        data: {
          'code': this.code,
          'search': this.search
        }
      }).then(response => {
        if (response.data.status === 0) {
          this.passwords = {}
          for (var x in response.data.data) {
            var tmp = {}
            tmp['a'] = response.data.data[x].a
            response.data.data[x].a = hide
            tmp['p'] = response.data.data[x].p
            response.data.data[x].p = hide
            if (response.data.data[x].e) {
              response.data.data[x].e = JSON.stringify(response.data.data[x].e)
              tmp['e'] = response.data.data[x].e
              response.data.data[x].e = hide
            }
            response.data.data[x].h = true
            this.passwords[response.data.data[x].k] = tmp
          }
          this.tableData = response.data.data
        } else {
          this.$global.error(response.data.message)
          this.tableData = []
        }
      })
    },
    show_hide(index, rows) {
      if (rows[index].h) {
        let id = rows[index].k
        rows[index].a = this.passwords[id].a
        rows[index].p = this.passwords[id].p
        if (rows[index].e) {
          rows[index].e = this.passwords[id].e
        }
        rows[index].h = false
      } else {
        rows[index].a = hide
        rows[index].p = hide
        if (rows[index].e) {
          rows[index].e = hide
        }
        rows[index].h = true
      }
    },
    newPassword() {
      this.form = {
        where: '',
        account: '',
        password: '',
        id: '',
        ext: [],
        code: ''
      }
      this.dialogTitle = 'NEW PASSWORD'
      this.dialogVisible = true
    },
    edit(row) {
      this.form.id = row.k
      this.form.where = row.w
      this.form.account = this.passwords[this.form.id].a
      this.form.password = this.passwords[this.form.id].p
      if (this.passwords[this.form.id].e) {
        var ext = JSON.parse(this.passwords[this.form.id].e)
        for (var i in ext) {
          this.form.ext.push({
            value: ext[i].value,
            key: ext[i].key
          })
        }
      }
      this.dialogTitle = row.k
      this.dialogVisible = true
    },
    del(row) {
      this.$confirm('WILL DELETE PASSWORD', 'CONFIRM', {
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCELL',
        type: 'warning',
        center: false
      }).then(() => {
        this.$axios({
          method: 'post',
          url: '/password/' + row.k,
          data: { code: this.code }
        }).then(response => {
          this.$global.success('SUCCESS')
          this.enter_code()
        }).catch((error) => {
          this.$global.error(error)
        })
      }).catch(() => {
        this.$global.info('CANCELL')
      })
    }
  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input_fixed {
  width: 200px;
}
.password {
  margin-top: 20px;
}

.input_new_pass {
  width: 70%;
}

.input_ext {
  width: 30%;
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" class="input-with-select" v-model="searchValue" @change="valueChange" clearable>
        <el-button slot="append" icon="el-icon-search" @click="valueChange"></el-button>
      </el-input>
      <!-- 添加按钮 -->
      <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="45%" @close="resetField">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false;addUsers()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 97%" border class="table">
        <el-table-column prop="idx" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="scoped">
            <el-switch v-model="scoped.row.mg_state" active-color="#409eff"
              @change="switchChange($event,scoped.row.id)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template v-slot:default="scoped">
            <el-button type="primary" icon="el-icon-edit" size="medium"
              @click="changeUsersMethods(scoped.row.username,scoped.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteUsers(scoped.row.id)">
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="medium"></el-button>
          </template>
          <el-dialog title="提示" :visible.sync="changeUsers" width="45%" append-to-body @close="resetFrom">
            <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="usernameEdit">
                <el-input v-model="changeUsersName" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="changeForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="changeForm.phone"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="changeUsers = false">取 消</el-button>
              <el-button type="primary" @click="changeUsers = false;editForm()">确 定</el-button>
            </span>
          </el-dialog>
        </el-table-column>
      </el-table>
      <!-- 分页控件 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber"
        :page-sizes="[3, 5, 10, 15]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
        class="pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pageNumber: 1,
      pageSize: 5,
      switchValue: true,
      total: 0,
      searchValue: '',
      dialogVisible: false,
      changeUsers: false,
      changeUsersName: '',
      editFormId: '',
      ruleForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      changeForm: {
        usernameEdit: '',
        email: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getUsersData()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getUsersData()
    },
    getUsersData() {
      this.$http.get('users', { params: { query: this.searchValue, pagenum: this.pageNumber, pagesize: this.pageSize } }).then(response => {
        this.tableData = response.data.data.users
        this.total = response.data.data.total
        this.tableData.forEach((item, index) => {
          item.idx = index + 1
        })
      })
    },
    valueChange() {
      this.getUsersData()
    },
    switchChange($event, id) {
      this.$http.put(`users/${id}/state/${$event}`).then(response => { })
    },
    // 对话框关闭后重置表单
    resetField() {
      this.$refs.ruleForm.resetFields()
    },
    // 添加用户
    addUsers() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.post('users', {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            email: this.ruleForm.email,
            mobile: this.ruleForm.phone
          }).then(response => {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
          })
        } else {
          this.$message({
            message: '请输入正确的内容!',
            type: 'error'
          })
        }
      })
      this.getUsersData()
    },
    changeUsersMethods(username, id) {
      this.changeUsers = true
      this.changeUsersName = username
      this.editFormId = id
    },
    // 修改用户
    editForm() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.$http.put(`users/${this.editFormId}`, {
            email: this.changeForm.email,
            mobile: this.changeForm.phone
          }).then(response => {
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.getUsersData()
          })
        } else {
          this.$message({
            message: '请输入正确的内容!',
            type: 'error'
          })
        }
      })
    },
    // 删除用户
    deleteUsers(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUsersData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭对话框重置表单
    resetFrom() {
      this.$refs.changeForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 98%;
  background-color: #fff;
  margin: 20px auto 0 auto;
  padding-bottom: 20px;
  box-shadow: 0 0 6px #ccc;
  .table {
    margin: 20px 0 0 20px;
  }
  .pagination {
    margin: 20px 0 0 20px;
  }
}
.input-with-select {
  width: 500px;
  margin: 30px 15px 0 20px;
}
</style>

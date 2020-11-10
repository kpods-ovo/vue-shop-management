<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <el-button type="primary" class="addRoles" @click="dialogVisible = true">添加角色</el-button>
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="45%" @close="resetField">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="rolesname">
            <el-input v-model="ruleForm.rolesname"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="rolesdesc">
            <el-input v-model="ruleForm.rolesdesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false;addRoles()">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <el-table-column prop="" label="" width="80" type="expand">
          <template v-slot="scoped">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row :gutter="20" v-for="item1 in scoped.row.children" :key="item1.id" class="first_rights">
                <el-col :span="5">
                  <el-tag closable>{{item1.authName}}</el-tag>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="item2 in item1.children" :key="item2.id" class="second_rights">
                    <el-col :span="7">
                      <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    </el-col>
                    <el-col :span="17">
                      <el-row v-for="item3 in item2.children" :key="item3.id" class="third_rights">
                        <el-col>
                          <el-tag type="warning" closable>{{item3.authName}}</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="idx" label="#" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template v-slot:default="scoped">
            <el-button type="primary" icon="el-icon-edit"
              @click="changeUsers = true;editRoles(scoped.row.id,scoped.row.roleName)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scoped.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting"
              @click="distributeRoles = true;distribute(scoped.row.children,scoped.row.id)">分配权限
            </el-button>
          </template>
          <!-- 编辑角色对话框 -->
          <el-dialog title="提示" :visible.sync="changeUsers" width="45%" append-to-body @close="resetFrom">
            <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="角色名称" prop="rolesName">
                <el-input v-model="changeUsersName" disabled></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="rolesdesc">
                <el-input v-model="changeForm.rolesdesc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="changeUsers = false">取 消</el-button>
              <el-button type="primary" @click="changeUsers = false;changeRoles()">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 分配权限对话框 -->
          <el-dialog title="分配权限" :visible.sync="distributeRoles" width="45%" :append-to-body="true">
            <el-tree default-expand-all ref="tree" :data="rightsData" show-checkbox node-key="id" :props="defaultProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="distributeRoles = false">取 消</el-button>
              <el-button type="primary" @click="distributeRoles = false;changeRights()">确 定</el-button>
            </span>
          </el-dialog>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      changeUsers: false,
      changeUsersName: '',
      rolesId: 0,
      distributeRoles: false,
      currentRights: [],
      changeRightsId: 0,
      ruleForm: {
        rolesName: '',
        rolesdesc: ''
      },
      changeForm: {
        rolesname: '',
        rolesdesc: ''
      },
      rules: {
        rolesname: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        rolesdesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getRolesList()
    this.getRightsList()
  },
  methods: {
    // 获取角色列表数据
    getRolesList() {
      this.$http.get('roles').then(response => {
        this.rolesList = response.data.data
        this.rolesList.forEach((item, index) => {
          item.idx = index + 1
        })
      })
    },
    resetField() {
      this.$refs.ruleForm.resetFields()
    },
    resetFrom() {
      this.$refs.changeForm.resetFields()
    },
    // 添加角色
    addRoles() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.post('roles', {
            roleName: this.ruleForm.rolesname,
            roleDesc: this.ruleForm.rolesdesc
          }).then(response => {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getRolesList()
          })
        } else {
          this.$message({
            message: '请输入正确的内容!',
            type: 'error'
          })
        }
      })
    },
    editRoles(id, name) {
      this.changeUsersName = name
      this.rolesId = id
    },
    // 编辑角色
    changeRoles() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          this.$http.put(`roles/${this.rolesId}`, {
            roleName: this.changeUsersName,
            roleDesc: this.changeForm.rolesdesc
          }).then(response => {
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
            this.getRolesList()
          })
        } else {
          this.$message({
            message: '请输入正确的内容!',
            type: 'error'
          })
        }
      })
    },
    // 删除角色
    deleteRoles(id) {
      this.$http.delete(`roles/${id}`).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.getRolesList()
        } else {
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
        }
      })
    },
    // 获取所有权限列表
    getRightsList() {
      this.$http.get('rights/tree').then(response => {
        this.rightsData = response.data.data
      })
    },
    // 点击分配权限后获取当前用户权限
    distribute(data, id) {
      this.changeRightsId = id
      var arr = []
      function getCurrentRights(childData) {
        childData.forEach(item => {
          if (item.children !== undefined) {
            return getCurrentRights(item.children)
          } else {
            arr.push({ authName: item.authName, id: item.id })
          }
        })
      }
      getCurrentRights(data)
      this.currentRights = arr
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.currentRights)
      })
    },
    // 更改角色权限
    changeRights() {
      const arr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      this.$http.post(
        `roles/${this.changeRightsId}/rights`, { rids: arr.join(',') }
      ).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
          this.getRolesList()
        } else {
          console.log(response.data)
          this.$message({
            message: '更新失败!',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 96%;
  background-color: #fff;
  margin: 20px auto 0 auto;
  padding: 20px;
  box-shadow: 0 0 6px #ccc;
  .addRoles {
    margin-bottom: 20px;
  }
  .el-row {
    display: flex;
    align-items: center;
    .el-col {
      padding: 5px 0;
      margin-right: 15px;
    }
  }
  .first_rights {
    border-bottom: 1px solid rgb(236, 236, 236);
  }
  .first_rights:first-child {
    border-top: 1px solid rgb(236, 236, 236);
  }
  .second_rights:not(:first-child) {
    border-top: 1px solid rgb(236, 236, 236);
  }
  .third_rights {
    display: inline-block;
  }
  .el-table__body-wrapper .el-button {
    height: 37px;
  }
}
</style>

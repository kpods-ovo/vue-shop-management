<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <el-button type="primary" class="addClass" @click="dialogVisible = true">添加分类</el-button>
      <el-table :data="categoriesLists" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="idx" label="#" width="60">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <i class="el-icon-success"></i>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scoped.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit"
              @click="editDialogVisible = true;getCurrentId(scoped.row.cat_id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteClass(scoped.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="45%" @close="resetRulesField">
        <el-form :model="editRuleForm" :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="editRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false;editClassification()">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[3, 5, 10, 15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="45%" append-to-body @close="resetField">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="ruleForm.name" style="width:89.8%"></el-input>
          </el-form-item>
          <div class="parentClassification" style="padding-left: 32px">
            <span class="el-form-item__label">父级分类</span>
            <el-cascader ref="cascader" :options="options" :props="{ checkStrictly: true }" style="width:80%" clearable
              @change="getParentPid">
            </el-cascader>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false;addClassification()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表数组
      categoriesLists: [],
      // 当前页码
      pageNum: 1,
      // 每页显示条数
      pageSize: 5,
      // 总条目数
      total: 0,
      // 控制添加分类按钮的对话框是否显示
      dialogVisible: false,
      // 控制编辑分类按钮的对话框是否显示
      editDialogVisible: false,
      // 添加分类对话框的表单数据
      ruleForm: {
        name: '',
        // 父级分类
        parentClassification: ''
      },
      // 编辑分类的表单数据
      editRuleForm: {
        name: ''
      },
      // 添加分类对话框的表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 级联选择器选项内容
      options: [],
      // 添加分类参数
      pid: 0,
      level: 0,
      // 当前编辑分类id
      currentId: 0
    }
  },
  created() {
    this.getCategoriesLists()
    this.getCategories()
  },
  methods: {
    // 获取当前页商品分类列表
    getCategoriesLists() {
      this.$http.get('categories', { params: { pagenum: this.pageNum, pagesize: this.pageSize } }).then(response => {
        this.categoriesLists = response.data.data.result
        this.total = response.data.data.total
        this.categoriesLists.forEach((item, index) => {
          item.idx = index + 1
        })
      })
    },
    // 获取所有商品分类列表
    getCategories() {
      this.$http.get('categories', { params: { type: 2 } }).then(response => {
        this.options = response.data.data
        this.options.forEach(item => {
          item.value = item.cat_id
          item.label = item.cat_name
          if (item.children !== undefined) {
            item.children.forEach(itemchild => {
              itemchild.value = itemchild.cat_id
              itemchild.label = itemchild.cat_name
            })
          }
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoriesLists()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getCategoriesLists()
    },
    // 获取添加分类父id
    getParentPid(pid) {
      if (pid.length === 0) {
        this.pid = 0
      } else {
        this.pid = pid[pid.length - 1]
      }
      this.level = pid.length
    },
    // 添加分类
    addClassification() {
      this.$http.post('categories', {
        cat_pid: this.pid,
        cat_name: this.ruleForm.name,
        cat_level: this.level
      }).then(response => {
        if (response.data.meta.status === 201) {
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          this.getCategoriesLists()
          this.getCategories()
        } else {
          this.$message({
            message: '添加失败!',
            type: 'error'
          })
        }
      })
    },
    // 添加分类对话框关闭后重置表单
    resetField() {
      this.$refs.ruleForm.resetFields()
      // 清空级联选择器选中状态
      this.$refs.cascader.$refs.panel.clearCheckedNodes()
    },
    // 编辑分类对话框关闭后重置表单
    resetRulesField() {
      this.$refs.editRuleForm.resetFields()
    },
    // 获得当前分类Id
    getCurrentId(id) {
      this.currentId = id
    },
    // 编辑分类
    editClassification() {
      this.$http.put(`categories/${this.currentId}`, { cat_name: this.editRuleForm.name }).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
          this.getCategoriesLists()
          this.getCategories()
        } else {
          this.$message({
            message: '更新失败',
            type: 'error'
          })
        }
      })
    },
    // 删除分类
    deleteClass(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${id}`).then(response => {
          if (response.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getCategoriesLists()
            this.getCategories()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
  .addClass {
    margin-bottom: 20px;
  }
  .el-icon-success {
    color: #189fa9;
  }
}
</style>

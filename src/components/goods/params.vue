<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <!-- 提示栏 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类栏 -->
      <div class="cascader">
        <span>选择商品分类 :</span>
        <el-cascader v-model="value" :options="options" @change="getValue"></el-cascader>
      </div>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="small" @click="dialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格数据 -->
          <el-table :data="manyTableData" style="width: 100%" border @expand-change="expandSelect" :row-key='getRowKeys'
            :expand-row-keys="expands">>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag :key="tag" v-for="tag in props.row.valArry" closable :disable-transitions="false"
                  @close="handleClose(tag,props.row.valArry,props.row.attr_id,'many',props.row.attr_name)">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                  @blur="handleInputConfirm(props.row.valArry,props.row.attr_id,'many',props.row.attr_name)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="idx" width="60">
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template v-slot="scoped">
                <el-button type="primary" icon="el-icon-edit" class="changeBtn"
                  @click="editDialogVisible = true;editParams(scoped.row.idx,scoped.row.attr_id,'many')">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" class="changeBtn"
                  @click="deleteParams(scoped.row.attr_id,'many')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="small" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 静态参数表格数据 -->
          <el-table :data="onlyTableData" style="width: 100%" border @expand-change="expandSelect" :row-key='getRowKeys'
            :expand-row-keys="expands">
            <el-table-column type="expand">
              <template v-slot="props">
                <!-- <el-form label-position="left" inline class="demo-table-expand">
                  <span v-for="(item,index) in props.row.valArry" :key="index">
                    <el-tag :key="item" closable :type="''">{{item}}</el-tag>
                  </span>
                </el-form> -->
                <el-tag :key="tag" v-for="tag in props.row.valArry" closable :disable-transitions="false"
                  @close="handleClose(tag,props.row.valArry,props.row.attr_id,'only',props.row.attr_name)">
                  {{tag}}
                </el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                  @blur="handleInputConfirm(props.row.valArry,props.row.attr_id,'only',props.row.attr_name)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="idx" width="60">
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" prop="">
              <template v-slot="scoped">
                <el-button type="primary" icon="el-icon-edit" class="changeBtn"
                  @click="editStaticDialogVisible = true;editParams(scoped.row.idx,scoped.row.attr_id,'only')">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" class="changeBtn"
                  @click="deleteParams(scoped.row.attr_id,'only')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 动态参数添加对话框 -->
      <el-dialog title="添加动态参数" :visible.sync="dialogVisible" width="45%" append-to-body @close="resetField">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="动态参数" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false;addParams('many',ruleForm)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 静态参数添加对话框 -->
      <el-dialog title="添加静态参数" :visible.sync="addDialogVisible" width="45%" append-to-body @close="resetAddField">
        <el-form :model="addStaticRuleForm" :rules="rules" ref="addStaticRuleForm" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="静态参数" prop="name">
            <el-input v-model="addStaticRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false;addParams('only',addStaticRuleForm)">确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 动态参数修改对话框 -->
      <el-dialog title="修改动态参数" :visible.sync="editDialogVisible" width="45%" append-to-body @close="resetEditField">
        <el-form :model="editRuleForm" :rules="rules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="动态参数" prop="name">
            <el-input v-model="editRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false;changeEditParams('many',editRuleForm)">确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 静态参数修改对话框 -->
      <el-dialog title="修改静态参数" :visible.sync="editStaticDialogVisible" width="45%" append-to-body
        @close="resetEditField">
        <el-form :model="editStaticRuleForm" :rules="rules" ref="editStaticRuleForm" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="静态参数" prop="name">
            <el-input v-model="editStaticRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editStaticDialogVisible = false">取 消</el-button>
          <el-button type="primary"
            @click="editStaticDialogVisible = false;changeEditParams('only',editStaticRuleForm)">确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: [],
      manyTableData: [],
      onlyTableData: [],
      activeName: 'first',
      // 获取参数列表的params参数
      many: 'many',
      only: 'only',
      // 标签
      inputVisible: false,
      inputValue: '',
      // 选中的分类id
      chooseId: 0,
      // 动态参数添加对话框属性
      dialogVisible: false,
      // 静态参数添加对话框属性
      addDialogVisible: false,
      // 动态参数修改对话框属性
      editDialogVisible: false,
      // 静态参数修改对话框属性
      editStaticDialogVisible: false,
      // 当前修改参数idx,id
      currentEditId: 0,
      currentParamsId: 0,
      // 添加动态参数对话框的表单数据及规则
      ruleForm: {
        name: ''
      },
      addStaticRuleForm: {
        name: ''
      },
      // 动态
      editRuleForm: {
        name: ''
      },
      // 静态
      editStaticRuleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      expands: [],
      getRowKeys(row) {
        return row.idx
      }
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    expandSelect: function (row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.idx)
        }
      } else {
        this.expands = []
      }
    },
    // 删除当前参数
    deleteParams(attrId, sel) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.chooseId}/attributes/${attrId}`).then(response => {
          if (response.data.meta.status === 200) {
            this.getParamsList(sel, '删除')
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
    },
    // 修改当前参数
    changeEditParams(sel, form) {
      this.$http.put(`categories/${this.chooseId}/attributes/${this.currentParamsId}`,
        {
          attr_name: form.name,
          attr_sel: sel
        }).then(response => {
          if (response.data.meta.status === 200) {
            this.getParamsList(sel, '修改')
          } else {
            this.$message({
              message: '修改参数失败!',
              type: 'error'
            })
          }
        })
    },
    // 获取当前修改参数id
    editParams(idx, id, sel) {
      this.currentEditId = idx
      this.currentParamsId = id
      if (sel === 'many') {
        this.editRuleForm.name = this.manyTableData[idx - 1].attr_name
      } else {
        this.editStaticRuleForm.name = this.onlyTableData[idx - 1].attr_name
      }
    },
    // 参数对话框表单数据刷新
    resetField() {
      this.$refs.ruleForm.resetFields()
    },
    resetAddField() {
      this.$refs.addStaticRuleForm.resetFields()
    },
    resetEditField() {
      // this.editParams(this.currentEditId)
    },
    // 删除动态参数属性标签
    handleClose(tag, valArry, attrId, sel, attrName) {
      valArry.splice(valArry.indexOf(tag), 1)
      this.$http.put(`categories/${this.chooseId}/attributes/${attrId}`,
        {
          attr_name: attrName,
          attr_sel: sel,
          attr_vals: valArry.join(',')
        }).then(response => {
          if (response.data.meta.status === 200) {
            this.getParamsList(sel, '删除属性')
          } else {
            this.$message({
              message: '删除属性失败!',
              type: 'error'
            })
          }
        })
    },
    // 显示添加标签按钮
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加新标签
    handleInputConfirm(valArry, attrId, sel, attrName) {
      const inputValue = this.inputValue
      if (inputValue) {
        valArry.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.$http.put(`categories/${this.chooseId}/attributes/${attrId}`,
        {
          attr_name: attrName,
          attr_sel: sel,
          attr_vals: valArry.join(',')
        }).then(response => {
          if (response.data.meta.status === 200) {
            this.getParamsList(sel, '添加属性')
          } else {
            this.$message({
              message: '添加属性失败!',
              type: 'error'
            })
          }
        })
    },
    // 切换动静态参数列表
    handleClick(tab) {
      if (tab.label === '动态参数') {
        this.getParamsList(this.many)
      } else {
        this.getParamsList(this.only)
      }
    },
    // 获取所有商品分类列表
    getCategories() {
      this.$http.get('categories', { params: { type: 3 } }).then(response => {
        this.options = response.data.data
        function changelabel(options) {
          options.forEach(item => {
            item.value = item.cat_id
            item.label = item.cat_name
            if (item.children !== undefined) {
              changelabel(item.children)
            }
          })
        }
        changelabel(this.options)
      })
    },
    // 获取级联选择器选中项
    getValue(val) {
      this.chooseId = val[2]
      if (this.value.length !== 3) {
        this.value = ''
      }
      if (this.activeName === 'first') {
        this.getParamsList(this.many)
      } else {
        this.getParamsList(this.only)
      }
    },
    // 获取动态参数列表
    getParamsList(sel, message = '获取参数列表') {
      if (this.value === '') {
        this.$message({
          message: '只能选择三级分类!',
          type: 'error'
        })
      } else {
        this.$http.get(`categories/${this.value[2]}/attributes`, { params: { sel: sel } }).then(response => {
          if (response.data.meta.status === 200) {
            this.$message({
              message: message + '成功!',
              type: 'success'
            })
            if (sel === 'many') {
              this.manyTableData = response.data.data
              this.manyTableData.forEach((item, index) => {
                item.idx = index + 1
                item.valArry = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
              })
            } else {
              this.onlyTableData = response.data.data
              this.onlyTableData.forEach((item, index) => {
                item.idx = index + 1
                item.valArry = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
              })
            }
          } else {
            this.$message({
              message: '获取参数列表失败!',
              type: 'error'
            })
          }
        })
      }
    },
    // 添加动态或静态参数
    addParams(sel, form) {
      this.$http.post(`categories/${this.chooseId}/attributes`, {
        attr_name: form.name,
        attr_sel: sel
      }).then(response => {
        if (response.data.meta.status === 201) {
          this.getParamsList(sel, '添加')
        } else {
          this.$message({
            message: '添加失败!',
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
  .cascader {
    margin-top: 20px;
    margin-bottom: 20px;
    span {
      margin-right: 15px;
    }
  }
  .el-button {
    margin-bottom: 20px;
  }
  .el-tag + .el-tag {
    margin: 0 10px 15px 10px;
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin: 0 10px 15px 10px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
  }
  .changeBtn {
    margin-bottom: 0;
    width: 100px;
    height: 30px;
    line-height: 30px;
    padding: 0;
  }
}
</style>

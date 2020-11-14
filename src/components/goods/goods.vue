<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select" @change="inputChange">
        <el-button slot="append" icon="el-icon-search" @click="inputChange"></el-button>
      </el-input>
      <el-button type="primary" style="margin-left: 20px" @click="addGoods">添加商品</el-button>
      <!-- 表格数据 -->
      <el-table :data="goodsList" border style="width: 100%;margin:20px 0px">
        <el-table-column prop="idx" label="#" width="60">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90">
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template v-slot="scoped">
            <span>{{scoped.row.add_time | dateFormat('yyyy-MM-dd')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" class="operationBtn"
              @click="dialogFormVisible = true;editCurrent(scoped.row.goods_id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" class="operationBtn"
              @click="deleteGoods(scoped.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑商品对话框 -->
      <el-dialog title="修改商品" :visible.sync="dialogFormVisible" width="45%" @close="resetField">
        <el-form :model="ruleFormNess" :rules="rules" ref="ruleFormNess" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleFormNess.name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="ruleFormNess.price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input v-model="ruleFormNess.number"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="weight">
            <el-input v-model="ruleFormNess.weight"></el-input>
          </el-form-item>
        </el-form>
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
          <el-form-item label="介绍" prop="introduce">
            <el-input v-model="ruleForm.introduce"></el-input>
          </el-form-item>
          <el-form-item label="图片临时路径" prop="url">
            <el-input v-model="ruleForm.url"></el-input>
          </el-form-item>
          <el-form-item label="商品的参数" prop="params">
            <el-input v-model="ruleForm.params"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false;editGoodsList()">确 定
          </el-button>
        </span>
      </el-dialog>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
        :page-sizes="[3, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框输入数据
      input: '',
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 5,
      // 总商品数
      total: 0,
      // 编辑商品对话框
      dialogFormVisible: false,
      // 编辑商品对话框数据及规则
      // 必填
      ruleFormNess: {
        id: '',
        name: '',
        price: '',
        number: '',
        weight: ''
      },
      // 非必填
      ruleForm: {
        introduce: '',
        url: '',
        params: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      goodsList: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 分页切换
    handleSizeChange(val) {
      this.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getGoodsList()
    },
    // 获取商品列表数据
    getGoodsList() {
      this.$http.get('goods', {
        params: {
          query: this.input,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: '获取商品列表成功!',
            type: 'success'
          })
          this.goodsList = response.data.data.goods
          this.goodsList.forEach((item, index) => {
            item.idx = index + 1
          })
          this.total = response.data.data.total
        } else {
          this.$message({
            message: '获取商品列表失败!',
            type: 'error'
          })
        }
      })
    },
    // 搜索商品
    inputChange() {
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${id}`).then(response => {
          if (response.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getGoodsList()
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
    // 重置表单数据
    resetField() {
      this.$refs.ruleForm.resetFields()
      this.$refs.ruleFormNess.resetFields()
    },
    // 获取当前编辑对象的id
    editCurrent(id) {
      this.ruleForm.id = id
    },
    // 编辑对象确定按钮
    editGoodsList() {
      this.$http.put(`goods/${this.ruleFormNess.id}`, {
        goods_name: this.ruleFormNess.name,
        goods_price: this.ruleFormNess.price,
        goods_number: this.ruleFormNess.number,
        goods_weight: this.ruleFormNess.weight,
        goods_introduce: this.ruleForm.introduce,
        pics: this.ruleForm.url,
        attrs: this.ruleForm.params
      }).then(response => {
        if (response.data.meta.status === 201) {
          this.$message({
            message: '修改商品成功！',
            type: 'success'
          })
          this.getGoodsList()
        } else {
          this.$message({
            message: '修改商品失败！'
          })
          console.log(response.data)
        }
      })
    },
    // 添加商品
    addGoods() {
      this.$router.push('/addgoods')
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~">>>";
.container {
  width: 96%;
  background-color: #fff;
  margin: 20px auto 0 auto;
  padding: 20px;
  box-shadow: 0 0 6px #ccc;
  // 搜索框
  .input-with-select {
    width: 400px;
  }
  @{deep} .el-select-dropdown {
    top: 577px !important;
    @{deep} .el-scrollbar__wrap {
      overflow-x: none !important;
    }
  }
  .operationBtn {
    height: 30px !important;
    line-height: 30px;
    padding: 0 20px;
  }
}
</style>

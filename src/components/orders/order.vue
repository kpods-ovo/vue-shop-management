<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <el-input placeholder="请输入内容" v-model="searchContent" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
      </el-input>
      <el-table :data="tableData" border style="width: 100%;margin-bottom: 20px">
        <el-table-column prop="idx" label="#" width="60">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template v-slot="scoped">
            <el-tag type="danger" v-if="scoped.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80">
        </el-table-column>
        <el-table-column label="下单时间" width="220">
          <template v-slot="scoped">
            {{scoped.row.create_time | dateFormat('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" class="operateBtn" @click="dialogVisible = true"></el-button>
          <el-button disabled type="success" icon="el-icon-location" class="operateBtn"
            @click="logisticsDialogVisible = true">
          </el-button>
        </el-table-column>
      </el-table>
      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="dialogVisible" width="45%" @close="resetField">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="city">
            <el-cascader :options="cityOptions" v-model="ruleForm.city" class="cascader">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流进度查询对话框 -->
      <el-dialog title="物流进度" :visible.sync="logisticsDialogVisible" width="45%">
        <el-timeline :reverse="false">
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logisticsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
        :page-sizes="[3, 5, 10, 15]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 引入中国省市数据
import cityOptions from '../../assets/city_data2017_element.js'
export default {
  data() {
    return {
      // 搜索框数据
      searchContent: '',
      // 表格数据
      tableData: [],
      // 当前页码
      pagenum: 1,
      // 每页显示条数
      pagesize: 5,
      // 订单总条数
      total: 0,
      // 对话框属性
      dialogVisible: false,
      logisticsDialogVisible: false,
      // 中国省市数据
      cityOptions: cityOptions,
      ruleForm: { city: '', address: '' },
      rules: {
        city: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      // 当前订单号id
      orderId: 0
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单数据
    getOrdersList() {
      this.$http.get('orders', {
        params: {
          query: this.searchContent,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: '获取订单列表成功!',
            type: 'success'
          })
          this.total = response.data.data.total
          this.tableData = response.data.data.goods
          this.tableData.forEach((item, index) => {
            item.idx = index + 1
          })
        } else {
          this.$message({
            message: '获取订单列表失败!',
            type: 'error'
          })
        }
      })
    },
    // 分页栏操作
    handleSizeChange(val) {
      this.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getOrdersList()
    },
    // 搜索内容
    search() {
      this.getOrdersList()
    },
    // 重置表单内容
    resetField() {
      this.$refs.ruleForm.resetFields()
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
  .input-with-select {
    width: 500px;
    margin-bottom: 20px;
  }
  .operateBtn {
    height: 30px !important;
    line-height: 30px;
    padding: 0 20px;
  }
  .cascader {
    width: 100%;
  }
}
</style>

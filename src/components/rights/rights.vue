<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column prop="idx" label="#" width="80">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="" label="权限等级">
          <template v-slot="scoped">
            <el-tag v-if="scoped.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scoped.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.$http.get('rights/list').then(response => {
        this.tableData = response.data.data
        this.tableData.forEach((item, index) => {
          item.idx = index + 1
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
  padding: 40px 20px 20px 20px;
  box-shadow: 0 0 6px #ccc;
}
</style>

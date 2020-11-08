<template>
  <div class="home_content">
    <el-container class="home_container">
      <el-header class="home_header">电商后台管理系统</el-header>
      <el-container>
        <el-aside width="200px" class="home_aside">
          <el-menu width="200px" default-active="2" class="el-menu-vertical-demo" background-color="#333744"
            text-color="#fff" unique-opened>
            <el-submenu :index="i1+''" v-for="(item1,i1) in rightsList" :key="item1.id">
              <template slot="title">
                <i :class="icon[i1]"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item-group v-for="(item2,i2) in item1.children" :key="item2.id">
                <el-menu-item :index="i1+'-'+i2" class="el-icon-menu" @click="toUserList(item2.path)">
                  {{item2.authName}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      icon: [
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-tools',
        'el-icon-s-custom',
        'el-icon-s-data'
      ],
      path: this.$route.path
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    getRightsList() {
      this.$http.get('rights/tree').then(response => {
        this.rightsList = response.data.data
      })
    },
    toUserList(url) {
      this.$router.push('/' + url)
    }
  }
}
</script>

<style lang="less" scoped>
.home_content {
  height: 100%;
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.home_header {
  background-color: #373d41;
  font-size: 24px;
  color: #fff;
  display: flex;
  align-items: center;
}
.home_aside {
  background-color: #333744;
  .el-menu-item::before {
    margin-right: 6px;
  }
}
.el-menu li {
  width: 200px;
}
</style>>

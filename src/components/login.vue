<template>
  <div class="login_content">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="form" :model="form" label-width="auto" :rules="rules">
        <el-form-item label="" prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="login_button">
        <el-button type="primary" @click='login'>登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$http.post('login', this.form).then(response => {
        if (response.data.meta.status === 400) {
          this.$message.error('用户名不存在或密码错误!')
        } else {
          window.sessionStorage.setItem('token', response.data.data.token)
          this.$message.success('登录成功!')
          this.$router.push('/home')
        }
      })
    },
    reset() {
      this.form.username = ''
      this.form.password = ''
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_content {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .logo {
    position: absolute;
    width: 170px;
    height: 170px;
    background-color: #e8e8e8;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    border-radius: 50%;
    overflow: hidden;
    border: 10px solid #fff;
    box-shadow: 0 0 6px #ccc;
    img {
      width: 170px;
      height: 170px;
    }
  }
  .login_box {
    width: 600px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 3px;
    .el-form {
      margin-top: 180px;
      text-align: center;
      /deep/.el-form-item__error {
        left: 35px;
      }
      .el-input {
        width: 540px;
        /deep/ .el-input__inner {
          height: 45px;
          line-height: 45px;
        }
        /deep/ .el-input__prefix {
          line-height: 45px;
          font-size: 18px;
        }
      }
    }
    .login_button {
      float: right;
      margin-right: 30px;
      margin-top: 10px;
      .el-button {
        width: 90px;
        height: 50px;
        font-size: 16px;
        margin-left: 20px;
      }
    }
  }
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false" class="tips">
      </el-alert>
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs v-model="activeName" tab-position="left" style="margin-top:30px" @tab-click="tabChoose"
        :before-leave="tabSwitch">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
            label-position="top">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="value" :options="options" @change="getValue"></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="second">
          <div v-for="(item1,index1) in manyParamsLists" :key="item1.attr_id">
            <p>{{item1.attr_name}}</p>
            <el-tag effect="plain" style="height:35px;line-height:32px;margin:5px 10px"
              v-for="(item2,index2) in item1.valArry" :key="index2">
              <el-checkbox :v-model="checkArry[index1][index2]" @change="getManyAttr($event,item2,item1.attr_id)">
                {{item2}}
              </el-checkbox>
            </el-tag>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="third">
          <el-form :label-position="'top'" label-width="80px" :model="formLabelAlign">
            <el-form-item :label="item.attr_name" v-for="(item,index) in onlyParamsLists" :key="item.attr_id">
              <el-input v-model="formLabelAlign.valArry[index]"
                @change="getOnlyAttr(item.attr_id,formLabelAlign.valArry[index])">
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="fourth">
          <el-upload class="upload-demo" :action="uploadUrl" :on-preview="openDiag" :on-remove="handleRemove"
            :file-list="fileList" list-type="picture" :headers="header" :on-success="getPic">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <!-- 图片预览的对话框 -->
        <el-dialog title="图片预览" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
          <img :src="picUrl" style="width:100%;height:100%">
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-tab-pane label="商品内容" name="fifth">
          <quill-editor v-model="goods_introduce"></quill-editor>
          <el-button type="primary" class="addGoodsBtn" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前步骤条
      active: 0,
      // 当前标签页
      activeName: 'first',
      // 复选框默认选中
      checked: [],
      // 基本信息表单数据及规则
      ruleForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      value: [],
      options: [],
      // 选中的分类ID
      chooseId: 0,
      // 分类id列表
      goods_cat: '',
      manyParamsLists: [],
      onlyParamsLists: [],
      // 复选框数组
      checkArry: [],
      // 商品属性数据
      labelPosition: 'right',
      formLabelAlign: {
        valArry: []
      },
      // 图片数组
      fileList: [],
      // 图片路径
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的请求头
      header: { Authorization: window.sessionStorage.getItem('token') },
      // 需添加的商品的图片数组
      pics: [],
      dialogVisible: false,
      picUrl: '',
      // 商品介绍内容
      goods_introduce: '',
      // 商品的参数数组，包含动态参数和静态属性
      attrs: []
    }
  },
  created() {
    this.getGoodsCate()
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    // tab栏关联步骤条
    tabChoose(value) {
      if (this.value.length === 0) {
        this.$message({
          message: '请选择商品分类!',
          type: 'error'
        })
      } else {
        this.active = parseInt(value.index)
      }
    },
    tabSwitch() {
      if (this.value.length === 0) {
        return false
      }
      return true
    },
    // 获取级联选择器选项
    getValue(val) {
      if (this.value.length !== 3) {
        this.value = ''
        this.$message({
          message: '请选择三级分类!',
          type: 'error'
        })
      } else {
        this.chooseId = val[2]
        this.goods_cat = val.join(',')
        this.getParamsList(this.chooseId, 'many')
        this.getParamsList(this.chooseId, 'only')
      }
    },
    // 获取商品参数列表
    getParamsList(id, sel) {
      this.$http.get(`categories/${id}/attributes`, { params: { sel: sel } }).then(response => {
        if (sel === 'many') {
          this.manyParamsLists = response.data.data
          this.manyParamsLists.forEach((item, index) => {
            item.valArry = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            item.checkArry = Array(item.valArry.length).fill(true)
            this.checkArry[index] = item.checkArry
          })
        } else {
          this.onlyParamsLists = response.data.data
          this.onlyParamsLists.forEach((item, index) => {
            this.formLabelAlign.valArry[index] = item.attr_vals
          })
        }
      })
    },
    // 获取商品分类数据
    getGoodsCate() {
      this.$http.get('categories').then(response => {
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
    // 移出与预览图片
    handleRemove(file) {
      this.pics.forEach((item, index) => {
        if (item.pic === file.response.data.tmp_path) {
          this.pics.splice(index, 1)
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    // 获取上传成功后返回的数据
    getPic(response) {
      this.pics.push({ pic: response.data.tmp_path })
      this.picUrl = response.data.url
    },
    // 关闭对话框提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 打开对话框
    openDiag() {
      this.dialogVisible = true
    },
    // 获取商品动态参数
    getManyAttr($event, name, id) {
      if ($event === true) {
        this.attrs.push({ attr_id: id, attr_value: name })
      } else {
        this.attrs.forEach((item, index) => {
          if (item.attr_value === name) {
            this.attrs.splice(index, 1)
          }
        })
      }
    },
    // 获取静态商品参数
    getOnlyAttr(id, val) {
      this.attrs.forEach(item => {
        if (item.attr_id === id) {
          item.attr_vals = val
        } else {
          this.attrs.push({ attr_id: id, attr_value: val })
        }
      })
    },
    // 添加商品
    addGoods() {
      this.onlyParamsLists.forEach(item => {
        this.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
      })
      this.$http.post('goods', {
        goods_name: this.ruleForm.goods_name,
        goods_cat: this.goods_cat,
        goods_price: this.ruleForm.goods_price,
        goods_number: this.ruleForm.goods_number,
        goods_weight: this.ruleForm.goods_weight,
        goods_introduce: this.goods_introduce,
        pics: this.pics,
        attrs: this.attrs
      }).then(response => {
        if (response.data.meta.status === 201) {
          this.$message({
            message: '商品添加成功!',
            type: 'success'
          })
          this.$router.push('/goods')
        } else {
          this.$message({
            message: '商品添加失败!',
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
  .tips {
    margin-bottom: 20px;
  }
  /deep/ .el-upload-list--picture {
    /deep/ .el-upload-list__item-thumbnail {
      width: auto !important;
    }
  }
  /deep/.ql-editor {
    min-height: 300px !important;
  }
  .addGoodsBtn {
    margin-top: 20px;
  }
}
</style>

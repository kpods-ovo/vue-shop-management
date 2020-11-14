# vue-shop-management

## 遇到的问题
```
1.在home组件下进行子组件间的路由跳转时，遇到了Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location: "/roles".这样的问题，问题原因是当我点击了某个子组件跳转到了对应的子路由时，再次点击则会报上述错误。
一开始我的解决方案是在使用编程式导航进行跳转时加一个if判断语句，如下：
  if (this.path !== '/' + url) {
    this.$router.push('/' + url)
  }
  但是实验过后又会有新的问题，当在两个子路由间来回切换时，在第二轮就会失效，问题在于路由跳转前新的值被赋上而导致进不去if语句。
  最后在网上查阅资料，通过修改VueRouter原型对象的push方法，在报上述错误时添加catch语句进行捕获即可，毕竟上述问题并不会影响后续程序的执行。

2.在写用户列表中的编辑按钮的功能时，遇到的了使用this.$refs.changeForm.validate表单验证无论怎样都是返回false的情况，经过一番排查发现原因在于在这个需要验证的form表单中，有一个input我是按照需求给了disabled禁用了，虽然v-model传了个定值，但是在写rules验证规则时依然把它计算在内，导致既无法更改，表单验证又把它当成验证失败的情况，最后便把那个被禁用的form-item的prop属性从rules验证规则中移除，便解决了问题。

3.在写角色列表的分配权限功能时使用到了Vue.nextTick来解决第一次点击按钮时tree还未渲染而导致的报错。

4.关于element ui使用级联选择器时找不到this.$refs.cascader下的clearCheckedNodes方法的问题，其实这个方法是在this.$refs.cascader.$refs.panel下面。

5.关于使用resetFields重置表单无效的情况，需要添加上prop属性且需要和绑定的数据同名，至于原因是在看到源码中有if (this.prop)的一个判断语句，所以prop肯定是需要的。
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Col,
  Row,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Pagination,
  Switch,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Tooltip,
  Select,
  Option,
  Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Col)
Vue.use(Row)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
// 这种引入方式可以解决刷新弹框问题
Vue.component(MessageBox.name, MessageBox)
// 挂载element ui的message组件到原型链上
Vue.prototype.$message = Message
// 在Vue的原型对象上挂载confirm
Vue.prototype.$confirm = MessageBox.confirm

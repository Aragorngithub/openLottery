import i18n from './lang'
import router from './router'
import directive from './directive'
import { createPinia } from 'pinia'
import {
  ElIcon,
  ElEmpty,
  ElMessage,
  ElPopover,
  ElSkeleton,
  ElSkeletonItem
} from 'element-plus'
import { createApp, reactive } from 'vue'
import 'element-plus/dist/index.css'
import './style.less'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)
let state = reactive({
  isMobile: undefined,
  deviceEvent: undefined
}) // 全局共用状态对象
let originalHash // 项目初始化时的哈希值
const getHashReg = new RegExp(/app\.([^.]*?)\.js/) // 枚举服务器js文件的哈希值（todo：上线后要调整）

/** @description: 定义设备类型，设备事件*/
function definePublicState() {
  state.isMobile = /Mobile/.test(navigator.userAgent)
  state.deviceEvent = /Mobile/.test(navigator.userAgent)
    ? 'touchstart'
    : 'click'
}
definePublicState()
app.config.globalProperties.definePublicState = definePublicState
app.config.globalProperties.publicState = state // 挂载到全局变量。组件内可访问 publicState.isMobile 来判断当前设备是移动端 || 桌面端;
app.config.globalProperties.$message = ElMessage
app.directive(directive.name, directive.effect)
app
  .use(router)
  .use(i18n)
  .use(pinia)
  .use(ElIcon)
  .use(ElEmpty)
  .use(ElPopover)
  .use(ElSkeleton)
  .use(ElSkeletonItem)
  .mount('#app')

// 定时检测服务器更新，如有更新则提示用户刷新浏览器
setInterval(async () => {
  let html = await fetch('/').then((res) => res.text())
  let newHash = html.match(getHashReg)?.[1]
  if (newHash && originalHash && newHash !== originalHash) {
    alert(i18n.global.t('reloadNotice'))
    location.reload()
    originalHash = newHash
  }
  originalHash ||= newHash
}, 5000)

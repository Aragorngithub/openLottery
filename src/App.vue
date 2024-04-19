<script setup>
import PageHeader from './components/PageHeader.vue'
import PageFooter from './components/PageFooter.vue'
import PageViews from './views/index.vue'

;(function flexible(window, document) {
  var docEl = document.documentElement
  // 设置 documentElement 的 font-size。为屏幕宽度的十分之一。
  function setRemUnit() {
    let clientW = docEl.clientWidth > 504 ? 504 : docEl.clientWidth
    var rem = clientW / 36
    docEl.style.fontSize = rem < 12 ? '12px' : rem + 'px'
  }
  setRemUnit()
  // 窗口大小改变，就重新调用 setRemUnit 方法
  window.addEventListener('resize', setRemUnit)
})(window, document)
</script>

<template>
  <PageHeader />
  <PageViews />
  <PageFooter />
</template>

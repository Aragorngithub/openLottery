<!--
  * @FilePath: \openLottery\src\views
  * @Description: 开奖网首页
-->
<script setup>
import {
  shallowRef,
  onMounted, onUnmounted,
  ref, getCurrentInstance,
  defineAsyncComponent, watch
} from 'vue';
import { emitter } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { getLotteries, getOpenResult } from '@/api'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import NavigationBar from '@/components/NavigationBar.vue'
import CountrySelector from '@/components/CountrySelector.vue'
import { useCommonDataStore, useLotNameListStore } from '@/store'

let LOTTERYDATA = {} // 备份的开奖结果
let initHeight = true
let isHighlightCountry
let previousPage = '' // 记录前一页
const route = useRoute()
const router = useRouter()
const carouselImg = ref()
const loterryData = ref({}) // 开奖结果
const component = shallowRef()
const carouselHeight = ref(undefined)
const activatingCountry = ref(undefined) // 当前选中的国家
const internalInstance = getCurrentInstance()
const { saveCommonData } = useCommonDataStore()
const { saveLotName, clearLotNameList } = useLotNameListStore()
const $t = internalInstance.appContext.config.globalProperties.$t
const globalProperties = internalInstance.appContext.config.globalProperties
const $message = internalInstance.appContext.config.globalProperties.$message
const componentList = new Map([
  ['popular-lottery', defineAsyncComponent(() => import('@/components/PopularLottery.vue'))],
  ['world-lottery', defineAsyncComponent(() => import('@/components/WorldLottery.vue'))],
  ['jackpots', defineAsyncComponent(() => import('@/components/JackpotsLottery.vue'))],
  ['lottery', defineAsyncComponent(() => import('@/components/HomeLottery.vue'))],
]);

/** @description: 请求彩票数据（国家，彩种等相关信息）*/
getLotteries().then((res) => {
  saveCommonData(res)
  clearLotNameList()
  let data = Object.fromEntries(
    Object.entries(res.lotteryList).filter(([key, value]) => value.length)
  )
  let countries = Object.keys(data)
  for (let i = 0; i < countries.length; i++) {
    let country = countries[i]
    if (data[country]) {
      data[country].forEach((record, index) => {
        getOpenResult({ lotCode: record.code }).then(({ result }) => {
          result && Object.assign(record, result)
          saveLotName(result.lotName)
          if (
            i === countries.length - 1 &&
            index === data[country].length - 1
          ) {
            loterryData.value = LOTTERYDATA = data
          }
        })
      })
    }
  }
})
/**
 * @description: 自适应屏幕设置轮播图的高度，定义设备触摸或点击事件（definePublicState 是全局方法
 * @param {*} target 轮播图元素
 * @param {*} type 事件触发类型
 */
const setCarouselHeight = ({ target, type }) => {
  if (initHeight || type == 'resize') {
    // 页面渲染时只执行一次，页面缩放时时执行
    carouselHeight.value = target.height || carouselImg.value[0].height
    globalProperties.definePublicState() // todo：后面上线可以删除
    initHeight = false
  }
}
/**
 * @description: 开奖结果按国家分组进行过滤
 * @param {*} englishName 国家的英文名
 */
const onSelectCountry = (englishName) => {
  englishName &&
    (loterryData.value = {
      [englishName]: LOTTERYDATA[englishName] ?? []
    })
  !englishName && (loterryData.value = LOTTERYDATA)
  activatingCountry.value = englishName
}
/**
 * @description: 查询彩种的开奖结果
 * @param {*} lotName 彩种名称
 */
const toSearch = (lotName) => {
  try {
    for (const country in LOTTERYDATA) {
      LOTTERYDATA[country].forEach((result) => {
        if (formatSearchVal(result.name) == formatSearchVal(lotName)) {
          router.push({
            params: { page: 'popular-lottery' },
            query: { lotCode: result.code }
          })
          throw new Error()
        }
      })
    }
    $message.warning($t('failSearch')) // 找不到对应彩种的开奖记录
  } catch (e) {}
  function formatSearchVal(text) {
    return text.toLowerCase().replaceAll(/\s/g, '') // 将搜索数据转换为小写并去除空格
  }
}

watch(
  () => route.params,
  /**
   * @description: 首页点击单个彩种的开奖记录或者世界彩票点击彩种名时寻找对应的国家激活高亮
   * @param {*} page 从菜单跳转的组件名
   */
  ({ page }) => {
    component.value = componentList.get(page)
    if (
      (page == 'popular-lottery' && !activatingCountry.value) ||
      previousPage == page
    ) {
      previousPage = page // 用来判断在当前页选择彩种时也自动选中国家
      try {
        for (let country in LOTTERYDATA) {
          LOTTERYDATA[country].forEach((result) => {
            if (result.lotCode == route.query.lotCode) {
              activatingCountry.value = country
              isHighlightCountry = true // 标记只高亮，不是选中状态
              throw new Error() // 已找到对应的国家，跳出此双层循环
            }
          })
        }
      } catch (e) {}
    } else if (isHighlightCountry) {
      // 离开流行彩票时取消高亮
      activatingCountry.value = isHighlightCountry = undefined
    }
  }
)

onMounted(() => {
  window.addEventListener('resize', setCarouselHeight)
  emitter.on('searchEvent', toSearch)
})

onUnmounted(() => {
  window.removeEventListener('resize', setCarouselHeight)
  emitter.off('searchEvent', toSearch)
})
</script>

<template>
  <main class="page-views">
    <!-- 轮播图 -->
    <el-carousel
      ref="carouselCpn"
      trigger="click"
      :interval="6000"
      :height="`${carouselHeight}px`"
    >
      <el-carouselItem v-for="num in 5" :key="num">
        <img
          ref="carouselImg"
          :src="`images/banner${num}.png`"
          @load="setCarouselHeight"
          alt="Carousel picture"
        />
      </el-carouselItem>
    </el-carousel>
    <!-- 菜单栏 -->
    <NavigationBar />
    <br />
    <!-- 主体部分 -->
    <section>
      <!-- 左侧国家选择器 -->
      <CountrySelector
        :isActive="activatingCountry"
        @onSelectCountry="onSelectCountry"
      />
      <!-- 右侧动态组件 -->
      <Transition name="el-zoom-in-top" mode="out-in">
        <KeepAlive max="4">
          <component
            :is="component"
            :dataSource="loterryData"
            :scrollPosition="carouselHeight"
          />
        </KeepAlive>
      </Transition>
    </section>
  </main>
</template>
<style lang="less" scoped>
.page-views {
  min-height: 98vh;
  padding-top: 60px;

  .el-carousel {
    img {
      width: 100%;
      height: auto;
      max-height: 580px;
    }

    :deep(.el-carousel__button) {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  }

  section {
    gap: 10px;
    padding: 10px;
    display: flex;
  }
}
</style>

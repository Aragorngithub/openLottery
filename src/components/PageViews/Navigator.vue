<!--
  * @FilePath: \openLottery\src\components\common\TopSub.vue
  * @Description: 首页导航栏
-->
<script setup>
import { watch, ref } from 'vue';
import { getPopularLotteries } from '@/http';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const popularLotList = ref([]); // 流行彩种选项
const isActiveTab = ref('lottery'); // 激活高亮的菜单项
const isRotating = ref(false); // 流行彩票的箭头是否旋转
const isActivePopularLot = ref(0); // 激活高亮的彩种选项
const navOptionsList = [
  'lottery',
  'popular-lottery',
  'world-lottery',
  'jackpots',
]; // 菜单项的列表

/**@description: 初始化流行彩票下拉列表*/
getPopularLotteries().then(
  ({ popularList }) => (popularLotList.value = popularList)
);
/**
 * @description:  导航栏切换
 * @param {*} page 组件名
 */
const changeTab = (page) => {
  router.push({ params: { page } });
};
/**
 * @description: 跳转至流行彩票页面
 * @param {*} lotCode 彩种编号
 */
const changeLotteryType = (lotCode) => {
  isActivePopularLot.value = lotCode;
  router.push({
    params: { page: 'popular-lottery' },
    query: { lotCode },
  });
};
/**
 * @description: 高亮导航栏的点击项
 * @param {*} page 菜单项的值
 */
watch(
  () => route.params,
  ({ page }) => {
    isActiveTab.value = page;
  }
);
</script>

<template>
  <nav>
    <div
      v-for="option in navOptionsList"
      :key="option"
      :class="['nav-item', isActiveTab == option ? 'nav-item--active' : '']"
    >
      <!-- 流行彩票 -->
      <el-popover
        v-if="option == 'popular-lottery'"
        :show-arrow="false"
        width="160"
        trigger="hover"
        @show="isRotating = true"
        @hide="isRotating = false"
      >
        <ul class="dropdown-selector">
          <li
            v-for="lottery in popularLotList"
            :key="lottery.code"
            :class="{ active: isActivePopularLot === lottery.code }"
            v-on:[publicState.deviceEvent]="changeLotteryType(lottery.code)"
          >
            {{ lottery.code == 'YNLHC' ? $t(lottery.code) : lottery.name }}
          </li>
        </ul>
        <template #reference>
          <span class="nav-item--content">
            <img
              :src="`src/assets/images/${option}.png`"
              :class="{ 'active-icon': isActiveTab == option }"
              alt="Navigation icon"
            />
            <b :class="{ active: option == isActiveTab }">{{ $t(option) }}</b>
            <el-icon
              :class="[
                'el-icon',
                'el-icon-arrow-down',
                isRotating ? 'rotation' : '',
              ]"
            >
              <ArrowDown />
            </el-icon>
          </span>
        </template>
      </el-popover>
      <span
        v-else
        class="nav-item--content"
        v-on:[publicState.deviceEvent]="changeTab(option)"
      >
        <img
          :src="`src/assets/images/${option}.png`"
          :class="{ 'active-icon': isActiveTab == option }"
          alt="Navigation icon"
        />
        <b :class="{ active: option == isActiveTab }">
          {{ $t(option) }}
        </b>
      </span>
    </div>
  </nav>
</template>

<style lang="less" scoped>
nav {
  height: 62px;
  max-width: 1200px;
  display: flex;
  margin: 0 auto;
  user-select: none;
  justify-content: space-evenly;

  .nav-item {
    position: relative;

    .nav-item--content {
      height: 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 30px;
        margin-right: 5px;
        border-radius: 50%;
      }
      img:not(.active-icon) {
        background: #939393;
      }

      b.active {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .el-icon {
        margin: 0 5px;
        transition: transform 0.3s;
        transform: rotate(0);

        &.rotation {
          transform: rotate(-180deg);
        }
      }
    }
  }
  .nav-item--active::after,
  .nav-item:hover::after {
    content: '';
    bottom: 0;
    height: 2px;
    width: 100%;
    position: absolute;
    border-radius: 16px;
    animation: increase_width 0.3s ease;
  }

  @keyframes increase_width {
    0% {
      width: 0;
    }

    100% {
      width: 100%;
    }
  }
}
.dropdown-selector li {
  height: 38px;
  line-height: 38px;
  padding-left: 16px;
}
</style>

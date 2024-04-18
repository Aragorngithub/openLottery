<!--
 * @FilePath: \openLottery\src\components\PageViews\WorldLottery.vue
 * @Description: 世界彩票卡片
-->
<script setup>
import { scrollToTop } from '@/utils';
import { useRouter } from 'vue-router';
import { getWorldLotteries } from '@/http';
import { ref, computed, getCurrentInstance } from 'vue';

const router = useRouter();
const internalInstance = getCurrentInstance();
const $t = internalInstance.appContext.config.globalProperties.$t;
const $message = internalInstance.appContext.config.globalProperties.$message;
const lotteryList = ref([]); // 各个区域的彩票列表
const countriesGroup = ref([]); // 各个州的国家分组
/** @description: 初始化数据 */
getWorldLotteries().then((res) => {
  if (res) {
    lotteryList.value = res.lotteryList;
    countriesGroup.value = res.worldArea;
  };
});

/**
 * @description: 定义国家分组的系列
 * @return {Array} 国家列表
 */    
const defineCountriesList = computed(() => {
  let countryList = new Array();
  countriesGroup.value.forEach(obj => {
    obj.countryList.forEach(countries => {
      countryList.push(countries.englishName);
    });
  });
  return countryList;
});
/**
 * @description: 定义元素的引入名称（去除下划线）
 * @param {String} name 区域名称
 * @return {String} 已去除下划线的区域名称
 */    
const formatClassName = (name) => {
  return name.replaceAll(' ', '_');
};
/**
 * @description: 视图平滑地滚动到彩种dlt
 * @param {*} className 元素的引入名
 */    
const scrollIntoLottery = (className) => {
  let el = document.querySelector(`.${formatClassName(className)}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center'});
    setTimeout(() => el.classList.add('is-shaking'), 500);
    setTimeout(() => el.classList.remove('is-shaking'), 3000);
  } else {
    // todo: 待翻译
    $message.warning('该国家暂无彩种！');
  };
};
/**
 * @description: 跳转单个开奖记录
 * @param {*} lotCode 彩种编号
 */
const goLotteryHistory = (lotCode) => {
  router.push({
    params: { page: 'popular-lottery' },
    query: { lotCode },
  });
  scrollToTop(); //todo: 传入轮播图高度
}
</script>

<template>
  <div class="rightsite-container world-lottery">
    <el-skeleton :rows="8" :class="{ 'is-hidden': lotteryList.length }" class="skeleton" animated />
    <div class="card">
      <p class="lot-name card-title">{{ $t('multipleContinents') }}</p>
      <br>
      <div class="card-content">
        <!-- 多个国家 -->
        <div class="card-content__percontent">
          <u>{{ $t('Mutiplenational') }}</u>
          <ul>
            <li v-for="country in defineCountriesList" :key="country" v-on:[publicState.deviceEvent]="scrollIntoLottery(country)">{{ $t(country) }}</li>
          </ul>
        </div>
        <!-- 区域下的国家 -->
        <div v-for="group in countriesGroup" :key="group.englishName" class="card-content__percontent">
          <b>{{ $t(group.englishName) }}</b>
          <ul>
            <li v-for="country in group.countryList" :key="country.englishName" v-on:[publicState.deviceEvent]="scrollIntoLottery(country.englishName)">{{ $t(country.englishName) }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-for="area, index in lotteryList" :key="index" class="card">
      <p class="lot-name card-title">{{ $t(area.englishName) }}</p>
      <br>
      <template v-for="country in area.countryList" :key="country.englishName">
        <h3 :class="formatClassName(country.englishName)">{{ $t(country.englishName) }}</h3>
        <div class="card-content">
          <div v-for="lottery in country.lotteryList" :key="lottery.code"
            class="card-content__percontent card-content-image_name"
            v-on:[publicState.deviceEvent]="goLotteryHistory(lottery.code)">
            <img class="lot-image" :src="`src/assets/images/${lottery.code}.png`" :alt="lottery.code" />
            <span class="text-bigsize">
              {{ lottery.code == "YNLHC" ? $t("YNLHC") : lottery.name }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less">
.world-lottery .el-skeleton__item {
  width: 100%;
  height: 140px;
  border-radius: 16px;
}

.card {
  &-title {
    font-size: 20px;
  }

  &-content {
    display: flex;
    flex-wrap: wrap;
    row-gap: 12px;

    &__percontent {
      width: 25%;

      u {
        color: #e7830a;
      }

      b {
        font-size: 16px;
      }

      ul {
        margin-top: 10px;
        padding-left: 18px;

        li {
          margin-bottom: 2px;
          list-style-type: disc;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
      }
    }

    &-image_name {
      cursor: pointer;
      margin-top: 10px;

      img {
        width: 60px;
        margin-right: 12px;
      }

      display: flex;
      align-items: center;
    }
  }
  .is-shaking {
    animation: horizontal-shaking 800ms forwards;
  }
  @keyframes horizontal-shaking {
    0% {
      transform: translateX(0);
      color: hsl(27, 89%, 48%);
    }
    25% {
      transform: translateX(-6px);
    }
    50% {
      transform: translateX(6px);
    }
    75% {
      color: hsl(27, 89%, 48%);
      transform: translateX(-6px);
    }
    100% {
      color: hsl(27, 89%, 48%);
      transform: translateX(0);
    }
  }
}
</style>
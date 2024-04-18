<!--
  * @FilePath: \openLottery\src\views\components\Lottery.vue
  * @Description: 开奖结果卡片-->
<script setup>
import { calculateTime, scrollToTop } from '@/utils';
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

let timer;
const router = useRouter();
const updateCountdown = ref(false); // 唯一键用来强制更新元素，更新倒计时
const isHiddenSkeleton = ref(false); // 是否隐藏骨架屏
const props = defineProps({
  dataSource: {
    type: Object,
    require: true,
  }, // 数据源
  scrollPosition: {
    type: Number,
    default: 0,
  },
});
onMounted(() => {
  // 定时强制更新元素，更新倒计时
  timer = setInterval(() => {
    updateCountdown.value = !updateCountdown.value;
  }, 1000);
});
/**
 * @description: 跳转至开奖历史
 * @param {*} lotCode 彩种编码
 */
const goLotteryHistory = ({ lotCode }) => {
  scrollToTop(props.scrollPosition + 1, 'instant');
  router.push({
    params: { page: 'popular-lottery' },
    query: { lotCode },
  });
};
watchEffect(() => {
  /** @description: 监听如果第一个国家的开奖结果完成请求则隐蔽骨架屏，显示开奖结果 */
  const firstCountry = Object.keys(props.dataSource)[0];
  isHiddenSkeleton.value ||= props.dataSource[firstCountry]?.[0].preDrawCode;
});
onUnmounted(() => {
  clearInterval(timer); // 清除倒计时
  timer = null;
});
</script>

<template>
  <div class="rightsite-container">
    <!-- 初始会显示占位的骨架屏直到接口返回开奖结果 -->
    <el-skeleton
      :rows="5"
      :class="{ 'is-hidden': isHiddenSkeleton }"
      class="lot-result__skeleton skeleton"
      animated
    />
    <div
      v-for="(data, country) in props.dataSource"
      v-show="isHiddenSkeleton"
      :key="country"
      class="rightsite-cardbox"
    >
      <p class="rightsite-cardbox--title">
        <img v-lazyload="`src/assets/images/Flag_${country}.png`" alt="Flag" />
        {{ $t(country) }}
      </p>
      <div class="rightsite-cardbox--main">
        <div class="card" v-for="(obj, idx) in data" :key="idx">
          <div class="card-toppart">
            <div class="card-toppart--left">
              <img
                class="lot-image"
                :src="`src/assets/images/${obj.code}.png`"
                alt="Lottery's logo"
              />
              <span>
                <p class="lot-name text-bigsize">
                  {{ obj.code == 'YNLHC' ? $t(obj.code) : obj.name }}
                </p>
                <p class="draw-time">{{ obj.preDrawTime }}</p>
              </span>
            </div>
            <div class="card-toppart--right">
              <p class="text-bigsize" :key="updateCountdown">
                {{ calculateTime(obj.drawTime) }}
              </p>
              <p>{{ $t('nextDraw') }}</p>
            </div>
          </div>
          <br />
          <p class="card-middle--text">{{ $t('todayLotteryResults') }}</p>
          <div class="card-middle--results">
            <!-- 开奖结果 -->
            <p
              class="number-ball"
              v-for="(num, index) in obj.preDrawCode?.split(',')"
              :key="index"
            >
              {{ num }}
              <span class="animal-name" v-if="obj.shengXiao">{{
                $t(obj.shengXiao?.replaceAll(',', '')[index])
              }}</span>
            </p>
            <!-- 有奖金倍数的彩种则显示 -->
            <b class="power-play" v-if="obj.multiplier">{{
              $t('powerPlay') + obj.multiplier
            }}</b>
          </div>
          <p class="card-bottompart">
            <button v-on:[publicState.deviceEvent]="goLotteryHistory(obj)">
              {{ $t('lotteryHistory') }}
            </button>
          </p>
        </div>
        <el-empty v-if="!data.length" />
      </div>
      <br />
      <br />
    </div>
  </div>
</template>

<style lang="less">
//-----骨架屏样式
.lot-result__skeleton {
  .is-first {
    display: block;
  }
  .el-skeleton__item {
    margin-top: 10px;
    &:nth-child(even) {
      margin-right: 1%;
    }
    &:not(.is-first) {
      border-radius: 16px;
    }
  }
}
//----- 各个开奖结果卡片的样式
.rightsite-cardbox {
  &--title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 30px;
      margin-right: 10px;
    }
  }

  &--main {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .card {
      width: calc(50% - 10px);
      max-width: calc(50% - 10px);
      flex: 1 1 auto;

      &-toppart {
        &--left {
          display: inherit;
          align-items: inherit;
        }

        &--right {
          text-align: right;
          white-space: nowrap;
        }
      }

      &-middle--text {
        margin-bottom: 6px;
      }

      &-bottompart {
        text-align: right;
        padding-top: 26px;

        button {
          padding: 10px 25px;
          border-radius: 30px;
          background-color: transparent;
        }
      }
    }
  }
}
</style>

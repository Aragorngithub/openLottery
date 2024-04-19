<!--
  * @FilePath: \openLottery\src\views\components\PopularLottery.vue
  * @Description: 流行彩票卡片-->
<script setup>
import { ref, onMounted, onUnmounted, watchEffect, computed } from 'vue'
import { getOpenResult, getHistoryOpenResult } from '@/api'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { calculateTime } from '@/utils'

let timer
const route = useRoute()
const router = useRouter()
const dataSource = ref({})
const nextDrawInfo = ref({})
const updateCountdown = ref(false)
const latestResult = computed(() => dataSource.value?.[0] ?? {}) // 计算最新开奖结果

onMounted(() => {
  timer = setInterval(() => {
    updateCountdown.value = !updateCountdown.value
  }, 1000)
})

/**
 * @description: 请求开奖信息，下期开奖信息
 * @param {*} lotCode 彩种编号
 */
const initData = (lotCode) => {
  getHistoryOpenResult({ lotCode }).then(({ result }) => {
    result && (dataSource.value = Object.freeze(result))
  })
  getOpenResult({ lotCode }).then(({ result }) => {
    result && (nextDrawInfo.value = Object.freeze(result))
  })
}
/** @description: 跳回前页面 */
const toTurnBack = () => {
  router.go(-1)
}

watchEffect(() => {
  /** @description: 流行彩票切换彩种时进行相对应地展示开奖数据 */
  route.query.lotCode && initData(route.query.lotCode)
  !route.query.lotCode &&
    route.params.page === 'popular-lottery' &&
    router.push('/')
})

onUnmounted(() => {
  clearInterval(timer) // 清除倒计时
  timer = null
})
</script>

<template>
  <div class="rightsite-container history">
    <div class="turn-back">
      <el-button
        link
        :icon="ArrowLeftBold"
        v-on:[publicState.deviceEvent]="toTurnBack"
      >
        {{ $t('return') }}
      </el-button>
    </div>
    <el-skeleton
      :rows="7"
      :class="{ 'is-hidden': latestResult.lotCode }"
      class="lot-popular__skeleton skeleton"
      animated
    />
    <!-- 最新开奖结果 -->
    <p class="history__text">{{ $t('latestResult') }}</p>
    <div class="card">
      <div class="card-toppart">
        <img
          class="lot-image"
          :src="`images/${latestResult.lotCode}.png`"
          alt="Lottery's logo"
        />
        <span class="lotimg-behind_text">
          <p class="lot-name text-bigsize">
            {{
              latestResult.lotCode === 'YNLHC'
                ? $t('YNLHC')
                : latestResult.lotName
            }}
          </p>
          <br />
          <p class="draw-time">{{ latestResult.preDrawTime }}</p>
        </span>
      </div>
      <div class="card-middle--results">
        <p
          class="number-ball"
          v-for="(num, index) in latestResult.preDrawCode?.split(',')"
          :key="index"
        >
          {{ num }}
          <span class="animal-name" v-if="latestResult.shengXiao">
            {{ $t(latestResult.shengXiao?.replaceAll(',', '')[index]) }}
          </span>
        </p>
        <b class="power-play" v-if="latestResult.multiplier">
          {{ $t('powerPlay') + latestResult.multiplier }}</b
        >
      </div>
      <b class="history-bottom__text">
        <img src="../../assets/images/gold-icon.png" alt="money icon" />&nbsp;{{
          latestResult.currency
        }}&nbsp;{{ latestResult.jackpots || '_ _ _ _ _' }}
      </b>
    </div>
    <br />
    <!-- 下期开奖结果（card 的 背景色与其他的不同） -->
    <p class="history__text">{{ $t('nextDraw') }}</p>
    <div class="card nextdraw-card">
      <div class="card-toppart">
        <img
          class="lot-image"
          :src="`images/${nextDrawInfo.lotCode}.png`"
          alt="Lottery's logo"
        />
        <span class="lotimg-behind_text">
          <p class="lot-name text-bigsize nextDrawName">
            {{
              nextDrawInfo.lotCode === 'YNLHC'
                ? $t('YNLHC')
                : nextDrawInfo.lotName
            }}
          </p>
          <br />
          <b class="nextDrawName"
            >&nbsp;&nbsp;&nbsp;{{ nextDrawInfo.drawTime }}</b
          >
        </span>
      </div>
      <div class="card-middle--nextdraw nextdraw__text">
        <b>{{ $t('jackpots') }}</b>
        <h1>
          {{
            `${nextDrawInfo.currency} ${nextDrawInfo.jackpots || '_ _ _ _ _'}`
          }}
        </h1>
      </div>
      <div class="card-bottom--nextdraw">
        <b class="nextdrawbottom__text" :key="updateCountdown">
          {{ calculateTime(nextDrawInfo.drawTime) }}</b
        >
        <p class="nextdrawbottom__text">{{ $t('nextDraw') }}</p>
      </div>
    </div>
    <!-- 更早期的开奖结果（只显示如果有数据） -->
    <template v-if="1 in dataSource">
      <br />
      <p class="history__text">{{ $t('preLotteryResult') }}</p>
      <div
        class="card"
        v-for="(record, index) in dataSource.slice(1)"
        :key="index"
      >
        <div class="card-toppart">
          <img
            class="lot-image"
            :src="`images/${record.lotCode}.png`"
            alt="Lottery's logo"
          />
          <span class="lotimg-behind_text">
            <p class="lot-name text-bigsize">
              {{ record.lotCode === 'YNLHC' ? $t('YNLHC') : record.lotName }}
            </p>
            <br />
            <p class="draw-time">{{ record.preDrawTime }}</p>
          </span>
        </div>
        <div class="card-middle--results">
          <p
            class="number-ball"
            v-for="(num, index) in record.preDrawCode?.split(',')"
            :key="index"
          >
            {{ num }}
            <span class="animal-name" v-if="record.shengXiao">
              {{ $t(record.shengXiao?.replaceAll(',', '')[index]) }}</span
            >
          </p>
          <b class="power-play" v-if="record.multiplier">
            {{ $t('powerPlay') + record.multiplier }}</b
          >
        </div>
        <b class="history-bottom__text">
          <img src="@/assets/images/gold-icon.png" alt="money icon" />
          {{ record.currency }}&nbsp;{{ record.jackpots || '_ _ _ _ _' }}
        </b>
      </div>
    </template>
  </div>
</template>

<style lang="less">
.turn-back {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
}

.lot-popular__skeleton {
  .el-skeleton__item:nth-child(2n-1):not(:nth-child(2n + 7)) {
    display: block;
    width: 20%;
  }
  .el-skeleton__item:nth-child(even),
  .el-skeleton__item:last-child {
    height: 182px;
    border-radius: 16px;
  }
}

.history__text {
  margin-bottom: 10px;
}

&.history {
  .card {
    display: flex;
    align-items: center;

    &-middle--results {
      flex: 2;
    }

    &-middle--nextdraw {
      text-align: center;
      margin: auto;
    }

    .history-bottom__text {
      padding-left: 10px;
      color: #f8cd77;

      img {
        width: 24px;
        margin-bottom: -3px;
      }
    }

    &-bottom--nextdraw {
      text-align: center;
    }

    .nextdrawbottom__text {
      align-items: center;
      padding: 5px;
      font-size: 22px;
    }
  }
}
</style>

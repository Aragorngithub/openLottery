<!--
  * @FilePath: \openLottery\src\components\PageViews\Jackpots.vue
  * @Description: 各个头奖卡片
-->
<script setup>
import { ref, watchEffect } from 'vue';
import { Top, Bottom } from '@element-plus/icons-vue';

const isHiddenSkeleton = ref(false); // 是否隐藏骨架屏
const props = defineProps({
  dataSource: {
    type: Object,
    require: true,
  }, // 数据源
});

watchEffect(() => {
  isHiddenSkeleton.value = 0 in Object.keys(props.dataSource); // 已得到数据源，隐藏骨架屏
});
</script>

<template>
  <div class="rightsite-container jackpot">
    <el-skeleton
      :rows="6"
      :class="{ 'is-hidden': isHiddenSkeleton }"
      class="jackpot__skeleton skeleton"
      animated
    />
    <div
      v-for="(data, country) in props.dataSource"
      v-show="isHiddenSkeleton"
      :key="country"
      class="card-box"
    >
      <!-- 国旗与国家名称 -->
      <p class="card-box--title">
        <img
          v-lazyload="`images/Flag_${country}.png`"
          alt="Flag"
        />{{ $t(country) }}
      </p>
      <div class="card-box--main">
        <div class="card" v-for="(obj, idx) in data" :key="idx">
          <img
            class="lot-image"
            :src="`images/${obj.code}.png`"
            alt="Lottery's logo"
          />
          <div class="card-rightsite">
            <p class="lot-name text-bigsize">
              {{ obj.code == 'YNLHC' ? $t(obj.code) : obj.name }}
            </p>
            <p class="text-bigsize draw-time">{{ obj.preDrawTime }}</p>
            <div class="card-bottompart">
              <template v-if="obj.jackpots">
                <b class="card-bottompart--money">
                  <img src="@/assets/images/gold-icon.png" alt="gold icon" />
                  {{ obj.currency }}&nbsp;{{ obj.jackpots }}
                </b>
                <div class="card-bottompart_change" v-show="obj.jackpotsGap">
                  {{ $t('change') }}:
                  <el-icon :class="{ up: obj.jackpotsStatus == 'up' }">
                    <Top v-if="obj.jackpotsStatus == 'up'" />
                    <Bottom v-else class="bottom" />
                  </el-icon>
                  +{{ obj.currency }} {{ obj.jackpotsGap }}
                </div>
              </template>
              <p v-else>-----</p>
            </div>
          </div>
        </div>
        <el-empty v-if="!data.length" :description="$t('noData')"/>
      </div>
      <br /><br />
    </div>
  </div>
</template>

<style lang="less" scoped>
.jackpot {
  :deep(.el-skeleton__item) {
    width: 100%;
    margin-top: 10px;

    &:not(.is-first) {
      height: 114px;
      border-radius: 16px;
    }

    &.is-first,
    &:nth-child(5) {
      width: 12%;
      height: 30px;
      border-radius: 4px;
    }
  }

  .card-box {
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
      .card {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 126px;
        max-width: unset;

        .card-rightsite {
          width: 85%;
          padding-left: 22px;

          .card-bottompart {
            &--money {
              color: #f8cd77;

              img {
                width: 18px;
              }
            }

            &_change {
              margin-top: 4px;

              i {
                height: 17px;
                width: 17px;
                line-height: 18px;
                border-radius: 50%;
                font-weight: 900;
                text-align: center;
                color: #000;
                background-color: #ff453a;
              }

              .up {
                background-color: #0cb300;
              }
            }
          }
        }
      }
    }
  }
}
</style>

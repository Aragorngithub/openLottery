<!--
  * @FilePath: \openLottery\src\components\PageFooter.vue
  * @Description: 页脚
-->
<script setup>
import { scrollToTop } from '@/utils'
import { ref, onMounted, onUnmounted } from 'vue'
import { DArrowLeft } from '@element-plus/icons-vue'

const isShowing = ref(false)

onMounted(() => {
  window.addEventListener('scroll', watchScrollbarPosition)
})

/** @description: 位置离顶部大于400则显示重置滚动位置的按钮 */
const watchScrollbarPosition = () => {
  isShowing.value = document.documentElement.scrollTop > 400
}

onUnmounted(() => {
  window.removeEventListener('scroll', watchScrollbarPosition)
})
</script>

<template>
  <footer>
    <div class="container">
      <div class="toppart">
        <div class="toppart--lefttop">
          <p class="toppart--lefttop-first">
            <span>{{ $t('game') }}</span>
            <span>{{ $t('recommend') }}</span>
            <span>{{ $t('dianzi') }}</span>
            <span>{{ $t('zhenren') }}</span>
            <span>{{ $t('sport') }}</span>
            <span>{{ $t('popular') }}</span>
            <span>{{ $t('buyu') }}</span>
          </p>
          <p class="toppart--lefttop-seconrd">
            <span>{{ $t('help') }}</span>
            <span>{{ $t('onlineCust') }}</span>
            <span>{{ $t('helpCenter') }}</span>
            <span>{{ $t('suggesBonus') }}</span>
          </p>
        </div>
        <div class="toppart--rightbottom">
          <div>
            <img
              v-for="num in 7"
              :key="num"
              v-lazyload="`images/footer/brand_logo${num}.png`"
              alt="Brand icon"
            />
          </div>
          <br />
          <br />
          <p>{{ $t('aboutUs') }}</p>
          <br />
          <article>{{ $t('IygGroupIs') }}</article>
        </div>
      </div>
      <hr />
      <div class="bottompart">
        <img
          v-for="num in 10"
          :key="num"
          v-lazyload="`images/footer/brand_name${num}.png`"
          alt="Brand logo"
        />
      </div>
    </div>
    <span
      v-show="isShowing"
      id="scroll-to-top"
      v-on:[publicState.deviceEvent]="scrollToTop"
    >
      <b class="el-icon-d-arrow-left"></b>
      <el-icon>
        <DArrowLeft />
      </el-icon>
    </span>
  </footer>
</template>

<style lang="less" scoped>
footer {
  padding: 40px 0 70px;
  background-position-y: -3px;

  .container {
    width: 90%;
    max-width: 1010px;
    margin: auto;

    .toppart {
      display: flex;
      color: #939393;

      &--lefttop {
        margin-bottom: 20px;

        span {
          display: block;
          line-height: 36px;

          &:first-child {
            color: #fff;
            font-size: 16px;
          }
        }
      }

      &--rightbottom {
        div {
          display: flex;
          justify-content: space-between;
          img {
            width: 3.33486rem;
            height: 3.33486rem;
            cursor: pointer;
            transition: filter 300ms;
          }
          &:has(img:hover) img:not(:hover) {
            filter: grayscale(100%) brightness(50%);
          }
        }

        p {
          color: #fff;
        }
      }
    }

    hr {
      height: 1px;
      margin: 45px 0 34px;
      border: none;
      background-color: rgba(147, 147, 147, 0.2);
    }

    .bottompart {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      img {
        width: 5.50251rem;
      }
    }
  }

  #scroll-to-top {
    width: 3.66834rem;
    height: 3.66834rem;
    right: 2.50114rem;
    bottom: 2.50114rem;
    line-height: 5.5rem;
    border-radius: 0.83371rem;
    cursor: pointer;
    position: fixed;
    text-align: center;
    transition: line-height 0.2s;

    &:hover {
      line-height: 3.86834rem;
    }

    i {
      font-size: 2.66789rem;
      transform: rotate(90deg);
    }
  }
}
</style>

<!--
  * @FilePath: \openLottery\src\components\common\LangSelectGroup.vue
  * @Description: 国家选择器的组件
-->
<script setup>
import { useRoute } from 'vue-router';
import { useCommonDataStore } from '@/store';
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue';
import { ref, shallowRef, computed, watch, getCurrentInstance } from 'vue';

const beHidden = ref(false); // 国家选择是否被隐藏
const isAppending = ref(false); // 国家选项是否展开所有
const beNotAllowed = ref(false); // 国家选择是否被禁用
const component = shallowRef(ArrowDownBold);
const internalInstance = getCurrentInstance();
const $t = internalInstance.appContext.config.globalProperties.$t;
const route = useRoute();
const { commonData } = useCommonDataStore();
const emit = defineEmits(['onSelectCountry']);
const countryOptionsList = computed(
  () => commonData.country?.map((each) => each.englishName) ?? []
); // 定义国家选项
const props = defineProps({
  isActive: {
    type: String,
    required: true,
    default: '',
  }, // 被选中的国家
});
/** @description: 折叠/展开国家选项*/
const toAppend = () => {
  isAppending.value = !isAppending.value;
  component.value = isAppending.value ? ArrowUpBold : ArrowDownBold;
};
/**
 * @description: 点击某个国家将值传到上级组件
 * @param {*} country 国家值
 */
const onSelectCountry = (country) => {
  country == props.isActive && (country = undefined);
  emit('onSelectCountry', country);
};
/** @description: 侦听路由跳转到流行彩票时禁止选择国家分类，跳转到世界彩票时隐藏国家选择*/
watch(
  () => route.params,
  ({ page }) => {
    WEBTITLE.innerHTML = `IYG | ${$t(page)}`;
    beNotAllowed.value = page == 'popular-lottery';
    beHidden.value = page == 'world-lottery';
  }
);
</script>

<template>
  <ul
    :class="{
      'is-hidden': beHidden,
      'country-selector': true,
      'not-allow': beNotAllowed,
      'has-checked': props.isActive,
    }"
  >
    <li
      v-for="country in countryOptionsList.slice(0, isAppending ? 99 : 4)"
      :key="country"
      :class="{ active: props.isActive == country }"
      v-on:[publicState.deviceEvent]="onSelectCountry(country)"
    >
      <img :src="`src/assets/images/Flag_${country}.png`" alt="National flag" />
      <p>{{ $t(country) }}</p>
    </li>
    <li>
      <el-icon>
        <component :is="component" v-on:[publicState.deviceEvent]="toAppend" />
      </el-icon>
    </li>
  </ul>
</template>

<style lang="less" scoped>
ul {
  max-width: 120px;
  border-radius: 16px;
  overflow: hidden;
  height: fit-content;
  transition-property: width, min-width, margin-left;
  transition-duration: 0.4s;

  &:not(.not-allow) {
    user-select: none;
    cursor: pointer;
  }
  &.not-allow {
    cursor: not-allowed;
    li {
      pointer-events: none;
    }
  }
  &:not(.is-hidden) {
    width: 10%;
    min-width: 5.00229rem;
    padding: 0 4px;
  }
  &.is-hidden {
    width: 0;
    min-width: 0;
    margin-left: -10px;
  }

  li {
    padding: 16px 0;
    text-align: center;

    &:last-child {
      padding: 30px 0;

      i {
        font-size: 20px;
        padding: 3px;
        border-radius: 50%;
      }
    }

    img {
      width: 45%;
      height: 45%;
      max-width: 40px;
      max-height: 40px;
      transition: transform 0.2s;
    }

    p {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &.has-checked {
    li:not(.active) {
      filter: grayscale(0) brightness(50%);
    }
  }
  li:hover img {
    transform: scale(1.1);
  }
  li.active {
    font-weight: 700;
  }
}
</style>

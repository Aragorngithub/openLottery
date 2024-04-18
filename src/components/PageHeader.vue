<!--
 * @FilePath: \openLottery\src\components\PageHeader.vue
 * @Description: 页眉
-->
<script setup>
import { useLotNameListStore } from '@/store';
import { defineOptionsList, emitter } from '@/utils';
import { ref, computed, getCurrentInstance } from 'vue';
import { Search, Tools, Sunny, MoreFilled, Moon } from '@element-plus/icons-vue';

const header = ref();
const searchValue = ref('');
const theme = ref(undefined);
const isMinimize = ref(true);
const { lotNameList } = useLotNameListStore();
const internalInstance = getCurrentInstance();
const $t = internalInstance.appContext.config.globalProperties.$t;
const i18n = internalInstance.appContext.config.globalProperties.$i18n;
const $message = internalInstance.appContext.config.globalProperties.$message;
const langOptions = defineOptionsList([
  '中文',
  'cn',
  'English',
  'en',
  'Portuguese',
  'br',
  'Español',
  'es',
  'indonesio',
  'id',
  'हिंदी',
  'in',
  '日本語',
  'ja',
  'Bahasa Melayu',
  'my',
  'ภาษาไทย',
  'th',
  'Tiếng Việt',
  'vi',
]); // 定义语言选项列表

const locale = computed({
  get() {
    return i18n.locale;
  },
  set(lang) {
    i18n.locale = lang;
  },
});
/**
 * @description: 切换皮肤
 * @param {*} themeName 主题名称
 */ 
const toSwitchTheme = (themeName) => {
  document.body.className = `theme-${themeName}`;
  localStorage.setItem('currentTheme', themeName);
  theme.value = themeName || 'default';
  header.value?.click()
};
/*** @description: 查询彩种的历史开奖结果*/
const toSearch = () => {
  isMinimize.value = !isMinimize.value;
  searchValue.value && emitter.emit('searchEvent', searchValue.value);
};
/**
 * @description: 将语言存到本地从而刷新时仍然保持当前用户设置的语言
 * @param {*} lang 语言值
 * @param {*} isMobile 如是移动端则要手动关闭弹出框且切换语言
 */ 
const changeLang = (lang, isMobile) => {
  localStorage.setItem('currentLang', lang);
  isMobile && ((locale.value = lang), header.value.click());
  let el = document.querySelector('html');
  el.lang = lang;
  $message({
    message: $t('successText'),
    type: 'success',
  });
};
toSwitchTheme(localStorage.getItem('currentTheme') || 'default');
</script>

<template>
  <header ref="header">
    <div class="header--leftsite">
      <a href="/">
        <img src="@/assets/images/header/logo.png" alt="Logo" />
      </a>
    </div>
    <div class="header--rightsite">
      <el-input
        v-model="searchValue"
        size="large"
        ref="searchInput"
        list="option-list"
        :class="{ minimize: isMinimize }"
        :placeholder="$t('inputToSearch')"
        @keypress.enter="toSearch"
      >
        <template #suffix>
          <el-icon
            class="el-input__icon el-icon-search"
            v-on:[publicState.deviceEvent]="toSearch"
          >
            <Search />
          </el-icon>
        </template>
      </el-input>
      <datalist id="option-list">
        <option
          v-for="option in lotNameList"
          :key="option"
          :value="option"
        ></option>
      </datalist>
      <el-select
        v-if="!publicState.isMobile"
        size="large"
        v-model="locale"
        @change="changeLang"
      >
        <el-option
          v-for="option in langOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        >
        </el-option>
      </el-select>
      <el-popover trigger="click" placement="bottom-end">
        <template #reference>
          <el-icon class="el-popover__reference">
            <Tools />
          </el-icon>
        </template>
        <div class="topright-popover">
          <template v-if="!publicState.isMobile">
            <label
              ><i class="iconfont icon-qiehuanpifu"></i
              >{{ $t('switchTheme') }}</label
            >
            <br /><br />
            <ul class="theme-switcher">
              <li
                :class="{ active: theme == 'light' }"
                :title="$t('light')"
                v-on:[publicState.deviceEvent]="toSwitchTheme('light')"
              >
                <el-icon :size="16">
                  <Sunny />
                </el-icon>
              </li>
              <li
                :class="{ active: theme == 'default' }"
                :title="$t('default')"
                v-on:[publicState.deviceEvent]="toSwitchTheme('default')"
              >
                <el-icon :size="16">
                  <MoreFilled />
                </el-icon>
              </li>
              <li
                :class="{ active: theme == 'dark' }"
                :title="$t('dark')"
                v-on:[publicState.deviceEvent]="toSwitchTheme('dark')"
              >
                <el-icon :size="16">
                  <Moon />
                </el-icon>
              </li>
            </ul>
            <br /><br /><br />
          </template>
          <el-collapse v-else accordion>
            <el-collapse-item>
              <template #title>
                <i class="iconfont icon-qiehuanpifu"></i>{{ $t('switchTheme') }}
              </template>
              <br />
              <ul class="theme-switcher">
                <li
                  :class="{ active: theme == 'light' }"
                  :title="$t('light')"
                  v-on:[publicState.deviceEvent]="toSwitchTheme('light')"
                >
                  <el-icon :size="16">
                    <Sunny />
                  </el-icon>
                </li>
                <li
                  :class="{ active: theme == 'default' }"
                  :title="$t('default')"
                  v-on:[publicState.deviceEvent]="toSwitchTheme('default')"
                >
                  <el-icon :size="16">
                    <MoreFilled />
                  </el-icon>
                </li>
                <li
                  :class="{ active: theme == 'dark' }"
                  :title="$t('dark')"
                  v-on:[publicState.deviceEvent]="toSwitchTheme('dark')"
                >
                  <el-icon :size="16">
                    <Moon />
                  </el-icon>
                </li>
              </ul>
            </el-collapse-item>
            <el-collapse-item>
              <template #title>
                <i class="iconfont icon-diqiu"></i>{{ $t('switchLang') }}
              </template>
              <ul class="lang-switcher">
                <li
                  v-for="option in langOptions"
                  :key="option.value"
                  :class="{ 'is-active': locale == option.value }"
                  v-on:[publicState.deviceEvent]="
                    changeLang(option.value, true)
                  "
                >
                  {{ option.label }}
                </li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-popover>
    </div>
  </header>
</template>

<style lang="less" scoped>
header {
  position: fixed;
  height: 60px;
  width: 100%;
  padding: 0 25px;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header--leftsite {
    width: 35%;
    padding: 5px 0;
  }
  .header--rightsite {
    display: flex;
    justify-content: right;
    padding-left: 10px;
    gap: 20px;

    :deep(.el-input) {
      .el-input__wrapper {
        box-shadow: none;
        border-radius: 30px;
      }

      .el-icon-search {
        cursor: pointer;
        font-size: x-large;
        &:active {
          transform: scale(0.8);
        }
      }
      input {
        font-weight: bold;
      }
    }
    :deep(.el-select) {
      min-width: 140px;
      .el-select__wrapper {
        box-shadow: none;
        padding: 8px 8px 6px 15px;
        border-radius: 30px;
      }
      .el-select__suffix {
        padding: 5px;
        border-radius: 50%;
      }
      span {
        font-weight: bold;
      }
    }
    .el-popover__reference {
      width: 40px;
      height: 40px;
      font-size: 27px;
      border-radius: 50%;
      svg {
        width: inherit;
      }
    }
  }
}
.topright-popover {
  padding: 8px;
  .theme-switcher {
    display: flex;
    margin: 0 10px;
    border-radius: 30px;
    overflow: hidden;
    border: 1px solid;
    li {
      width: 33.33%;
      padding-top: 4px;
      text-align: center;
      white-space: nowrap;
      i {
        color: inherit;
      }
      &:nth-child(1) {
        padding-left: 15px;
        padding-right: 10px;
      }
      &:nth-child(2) {
        padding-left: 10px;
        padding-right: 10px;
        border-right: 1px solid;
        border-left: 1px solid;
      }
      &:nth-child(3) {
        padding-left: 10px;
        padding-right: 15px;
      }
    }
  }
  .lang-switcher {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    li {
      width: 50%;
      white-space: nowrap;
      &.is-active {
        font-weight: bold;
      }
    }
  }
}
.iconfont {
  font-size: 18px;
  margin-right: 5px;
}
</style>

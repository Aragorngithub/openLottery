import BR from './lang/BR';
import CN from './lang/CN';
import EN from './lang/EN';
import ES from './lang/ES';
import ID from './lang/ID';
import IN from './lang/IN';
import JA from './lang/JA';
import MY from './lang/MY';
import TH from './lang/TH';
import VI from './lang/VI';
import { createI18n } from 'vue-i18n'
import { defineOptionsList } from '@/utils'

const i18n = new createI18n({
  locale: localStorage.getItem('currentLang') || 'en', // 默认语言
  legacy: false, // 要支持 compositionAPI;
  globalInjection: true, // 全局注册$t方法
  messages: {
    br: BR, //巴西(葡萄牙文)
    cn: CN, //简体中文
    en: EN, //英文
    es: ES, //西班牙(西班牙文)
    id: ID, //印尼(印尼文)
    in: IN, //印度(印度文)
    ja: JA, //日本(日文)
    my: MY, //马来(马来文)
    th: TH, //泰国(泰文)
    vi: VI, //越南(越南文)
  },
});
export default i18n;
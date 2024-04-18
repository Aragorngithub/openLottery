/*
 *@FilePath: \openLottery\src\utils\index.js
 * @Description: 共用的方法封装
 */
import mitt from 'mitt';
export const emitter = mitt();
/**
 * @description: 计算从现在到目标时间差距 (下期开奖时间)
 * @param {*} time 目标时间
 * @return {*} 当前时间到目标时间的时分秒
 */
export function calculateTime (time) {
  if (!time) return "---";
  const target = new Date(time), current = new Date(),
  remainingTime = target.getTime() - current.getTime(),
  days = Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
  hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
  seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  return `${hours + 24 * days}:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

/**
 * @description: 批量导入组件
 * @param {*} context 上下文对象
 * @return {*} 返回包含指定路径下所有组件的对象
 */
export async function defineComponentsList (context) {
  console.log('🚀 ~ context:', context)
  const componentsList = {}, files = Object.keys(context);
  console.log('🚀 ~ files:', files)
  for (const key of files) {
    const name = key.replace(/^\.\/(.*)\.\w+$/, '$1');
    const module = await context[key]()
    componentsList[name] = module.default || module;
  };
  return componentsList;
};

/**
 * @description: 设置滚动位置离顶部的间距
 * @param {*} top 位置
 * @param {*} behavior 滚动行为
 */
export function scrollToTop (top = 0, behavior = 'smooth') {
  window.scrollTo({ top, behavior });
};

/**
 * @description: 定义下拉选项列表
 * @param {*} list 转入的选项数组
 * @return {*} 已定义好的数据结构
 */
export function defineOptionsList(list) {
  const length = list.length, options = [];
  for (let num = 0; num < length; num += 2) {
    options.push({ label: list[num], value: list[num + 1] });
  };
  return Object.freeze(options);
};
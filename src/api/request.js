import axios from 'axios';
import { ElNotification } from 'element-plus';
const axiosInstance = axios.create({
  timeout: 10000, //超时时间
  retry: 1, //全局重试请求次数
  retryDelay: 2000, //全局请求间隔
});
// axios 响应拦截
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => reconnection(error)
);

// 请求失败，重连
let reconnection = (error) => {
  //失败处理 error.config是一个对象，包含上方create中设置的三个参数
  let config = error.config;
  // 如果接口配置信息获取不到,直接返回报错内容
  if (!config || !config.retry) return Promise.reject(error);
  // __retryCount用来记录当前是第几次发送请求
  config._retryCount = config._retryCount || 0;
  // 如果当前发送的请求大于等于设置好的请求次数时，不再发送请求，返回最终的错误信息
  if (config._retryCount >= config.retry) {
    let { message } = error;
    ElNotification({
      type: 'error',
      title: 'Error',
      message
    });
    return
  };
  config._retryCount += 1; // 记录请求次数+1
  // 设置请求间隔 在发送下一次请求之前停留一段时间，时间为上方设置好的请求间隔时间
  let reload = new Promise((resolve) => {
    let timer = null;
    clearTimeout(timer); // 清除定时器
    timer = setTimeout(() => {
      resolve();
    }, config.retryDelay);
  });
  // 再次发送请求,拆分为 .then 执行重复接口操作是为了明确让 reload 中 Promise 的代码先执行
  return reload.then(() => axiosInstance(config));
};

export default function request ({ api, type, params}) {
  return new Promise((resolve, reject) => {
    axiosInstance[type](api, { params }).then(response => {
      response && response.status == 200 && resolve(response.data);
    }).catch(error => reject(error));
  });
};
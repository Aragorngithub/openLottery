/*
 * @FilePath: \openLottery\src\directive\index.js
 * @Description: 自定义指令
 */
export default {
  name: 'lazyload',
  effect: {
    /**
     * @description: 图片资源懒加载
     * @param {Element} el 被绑定的元素
     * @param {*} binding 被绑定的图片路径
     */
    mounted: function (el, binding) {
      const { value } = binding; // 当前img元素该渲染图片路径
      const observer = new IntersectionObserver((entries) => {
        // 创建 IntersectionObserver 观察者
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 观察到元素已进入视口，进行加载图片
            const { target } = entry;
            target.src = value;
            observer.unobserve(target); // 停止观察
          };
        });
      });
      observer.observe(el); // 开始观察元素
    },
  }
};
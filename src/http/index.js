import request from './request';

// 请求国家，彩种，世界地区列表
export function getLotteries (params) {
  return request({
    api: '/api/getLotteries.do',
    type: 'get',
    params
  });
};

// 请求上一期、这一期的开奖结果
export function getOpenResult (params) {
  return request({
    api: '/api/getLotteryPksInfo.do',
    type: 'get',
    params
  });
};

// 请求热门彩种
export function getPopularLotteries (params) {
  return request({
    api: '/api/getPopularLotteries.do',
    type: 'get',
    params
  });
};

// 请求历史开奖结果
export function getHistoryOpenResult (params) {
  return request({
    api: '/api/getPksHistoryList.do',
    type: 'get',
    params
  });
};

// 请求世界各州彩种
export function getWorldLotteries (params) {
  return request({
    api: '/api/getWorldLotteries.do',
    type: 'get',
    params
  });
};
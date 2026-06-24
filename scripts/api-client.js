#!/usr/bin/env node

/**
 * CityWalk API 客户端
 * 
 * 封装所有线上服务调用，供 AI Skill 使用
 * 
 * 用法：
 *   node api-client.js <command> [options]
 * 
 * 命令：
 *   location              - 获取定位链接
 *   weather <city>        - 查询天气
 *   poi <keywords> <city> - 搜索 POI
 *   route <origin> <destination> - 规划路线
 *   map <data>            - 生成地图
 *   questions <poiIds>    - 查询题库
 *   upload-questions <data> - 上传题目
 *   verify <questionId> <answer> - 校验答案
 *   checkin <poiName> <lat> <lng> - 创建打卡
 */

const axios = require('axios');

const BASE_URL = 'https://www.701study.com/app/citywalk-service';

// 工具函数：发起 HTTP 请求
async function request(method, path, data) {
  const url = `${BASE_URL}${path}`;
  const resp = await axios({
    method,
    url,
    data: method === 'POST' ? data : undefined,
    params: method === 'GET' ? data : undefined,
    headers: { 'Content-Type': 'application/json' }
  });
  return resp.data;
}

// 命令实现
const commands = {
  // 创建位置会话并返回定位链接
  location: async () => {
    const result = await request('POST', '/api/checkin/create-location');
    console.log(`SESSION_ID=${result.sessionId}`);
    console.log(`LINK=${BASE_URL}/checkin/location?sessionId=${result.sessionId}`);
  },

  // 查询位置结果
  'location-result': async (sessionId) => {
    const result = await request('GET', `/api/checkin/location/${sessionId}`);
    if (result.status === 'completed') {
      console.log(`✅ 定位成功！\n城市：${result.city}\n区域：${result.district}\n省份：${result.province}\n纬度：${result.lat}\n经度：${result.lng}\n精度：${result.accuracy || '未知'} 米`);
    } else if (result.status === 'waiting') {
      console.log('⏳ 等待中，用户还未完成定位');
    } else {
      console.log('❌ 会话不存在或已过期，请重新获取定位链接');
    }
  },

  // 查询天气
  weather: async (city) => {
    const result = await request('GET', `/api/amap/weather?city=${encodeURIComponent(city)}`);
    if (result.status === '1' && result.lives) {
      const live = result.lives[0];
      console.log(JSON.stringify({
        city: live.city,
        weather: live.weather,
        temperature: live.temperature + '°C',
        wind: live.windpower + '级 ' + live.winddirection + '风',
        humidity: live.humidity + '%'
      }, null, 2));
    } else {
      console.error('天气查询失败:', result);
    }
  },

  // 搜索 POI
  poi: async (keywords, city, types) => {
    const result = await request('POST', '/api/amap/poi/search', {
      keywords,
      city,
      types: types || ''
    });
    if (result.status === '1' && result.pois) {
      console.log(JSON.stringify(result.pois.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name,
        address: p.address,
        location: p.location,
        type: p.type
      })), null, 2));
    } else {
      console.error('POI 搜索失败:', result);
    }
  },

  // 规划路线
  route: async (origin, destination) => {
    const result = await request('POST', '/api/amap/route/walking', {
      origin,
      destination
    });
    if (result.status === '1' && result.route) {
      const route = result.route.paths[0];
      console.log(JSON.stringify({
        distance: (route.distance / 1000).toFixed(2) + ' km',
        duration: Math.round(route.duration / 60) + ' min',
        steps: route.steps.map(s => ({
          instruction: s.instruction,
          distance: s.distance + 'm'
        }))
      }, null, 2));
    } else {
      console.error('路径规划失败:', result);
    }
  },

  // 生成地图
  map: async (data) => {
    const result = await request('POST', '/api/amap/map/generate', JSON.parse(data));
    console.log(result.mapUrl);
  },

  // 查询题库
  questions: async (poiIds) => {
    const result = await request('GET', `/api/questions/batch?poiIds=${poiIds}`);
    console.log(JSON.stringify(result, null, 2));
  },

  // 上传题目
  'upload-questions': async (data) => {
    const result = await request('POST', '/api/questions/batch', JSON.parse(data));
    console.log(JSON.stringify(result, null, 2));
  },

  // 校验答案
  verify: async (questionId, answer, photoVerified) => {
    const result = await request('POST', '/api/questions/verify', {
      questionId,
      userAnswer: answer,
      photoVerified: photoVerified !== 'false'
    });
    console.log(JSON.stringify(result, null, 2));
  },

  // 创建打卡
  checkin: async (poiName, lat, lng) => {
    const result = await request('POST', '/api/checkin/sessions', {
      poiName,
      poiLat: parseFloat(lat),
      poiLng: parseFloat(lng)
    });
    if (result.sessionId) {
      const checkinUrl = `${BASE_URL}/checkin/${result.sessionId}`;
      console.log(JSON.stringify({
        sessionId: result.sessionId,
        checkinUrl: checkinUrl
      }, null, 2));
    } else {
      console.error('创建打卡失败:', result);
    }
  }
};

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || !commands[command]) {
    console.log(`用法: node api-client.js <command> [options]
    
命令:
  location                        - 获取定位链接
  weather <city>                  - 查询天气
  poi <keywords> <city> [types]   - 搜索 POI
  route <origin> <destination>    - 规划路线
  map <data>                      - 生成地图
  questions <poiIds>              - 查询题库
  upload-questions <data>         - 上传题目
  verify <questionId> <answer>    - 校验答案
  checkin <poiName> <lat> <lng>   - 创建打卡

示例:
  node api-client.js location
  node api-client.js weather 杭州
  node api-client.js poi 博物馆 杭州
  node api-client.js route 120.14873,30.25954 120.15000,30.26000
  node api-client.js checkin "纯真年代书吧" 30.25954 120.14873`);
    process.exit(1);
  }

  try {
    await commands[command](...args.slice(1));
  } catch (error) {
    console.error('请求失败:', error.message);
    process.exit(1);
  }
}

main();

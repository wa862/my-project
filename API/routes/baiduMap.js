// 百度地图路由模块
const express = require('express');
const router = express.Router();
const axios = require('axios');

console.log('百度地图路由模块初始化');

// 百度地理编码代理接口
router.get('/geocode', async (req, res) => {
  try {
    const address = req.query.address;
    const ak = process.env.BAIDU_MAP_AK || 'uK7FQ1fTrNtyacFOoxkmRzZlBuSMtAbj';
    
    console.log('收到地理编码请求，地址:', address);
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: '缺少 address 参数'
      });
    }
    
    // 直接返回模拟数据，避免依赖外部API
    console.log('返回模拟地理编码数据');
    return res.json({
      success: true,
      data: {
        status: 0,
        result: {
          location: {
            lng: 114.514862,
            lat: 38.042761
          },
          precise: 1,
          confidence: 80,
          comprehension: 100,
          level: "区域"
        }
      }
    });
    
  } catch (err) {
    console.error('地理编码处理错误:', err.message);
    return res.status(500).json({
      success: false,
      message: '处理地理编码请求时出错',
      error: err.message
    });
  }
});

// 百度地图反向地理编码接口
router.get('/reverse-geocode', async (req, res) => {
  try {
    const lng = req.query.lng;
    const lat = req.query.lat;
    
    console.log('收到反向地理编码请求，坐标:', lng, lat);
    
    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: '缺少经纬度参数'
      });
    }
    
    // 返回模拟数据
    return res.json({
      success: true,
      data: {
        status: 0,
        result: {
          addressComponent: {
            city: "石家庄市",
            district: "长安区",
            province: "河北省"
          },
          formatted_address: "河北省石家庄市长安区"
        }
      }
    });
    
  } catch (err) {
    console.error('反向地理编码处理错误:', err.message);
    return res.status(500).json({
      success: false,
      message: '处理反向地理编码请求时出错',
      error: err.message
    });
  }
});

module.exports = router;
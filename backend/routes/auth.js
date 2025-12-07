const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const OAuth = require('wechat-oauth');
const User = require('../models/User');
const config = require('../config');

// 微信OAuth客户端
const client = new OAuth(config.wechat.appId, config.wechat.secret);

// 微信登录授权URL
router.get('/wechat/login', (req, res) => {
  const redirectUrl = client.getAuthorizeURL(config.wechat.redirectUri, 'state', 'snsapi_userinfo');
  res.redirect(redirectUrl);
});

// 微信登录回调
router.get('/wechat/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const token = await client.getAccessToken(code);
    const openid = token.data.openid;
    const userInfo = await client.getUser(openid);

    // 查找或创建用户
    let user = await User.findOne({ openid });
    if (!user) {
      user = new User({
        openid,
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl
      });
      await user.save();
    }

    // 生成JWT
    const jwtToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    // 重定向到前端，携带token
    res.redirect(`http://localhost:3001?token=${jwtToken}&user=${JSON.stringify(user.toObject())}`);
  } catch (error) {
    res.status(500).json({ message: '微信登录失败', error: error.message });
  }
});

// 验证token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '无认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: '无效的令牌' });
  }
});

module.exports = router;
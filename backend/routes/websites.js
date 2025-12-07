const express = require('express');
const router = express.Router();
const Website = require('../models/Website');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { processWebsiteImages } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

// 确保图片存储目录存在
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirExists(path.join(__dirname, '../public/images/favicons'));
ensureDirExists(path.join(__dirname, '../public/images/thumbnails'));

// 创建网站
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, url, description, category, tags, isPublic } = req.body;
    
    // 检查网站是否已存在
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return res.status(400).json({ message: '该网站已存在' });
    }

    const website = new Website({
      title,
      url,
      description,
      category,
      tags,
      creator: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await website.save();
    
    // 处理网站图片
    try {
      const { favicon, thumbnail } = await processWebsiteImages(url, website._id);
      
      if (favicon) website.favicon = favicon;
      if (thumbnail) website.thumbnail = thumbnail;
      
      await website.save();
    } catch (imageError) {
      console.error('处理网站图片失败:', imageError.message);
      // 图片处理失败不影响网站创建
    }

    res.status(201).json({ message: '网站创建成功', website });
  } catch (error) {
    res.status(500).json({ message: '创建网站失败', error: error.message });
  }
});

// 获取网站列表
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, page = 1, limit = 20 } = req.query;
    const query = {
      isPublic: true
    };

    // 分类筛选
    if (category) {
      query.category = category;
    }

    // 标签筛选
    if (tag) {
      query.tags = tag;
    }

    // 搜索筛选
    if (search) {
      query.$text = { $search: search };
    }

    // 分页
    const skip = (page - 1) * limit;
    const websites = await Website.find(query)
      .populate('creator', 'nickname avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Website.countDocuments(query);

    res.json({
      websites,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: '获取网站列表失败', error: error.message });
  }
});

// 获取单个网站
router.get('/:id', async (req, res) => {
  try {
    const website = await Website.findById(req.params.id)
      .populate('creator', 'nickname avatar')
      .populate('likes', 'nickname');

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 增加浏览量
    website.views += 1;
    await website.save();

    res.json(website);
  } catch (error) {
    res.status(500).json({ message: '获取网站失败', error: error.message });
  }
});

// 更新网站
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查权限
    if (website.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权更新该网站' });
    }

    // 更新网站信息
    const { title, url, description, category, tags, isPublic } = req.body;
    website.title = title || website.title;
    
    // 如果URL变化，重新抓取图片
    if (url && url !== website.url) {
      website.url = url;
      
      try {
        const { favicon, thumbnail } = await processWebsiteImages(url, website._id);
        
        if (favicon) website.favicon = favicon;
        if (thumbnail) website.thumbnail = thumbnail;
      } catch (imageError) {
        console.error('处理网站图片失败:', imageError.message);
      }
    }
    
    website.description = description || website.description;
    website.category = category || website.category;
    website.tags = tags || website.tags;
    website.isPublic = isPublic !== undefined ? isPublic : website.isPublic;
    website.updatedAt = Date.now();

    await website.save();
    res.json({ message: '网站更新成功', website });
  } catch (error) {
    res.status(500).json({ message: '更新网站失败', error: error.message });
  }
});

// 删除网站
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查权限
    if (website.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权删除该网站' });
    }

    await website.remove();
    res.json({ message: '网站删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除网站失败', error: error.message });
  }
});

// 点赞网站
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查是否已点赞
    if (website.likes.includes(req.user._id)) {
      return res.status(400).json({ message: '已点赞该网站' });
    }

    // 添加点赞
    website.likes.push(req.user._id);
    await website.save();

    res.json({ message: '点赞成功', website });
  } catch (error) {
    res.status(500).json({ message: '点赞失败', error: error.message });
  }
});

// 取消点赞
router.post('/:id/unlike', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查是否已点赞
    if (!website.likes.includes(req.user._id)) {
      return res.status(400).json({ message: '未点赞该网站' });
    }

    // 取消点赞
    website.likes = website.likes.filter(id => id.toString() !== req.user._id.toString());
    await website.save();

    res.json({ message: '取消点赞成功', website });
  } catch (error) {
    res.status(500).json({ message: '取消点赞失败', error: error.message });
  }
});

// 收藏网站
router.post('/:id/collect', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查是否已收藏
    if (user.collectedWebsites.includes(website._id)) {
      return res.status(400).json({ message: '已收藏该网站' });
    }

    // 添加收藏
    user.collectedWebsites.push(website._id);
    await user.save();

    res.json({ message: '收藏成功', user });
  } catch (error) {
    res.status(500).json({ message: '收藏失败', error: error.message });
  }
});

// 取消收藏
router.post('/:id/uncollect', authMiddleware, async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!website) {
      return res.status(404).json({ message: '网站不存在' });
    }

    // 检查是否已收藏
    if (!user.collectedWebsites.includes(website._id)) {
      return res.status(400).json({ message: '未收藏该网站' });
    }

    // 取消收藏
    user.collectedWebsites = user.collectedWebsites.filter(id => id.toString() !== website._id.toString());
    await user.save();

    res.json({ message: '取消收藏成功', user });
  } catch (error) {
    res.status(500).json({ message: '取消收藏失败', error: error.message });
  }
});

// 获取用户收藏网站列表
router.get('/collections', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('collectedWebsites', '-__v');
    res.json({ message: '获取收藏网站列表成功', websites: user.collectedWebsites });
  } catch (error) {
    res.status(500).json({ message: '获取收藏网站列表失败', error: error.message });
  }
});

module.exports = router;
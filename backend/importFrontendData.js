const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const { processWebsiteImages } = require('./utils/imageProcessor');

// 加载环境变量
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cangshu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('数据库连接成功'))
.catch(err => console.error('数据库连接失败:', err));

// 导入模型
const User = require('./models/User');
const Website = require('./models/Website');

// 读取前端的JSON数据
const frontendDataPath = path.join(__dirname, '../frontend/src/data/navigation_data.json');
const navigationData = JSON.parse(fs.readFileSync(frontendDataPath, 'utf8'));

// 将navigationData转换为网站列表
const websites = [];
navigationData.forEach(category => {
  category.subcategories.forEach(subcategory => {
    subcategory.websites.forEach(website => {
      websites.push({
        ...website,
        category: category.name,
        subcategory: subcategory.name,
        title: website.name, // 确保有title字段
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: [],
        comments: []
      });
    });
  });
});

// 创建默认用户
async function createDefaultUser() {
  try {
    // 检查是否已存在默认用户
    let defaultUser = await User.findOne({ nickname: '默认用户' });
    
    if (!defaultUser) {
      // 创建新的默认用户
      defaultUser = new User({
        nickname: '默认用户',
        avatar: 'https://via.placeholder.com/100',
        email: 'default@example.com'
      });
      await defaultUser.save();
      console.log('已创建默认用户');
    } else {
      console.log('默认用户已存在');
    }
    
    return defaultUser;
  } catch (error) {
    console.error('创建默认用户失败:', error);
    throw error;
  }
}

// 导入网站数据到数据库
async function importWebsites() {
  try {
    // 创建或获取默认用户
    const defaultUser = await createDefaultUser();
    
    let importedCount = 0;
    let failedCount = 0;
    let duplicateCount = 0;
    
    // 先获取所有已存在的URL，用于去重检查
    const existingWebsites = await Website.find({}, 'url');
    const existingUrls = new Set(existingWebsites.map(w => w.url));
    
    for (const websiteData of websites) {
      try {
        // 检查URL是否已存在
        if (existingUrls.has(websiteData.url)) {
          duplicateCount++;
          console.log(`网站已存在，跳过导入: ${websiteData.name}`);
          continue;
        }
        
        // 创建网站记录，并设置默认用户为创建者
        const website = new Website({
          ...websiteData,
          creator: defaultUser._id
        });
        
        // 处理图片（下载并本地存储）
        await processWebsiteImages(website);
        
        // 保存到数据库
        await website.save();
        
        // 添加到已存在URL集合中
        existingUrls.add(websiteData.url);
        
        importedCount++;
        console.log(`成功导入网站: ${website.title}`);
        
        // 避免请求过快，每10个网站休息1秒
        if (importedCount % 10 === 0) {
          console.log('休息1秒...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        // 检查是否是重复键错误
        if (error.code === 11000) {
          duplicateCount++;
          console.log(`网站已存在(重复键错误)，跳过导入: ${websiteData.name}`);
        } else {
          failedCount++;
          console.error(`导入网站失败 ${websiteData.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n导入完成！成功导入 ${importedCount} 个网站，失败 ${failedCount} 个，跳过重复 ${duplicateCount} 个。`);
    mongoose.connection.close();
  } catch (error) {
    console.error('导入过程中发生错误:', error);
    mongoose.connection.close();
  }
}

// 执行导入
importWebsites();
const mongoose = require('mongoose');
const config = require('../config');
const Website = require('../models/Website');
const { processWebsiteImages } = require('./imageProcessor');

// 连接数据库
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('数据库连接成功');
  refreshAllWebsiteImages();
}).catch((error) => {
  console.error('数据库连接失败:', error);
  process.exit(1);
});

// 重新抓取所有网站的图片
const refreshAllWebsiteImages = async () => {
  try {
    // 获取所有网站
    const websites = await Website.find();
    console.log(`找到 ${websites.length} 个网站`);
    
    let successCount = 0;
    let failCount = 0;
    
    // 逐个处理网站图片
    for (let i = 0; i < websites.length; i++) {
      const website = websites[i];
      console.log(`\n处理网站 ${i + 1}/${websites.length}: ${website.title}`);
      
      try {
        const { favicon, thumbnail } = await processWebsiteImages(website.url, website._id);
        
        let updated = false;
        if (favicon && favicon !== website.favicon) {
          website.favicon = favicon;
          updated = true;
          console.log('  ✅ 刷新了favicon');
        }
        if (thumbnail && thumbnail !== website.thumbnail) {
          website.thumbnail = thumbnail;
          updated = true;
          console.log('  ✅ 刷新了缩略图');
        }
        
        if (updated) {
          await website.save();
          successCount++;
        } else {
          console.log('  ⏭️  无需更新');
        }
      } catch (error) {
        console.error(`  ❌ 处理失败: ${error.message}`);
        failCount++;
      }
      
      // 每处理5个网站休息1秒，避免请求过快
      if ((i + 1) % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n处理完成！`);
    console.log(`成功更新: ${successCount} 个网站`);
    console.log(`处理失败: ${failCount} 个网站`);
    
    // 关闭数据库连接
    mongoose.disconnect();
  } catch (error) {
    console.error('刷新网站图片失败:', error);
    mongoose.disconnect();
  }
};

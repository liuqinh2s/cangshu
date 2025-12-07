const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 确保图片存储目录存在
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 保存图片到本地
const saveImageToLocal = async (imageUrl, savePath) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    
    // 使用sharp处理图片，确保格式统一
    await sharp(imageBuffer)
      .resize({ fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(savePath);
    
    return true;
  } catch (error) {
    console.error(`保存图片失败: ${imageUrl}`, error.message);
    return false;
  }
};

// 从网站URL获取favicon
const fetchFavicon = async (websiteUrl, websiteId) => {
  try {
    const parsedUrl = new URL(websiteUrl);
    const domain = parsedUrl.hostname;
    
    // 尝试常见的favicon路径
    const faviconPaths = [
      '/favicon.ico',
      '/apple-touch-icon.png',
      '/apple-touch-icon-precomposed.png',
      '/favicon-32x32.png',
      '/favicon-16x16.png'
    ];
    
    for (const faviconPath of faviconPaths) {
      const faviconUrl = `${parsedUrl.protocol}//${domain}${faviconPath}`;
      const savePath = path.join(__dirname, '../public/images/favicons', `${websiteId}.png`);
      
      if (await saveImageToLocal(faviconUrl, savePath)) {
        return `/images/favicons/${websiteId}.png`;
      }
    }
    
    // 如果所有常见路径都失败，尝试从HTML中提取favicon
    const response = await axios.get(websiteUrl);
    const $ = cheerio.load(response.data);
    
    // 查找<link>标签中的favicon
    const faviconLink = $('link[rel="icon"]').attr('href') ||
                       $('link[rel="shortcut icon"]').attr('href') ||
                       $('link[rel="apple-touch-icon"]').attr('href');
    
    if (faviconLink) {
      const faviconUrl = new URL(faviconLink, websiteUrl).href;
      const savePath = path.join(__dirname, '../public/images/favicons', `${websiteId}.png`);
      
      if (await saveImageToLocal(faviconUrl, savePath)) {
        return `/images/favicons/${websiteId}.png`;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`获取favicon失败: ${websiteUrl}`, error.message);
    return null;
  }
};

// 从网站URL获取缩略图
const fetchThumbnail = async (websiteUrl, websiteId) => {
  try {
    const response = await axios.get(websiteUrl);
    const $ = cheerio.load(response.data);
    
    // 尝试获取og:image或twitter:image
    let thumbnailUrl = $('meta[property="og:image"]').attr('content') ||
                      $('meta[name="twitter:image"]').attr('content');
    
    // 如果没有找到，尝试获取最大的图片
    if (!thumbnailUrl) {
      const images = $('img').map((i, el) => {
        const src = $(el).attr('src');
        if (src) {
          return new URL(src, websiteUrl).href;
        }
      }).get();
      
      // 简单选择第一张图片作为缩略图
      if (images.length > 0) {
        thumbnailUrl = images[0];
      }
    }
    
    if (thumbnailUrl) {
      const savePath = path.join(__dirname, '../public/images/thumbnails', `${websiteId}.png`);
      
      if (await saveImageToLocal(thumbnailUrl, savePath)) {
        return `/images/thumbnails/${websiteId}.png`;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`获取缩略图失败: ${websiteUrl}`, error.message);
    return null;
  }
};

// 处理网站图片（favicon和缩略图）
const processWebsiteImages = async (websiteUrl, websiteId) => {
  // 确保存储目录存在
  ensureDirExists(path.join(__dirname, '../public/images/favicons'));
  ensureDirExists(path.join(__dirname, '../public/images/thumbnails'));
  
  // 并行获取favicon和缩略图
  const [favicon, thumbnail] = await Promise.all([
    fetchFavicon(websiteUrl, websiteId),
    fetchThumbnail(websiteUrl, websiteId)
  ]);
  
  return { favicon, thumbnail };
};

module.exports = {
  processWebsiteImages,
  fetchFavicon,
  fetchThumbnail,
  saveImageToLocal
};
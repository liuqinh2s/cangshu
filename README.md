# 仓鼠导航 - 网站收藏与分享平台

一个现代化的网站收藏与分享平台，支持用户通过微信登录，收藏和分享自己喜欢的网站，并与其他用户进行互动。

## 功能特性

### 后端功能
- 用户认证：微信授权登录
- 网站管理：添加、查看、更新、删除收藏的网站
- 社交功能：点赞、收藏、评论
- 搜索与筛选：按关键词搜索网站
- RESTful API：提供完整的API接口

### 前端功能
- 响应式设计：适配各种屏幕尺寸
- 网站列表展示：网格布局，支持分页和加载更多
- 网站详情：展示网站完整信息和评论
- 收藏夹管理：方便用户管理自己的收藏
- 微信登录：一键授权登录

### 微信小程序
- 移动端访问：随时随地访问收藏的网站
- 微信授权：利用微信账号快速登录
- 网站浏览：流畅的网站浏览体验
- 社交互动：点赞、收藏、评论功能

## 技术栈

### 后端
- Node.js + Express.js
- MongoDB + Mongoose
- JWT 身份验证
- 微信OAuth 2.0

### 前端
- React.js
- Vite 构建工具
- Ant Design UI组件库
- React Router 路由管理
- Axios 网络请求

### 微信小程序
- 原生小程序框架

## 项目结构

```
cangshu/
├── backend/               # 后端应用
│   ├── config/            # 配置文件
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── src/               # 源代码
│   └── package.json       # 后端依赖
├── frontend/              # 前端应用
│   ├── src/               # 源代码
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── services/      # API服务
│   │   ├── utils/         # 工具函数
│   │   ├── routes/        # 路由配置
│   │   └── context/       # 状态管理
│   └── package.json       # 前端依赖
├── wechat-mini-program/   # 微信小程序
│   ├── pages/             # 小程序页面
│   └── app.json           # 小程序配置
└── README.md              # 项目说明
```

## 快速开始

### 前提条件
- Node.js >= 16.0.0
- MongoDB >= 4.0.0
- 微信开发者工具（用于小程序开发）

### 安装与运行

#### 后端
1. 进入后端目录：`cd backend`
2. 安装依赖：`npm install`
3. 创建 `.env` 文件并配置环境变量
4. 启动服务器：`npm start`

#### 前端
1. 进入前端目录：`cd frontend`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 访问：`http://localhost:5173`

#### 微信小程序
1. 打开微信开发者工具
2. 导入 `wechat-mini-program` 目录
3. 配置小程序AppID
4. 编译并运行

## 环境变量配置

后端 `.env` 文件示例：

```
# 服务器配置
PORT=3000
HOST=localhost

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/cangshu

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 微信OAuth配置
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
WECHAT_REDIRECT_URI=http://localhost:3000/api/auth/wechat/callback
```

## API 文档

### 认证API
- `POST /api/auth/wechat/login` - 微信登录
- `GET /api/auth/wechat/callback` - 微信登录回调
- `GET /api/auth/verify` - 验证令牌

### 网站API
- `GET /api/websites` - 获取网站列表
- `POST /api/websites` - 添加网站
- `GET /api/websites/:id` - 获取网站详情
- `PUT /api/websites/:id` - 更新网站
- `DELETE /api/websites/:id` - 删除网站
- `POST /api/websites/:id/like` - 点赞网站
- `POST /api/websites/:id/unlike` - 取消点赞
- `POST /api/websites/:id/collect` - 收藏网站
- `POST /api/websites/:id/uncollect` - 取消收藏

### 评论API
- `GET /api/websites/:id/comments` - 获取网站评论
- `POST /api/websites/:id/comments` - 添加评论
- `DELETE /api/comments/:id` - 删除评论

## 开发指南

### 代码风格
- 使用ESLint和Prettier保持代码风格一致
- 遵循RESTful API设计规范
- 编写清晰的文档和注释

### 测试
- 单元测试：使用Jest
- API测试：使用Postman或Supertest

### 部署
- 后端：使用PM2或Docker
- 前端：部署到静态网站托管服务（如Vercel、Netlify）
- 数据库：使用MongoDB Atlas云数据库

## 微信小程序开发注意事项

1. 申请微信小程序AppID
2. 配置服务器域名白名单
3. 实现微信登录功能需要在微信公众平台配置
4. 使用微信开发者工具进行调试和发布

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系我们

如有问题或建议，请通过以下方式联系：
- 邮箱：example@example.com
- 微信：your-wechat

---

项目灵感来自：
- [花猫导航](https://huamaodh.com/)
- [飞猪客](https://feizhuke.com/)
- [ThinkDoc导航](https://nav.thinkdoc.vip/#term-135)
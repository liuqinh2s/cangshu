# Mobile App - 仓鼠导航

这是仓鼠导航的移动端应用，使用 React Native 开发，支持 iOS 和 Android 平台。

## 功能特性

- 微信登录
- 网站浏览与搜索
- 网站收藏与点赞
- 评论功能
- 个人中心

## 技术栈

- React Native
- Expo
- Axios
- React Navigation

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npx expo start
```

### 运行应用

- **iOS 模拟器**：在 Expo 开发服务器界面按`i`
- **Android 模拟器**：在 Expo 开发服务器界面按`a`
- **真机**：扫描 Expo 开发服务器界面的 QR 码

## 项目结构

```
app/
├── App.js             # 应用入口
├── src/
│   ├── components/    # 组件
│   ├── screens/       # 页面
│   ├── services/      # API服务
│   ├── utils/         # 工具函数
│   └── navigation/    # 导航配置
├── assets/            # 静态资源
└── package.json       # 项目依赖
```

## 开发指南

### 添加新页面

1. 在`src/screens`目录下创建新的页面组件
2. 在`src/navigation`目录下配置路由
3. 在需要的地方使用导航 API 进行页面跳转

### API 调用

使用`src/services/api.js`中封装的 API 服务进行网络请求，确保在请求中包含正确的认证信息。

### 状态管理

可以使用 React Context 或 Redux 进行状态管理，根据应用复杂度选择合适的方案。

## 构建与发布

### 构建 iOS 应用

```bash
npx expo build:ios
```

### 构建 Android 应用

```bash
npx expo build:android
```

### 发布到应用商店

- **App Store**：通过 App Store Connect 提交
- **Google Play**：通过 Google Play Console 提交

## 注意事项

1. 需要在 Expo 控制台配置应用信息
2. 实现微信登录需要集成微信 SDK
3. 确保 API 服务器地址正确配置
4. 进行充分的测试，确保应用在不同设备上正常运行

## 许可证

MIT License

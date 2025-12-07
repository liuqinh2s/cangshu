// 网站分类配置文件
// 用于生成左侧导航目录

export const websiteCategories = [
  {
    id: 'tools',
    name: '工具',
    icon: '🛠️',
    subcategories: [
      { id: 'design', name: '设计工具', icon: '🎨' },
      { id: 'development', name: '开发工具', icon: '💻' },
      { id: 'productivity', name: '生产力', icon: '⚡' },
      { id: 'online', name: '在线工具', icon: '🌐' }
    ]
  },
  {
    id: 'learning',
    name: '学习',
    icon: '📚',
    subcategories: [
      { id: 'programming', name: '编程学习', icon: '💡' },
      { id: 'design', name: '设计学习', icon: '🎓' },
      { id: 'language', name: '语言学习', icon: '🗣️' },
      { id: 'course', name: '在线课程', icon: '🎯' }
    ]
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: '🎮',
    subcategories: [
      { id: 'music', name: '音乐', icon: '🎵' },
      { id: 'video', name: '视频', icon: '🎬' },
      { id: 'game', name: '游戏', icon: '🎲' },
      { id: 'comic', name: '漫画', icon: '📖' }
    ]
  },
  {
    id: 'life',
    name: '生活',
    icon: '🏠',
    subcategories: [
      { id: 'travel', name: '旅行', icon: '✈️' },
      { id: 'food', name: '美食', icon: '🍽️' },
      { id: 'shopping', name: '购物', icon: '🛒' },
      { id: 'health', name: '健康', icon: '💪' }
    ]
  },
  {
    id: 'work',
    name: '工作',
    icon: '💼',
    subcategories: [
      { id: 'office', name: '办公软件', icon: '📊' },
      { id: 'project', name: '项目管理', icon: '📋' },
      { id: 'team', name: '团队协作', icon: '👥' },
      { id: 'marketing', name: '营销', icon: '📈' }
    ]
  },
  {
    id: 'other',
    name: '其他',
    icon: '🔖',
    subcategories: [
      { id: 'news', name: '新闻资讯', icon: '📰' },
      { id: 'blog', name: '博客', icon: '✍️' },
      { id: 'community', name: '社区', icon: '👥' },
      { id: 'other', name: '其他', icon: '📌' }
    ]
  }
];

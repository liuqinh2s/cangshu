import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Input, Button, Space, Typography, Spin, message, Menu, Card, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, StarOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { websiteService } from '../services/api';
import WebsiteCard from '../components/WebsiteCard';
import { useUser } from '../context/UserContext';
import navigationData from '../data/navigation_data.json';
import { useNavigate } from 'react-router-dom';


const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
// Select组件已移除，Option不再需要

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
`;

const StyledContent = styled(Content)`
  padding: 24px 50px;
  background: #f0f2f5;
  margin-left: 250px;
  transition: margin-left 0.3s;
  min-height: calc(100vh - 64px);
`;

const StyledSider = styled(Sider)`
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  z-index: 99;
  top: 0;
  left: 0;
  transition: width 0.3s;
`;

const Logo = styled.div`
  height: 64px;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CategoryTitle = styled(Text)`
  font-weight: bold;
  padding: 8px 16px;
  display: block;
  margin-top: 16px;
  margin-bottom: 8px;
  color: #8c8c8c;
  font-size: 14px;
`;

const SearchContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const WebsiteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  // 分页和分类状态（当前未使用）
  // const [page, setPage] = useState(1);
  // const [category, setCategory] = useState(null);

  // 主目录菜单配置
  const mainMenuItems = [
    { key: 'home', icon: <HomeOutlined />, label: '首页' },
    { key: 'collections', icon: <StarOutlined />, label: '我的收藏' }
  ];

  // 初始化加载网站列表 - 使用后端API
  useEffect(() => {
    setLoading(true);
    try {
      // 从后端API获取网站列表
      websiteService.getWebsites({ search: searchText })
        .then(response => {
          // 确保每个网站都有category和subcategory字段
          const processedWebsites = response.websites.map(website => ({
            ...website,
            name: website.title, // 保持与本地数据结构一致
            category: website.category || '未分类',
            subcategory: website.subcategory || '默认'
          }));
          setWebsites(processedWebsites);
        })
        .catch(error => {
          console.error('获取网站列表失败:', error);
          message.error('获取网站列表失败');
        });
    } catch (error) {
      message.error('获取网站列表失败');
      console.error('获取网站列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  // 处理搜索
  const handleSearch = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    // 搜索文本已经在状态中，useEffect会自动重新过滤数据
  };

  // 处理分类选择 - 滚动到对应位置
  const handleCategorySelect = (category, subcategory = null) => {
    setSelectedCategory(category || null);
    setSelectedSubcategory(subcategory || null);
    setSearchText('');
    
    // 滚动到对应位置，使用requestAnimationFrame优化性能
    const scrollToElement = () => {
      let element;
      if (category && subcategory) {
        const elementId = `category-${category.name}-${subcategory.name}`;
        element = document.getElementById(elementId);
      } else if (category) {
        const elementId = `category-${category.name}`;
        element = document.getElementById(elementId);
      }
      
      if (element) {
        // 保留平滑滚动动画，同时优化性能
        window.scrollTo({
          top: element.offsetTop - 80, // 减去头部高度，避免被导航栏遮挡
          behavior: 'smooth'
        });
      }
    };
    
    // 使用requestAnimationFrame确保滚动在浏览器下一个动画帧执行
    requestAnimationFrame(() => {
      // 添加一个小延迟，确保DOM更新完成
      setTimeout(scrollToElement, 50);
    });
  };

  // 处理网站更新（点赞等操作）
  const handleWebsiteUpdate = (updatedWebsite) => {
    setWebsites(websites.map(website => 
      website._id === updatedWebsite._id ? updatedWebsite : website
    ));
  };

  // 处理菜单点击
  const handleMenuClick = (e) => {
    if (e.key === 'home') {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSearchText('');
      // 重置后会自动触发useEffect重新加载数据
    } else if (e.key === 'collections') {
      // 导航到用户收藏页面
      navigate('/user');
    }
  };

  // 跳转到添加网站页面
  const handleAddWebsite = () => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    // 这里可以使用react-router-dom的navigate函数
    window.location.href = '/add-website';
  };

  return (
    <StyledLayout>
      <StyledSider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={250}
        collapsedWidth={80}
        style={{ 
          height: '100vh', 
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          // 添加滚动条样式（可选）
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1'
        }}
      >
        <Logo>
          {collapsed ? '仓鼠' : '仓鼠导航'}
        </Logo>
        
        {/* 主菜单 */}
        <Menu
          mode="inline"
          defaultSelectedKeys={['home']}
          items={mainMenuItems}
          onClick={handleMenuClick}
          style={{ marginBottom: 16 }}
        />
        
        {/* 分类菜单 */}
        {navigationData.map(category => (
          <div key={category.name} style={{ padding: '8px 0' }}>
            {!collapsed && (
              <CategoryTitle>
                {category.subcategories.length > 0 ? `${category.name}` : category.name}
              </CategoryTitle>
            )}
            <Menu
              mode="inline"
              selectedKeys={selectedSubcategory && selectedCategory?.name === category.name ? [selectedSubcategory.name] : []}
              style={{ border: 0 }}
              items={category.subcategories.map(subcat => ({
                key: `${category.name}-${subcat.name}`,
                icon: !collapsed && <LinkOutlined />,
                label: !collapsed ? subcat.name : '',
                onClick: () => handleCategorySelect(category, subcat)
              }))}
            />
          </div>
        ))}
      </StyledSider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.3s' }}>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space style={{ flex: 1, justifyContent: 'center' }}>
            <Title level={3} style={{ margin: 0, color: '#fff' }}>
              仓鼠导航
            </Title>
          </Space>
          
          <Space>
            {user ? (
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddWebsite}>
                  添加网站
                </Button>
                <Button style={{ backgroundColor: '#fff', color: '#1890ff' }}>
                  {user.nickname}
                </Button>
              </Space>
            ) : (
              <Button type="primary" onClick={() => window.location.href = '/login'}>
                登录
              </Button>
            )}
          </Space>
        </StyledHeader>
        
        <StyledContent style={{ marginLeft: 0, padding: '24px 48px' }}>
          {/* 搜索区域 */}
          <SearchContainer>
            <Search
              placeholder="搜索网站或描述..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ maxWidth: 600 }}
            />
            
            {/* 当前选中分类显示 */}
            {(selectedCategory || selectedSubcategory) && (
              <Space style={{ marginTop: 16 }}>
                <Tag color="blue" closable onClose={() => handleCategorySelect(null)}>
                  {selectedSubcategory ? `${selectedCategory.name} > ${selectedSubcategory.name}` : selectedCategory?.name}
                </Tag>
              </Space>
            )}
          </SearchContainer>
          
          {/* 网站列表 */}
          <Spin spinning={loading}>
            {/* 按分类和子分类渲染网站 */}
            {navigationData.map(category => (
              <div key={category.name} style={{ marginBottom: 32 }}>
                {/* 主分类区域 */}
                <div id={`category-${category.name}`} style={{ 
                  marginTop: 60, 
                  marginBottom: 16, 
                  padding: '12px 16px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #1890ff'
                }}>
                  <h2 style={{ fontSize: '24px', margin: 0, fontWeight: '600' }}>{category.name}</h2>
                </div>
                
                {/* 子分类区域 */}
                {category.subcategories.map(subcategory => {
                  // 过滤该子分类下的网站
                  const filteredWebsites = websites.filter(website => 
                    website.category === category.name
                  );
                  
                  // 如果该子分类下没有网站且没有搜索条件，不显示
                  if (filteredWebsites.length === 0 && !searchText) {
                    return null;
                  }
                  
                  return (
                    <div key={subcategory.name} style={{ marginBottom: 24 }}>
                      <div id={`category-${category.name}-${subcategory.name}`} style={{ 
                        marginBottom: 12, 
                        padding: '8px 12px', 
                        backgroundColor: '#fff', 
                        borderRadius: '6px',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
                        borderLeft: '3px solid #40a9ff'
                      }}>
                        <h3 style={{ fontSize: '18px', margin: 0, fontWeight: '500' }}>{subcategory.name}</h3>
                      </div>
                      
                      <WebsiteGrid>
                        {filteredWebsites.map((website, index) => (
                          <WebsiteCard key={`${category.name}-${subcategory.name}-${index}`} website={website} onUpdate={handleWebsiteUpdate} />
                        ))}
                      </WebsiteGrid>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {/* 空状态 */}
            {!loading && websites.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#8c8c8c' }}>
                <Text>暂无网站数据</Text>
              </div>
            )}
          </Spin>
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default HomePage;
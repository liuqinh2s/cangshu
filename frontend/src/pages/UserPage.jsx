import React, { useState, useEffect } from 'react';
import { Layout, Typography, List, Card, Empty, Button, message, Space } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { websiteService } from '../services/api';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import WebsiteCard from '../components/WebsiteCard';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #f0f2f5;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledContent = styled(Content)`
  padding: 40px 20px;
  background: transparent;
  min-height: calc(100vh - 64px);
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 30px 24px;
    margin: 0 16px;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 24px;
  border-radius: 12px;
  font-weight: 500;
  padding: 8px 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 40px;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #1890ff;
  font-size: 20px;
  font-weight: 600;
`;

const WebsiteList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const UserPage = () => {
  const { user } = useUser();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取用户收藏网站
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await websiteService.getCollections();
        setCollections(response.websites || []);
      } catch (error) {
        message.error('获取收藏网站失败');
        console.error('获取收藏网站失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // 处理返回
  const handleBack = () => {
    navigate('/');
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '22px', fontWeight: '600' }}>
          仓鼠导航
        </Title>
      </StyledHeader>
      <StyledContent>
        <PageContainer>
          <BackButton
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            返回首页
          </BackButton>

          <UserInfo>
            <UserAvatar>
              <UserOutlined />
            </UserAvatar>
            <UserDetails>
              <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
                {user?.nickname || '用户'}
              </Title>
              <Text type="secondary" style={{ fontSize: '16px', color: '#666' }}>
                已收藏 {collections.length} 个网站
              </Text>
            </UserDetails>
          </UserInfo>

          <SectionTitle level={3}>我的收藏</SectionTitle>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Text>加载中...</Text>
            </div>
          ) : collections.length > 0 ? (
            <WebsiteList>
              {collections.map(website => (
                <WebsiteCard
                  key={website._id}
                  website={website}
                />
              ))}
            </WebsiteList>
          ) : (
            <Empty
              description="您还没有收藏任何网站"
              style={{ padding: '60px 0' }}
            >
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => navigate('/')}
              >
                去发现网站
              </Button>
            </Empty>
          )}
        </PageContainer>
      </StyledContent>
    </StyledLayout>
  );
};

export default UserPage;

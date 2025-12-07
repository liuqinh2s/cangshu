import React from 'react';
import { Layout, Card, Button, Typography, Space, message } from 'antd';
import { WechatOutlined, LoginOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { authService } from '../services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%);
`;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledContent = styled(Content)`
  padding: 40px 20px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  text-align: center;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }

  @media (max-width: 480px) {
    padding: 30px 24px;
    margin: 0 16px;
  }
`;

const LoginIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  font-size: 40px;
  color: white;
`;

const LoginButton = styled(Button)`
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #07c160 0%, #05ad57 100%);
  border-color: #07c160;
  color: white;
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #09d669 0%, #07c160 100%);
    border-color: #09d669;
    box-shadow: 0 6px 20px rgba(7, 193, 96, 0.4);
    transform: translateY(-2px);
  }

  &:focus {
    background: linear-gradient(135deg, #07c160 0%, #05ad57 100%);
    border-color: #07c160;
  }

  .anticon {
    font-size: 18px;
    margin-right: 8px;
  }
`;

const LoginPage = () => {
  // 处理微信登录
  const handleWechatLogin = () => {
    try {
      authService.wechatLogin();
    } catch (error) {
      message.error('微信登录失败');
      console.error('微信登录失败:', error);
    }
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '22px', fontWeight: '600' }}>
          仓鼠导航
        </Title>
      </StyledHeader>
      <StyledContent>
        <StyledCard>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <LoginIcon>
              <LoginOutlined />
            </LoginIcon>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: 8, fontSize: '24px', fontWeight: '600' }}>登录</Title>
              <Text type="secondary" style={{ fontSize: '14px', color: '#666' }}>
                登录后即可收藏和分享网站
              </Text>
            </div>
            <LoginButton
              type="primary"
              size="large"
              icon={<WechatOutlined />}
              onClick={handleWechatLogin}
              block
            >
              微信登录
            </LoginButton>
            <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.5', color: '#999' }}>
              登录即表示您同意我们的用户协议和隐私政策
            </Text>
          </Space>
        </StyledCard>
      </StyledContent>
    </StyledLayout>
  );
};

export default LoginPage;
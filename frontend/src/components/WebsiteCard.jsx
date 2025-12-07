import React from 'react';
import { Card, Typography, Tag, Button, Space, Tooltip, Avatar, message } from 'antd';
import { LikeOutlined, StarOutlined, EyeOutlined, UserOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { websiteService } from '../services/api';

const { Title, Text } = Typography;
const { Meta } = Card;

const StyledCard = styled(Card)`
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #f5f5f5;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .ant-card-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
  }

  .ant-card-cover {
    height: 100px;
    overflow: hidden;
    padding: 8px;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
      border-radius: 4px;
    }

    &:hover img {
      transform: scale(1.02);
    }
  }

  .ant-card-meta-title {
    margin-bottom: 6px !important;
    font-size: 14px !important;
  }

  .ant-card-actions {
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    padding: 8px 12px;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
`;

const CardAvatar = styled(Avatar)`
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const CategoryTag = styled(Tag)`
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
`;

const WebsiteUrl = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #40a9ff;
    transform: translateX(4px);
  }
`;

const WebsiteFavicon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 4px;
  object-fit: cover;
`;

const CardButton = styled(Button)`
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 4px 12px;
  font-size: 13px;

  &:hover {
    transform: translateY(-1px);
  }

  &.ant-btn-primary {
    background-color: #1890ff;
    border-color: #1890ff;

    &:hover {
      background-color: #40a9ff;
      border-color: #40a9ff;
    }
  }

  &.ant-btn-default {
    color: #666;

    &:hover {
      color: #1890ff;
      background-color: #e6f7ff;
      border-color: #91d5ff;
    }
  }

  &.ant-btn:disabled {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: #bfbfbf;
    cursor: not-allowed;
  }
`;

const EmptyCover = styled.div`
  height: 100px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #1890ff;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  padding: 8px;
`;

const WebsiteCard = ({ website, onUpdate }) => {
  const { user } = useUser();
  const [liking, setLiking] = React.useState(false);
  const [collecting, setCollecting] = React.useState(false);
  const [faviconError, setFaviconError] = React.useState(false);

  // 生成随机渐变背景颜色
  const getRandomGradient = () => {
    const gradients = [
      '#f0f2f5 0%, #e6f7ff 100%',
      '#fff7e6 0%, #fff1d6 100%',
      '#f6ffed 0%, #e9f5e1 100%',
      '#fff2f0 0%, #ffded8 100%',
      '#f9f0ff 0%, #f0e0ff 100%',
      '#e6fffb 0%, #b5f5ec 100%',
      '#fffbe6 0%, #fff5c2 100%'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // 获取网站favicon
  const getFaviconUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}/favicon.ico`;
    } catch (error) {
      return null;
    }
  };

  // 生成默认描述
  const getDefaultDescription = (name) => {
    const descriptions = [
      `${name}是一个优秀的网站，提供丰富的内容和服务。`,
      `访问${name}获取更多有价值的信息和资源。`,
      `${name}是行业内领先的网站，值得您的关注。`,
      `在${name}上您可以找到您需要的各种信息和工具。`,
      `${name}为用户提供高质量的内容和良好的用户体验。`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    setLiking(true);
    try {
      // 对于本地JSON数据，我们只做前端状态模拟
      if (website._id) {
        // 如果有_id字段，说明是从后端获取的数据
        if (website.likes?.some(u => u._id === user._id)) {
          await websiteService.unlikeWebsite(website._id);
          onUpdate?.({
            ...website,
            likes: website.likes.filter(u => u._id !== user._id)
          });
        } else {
          await websiteService.likeWebsite(website._id);
          onUpdate?.({
            ...website,
            likes: [...(website.likes || []), user]
          });
        }
      } else {
        // 本地JSON数据，仅前端模拟
        message.info('本地数据不支持点赞功能');
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setLiking(false);
    }
  };

  // 处理收藏
  const handleCollect = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    setCollecting(true);
    try {
      if (website._id) {
        // 如果有_id字段，说明是从后端获取的数据
        if (user.collectedWebsites?.some(id => id === website._id)) {
          await websiteService.uncollectWebsite(website._id);
        } else {
          await websiteService.collectWebsite(website._id);
        }
        // 更新用户收藏列表
        const updatedUser = {
          ...user,
          collectedWebsites: user.collectedWebsites?.includes(website._id)
            ? user.collectedWebsites.filter(id => id !== website._id)
            : [...(user.collectedWebsites || []), website._id]
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        // 本地JSON数据，仅前端模拟
        message.info('本地数据不支持收藏功能');
      }
    } catch (error) {
      console.error('收藏失败:', error);
    } finally {
      setCollecting(false);
    }
  };

  // 检查用户是否已点赞或收藏
  const isLiked = user && website._id && website.likes?.some(u => u._id === user._id);
  const isCollected = user && website._id && user.collectedWebsites?.includes(website._id);

  const faviconUrl = getFaviconUrl(website.url);
  const gradientColor = getRandomGradient();
  const bgStyle = `linear-gradient(135deg, ${gradientColor})`;

  return (
    <StyledCard
      hoverable
      cover={
          website.thumbnail ? 
            <div style={{ 
              height: '100px', 
              padding: '8px', 
              background: '#fafafa',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <img 
                alt={website.name || website.title} 
                src={website.thumbnail} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease',
                  borderRadius: '4px'
                }} 
              />
            </div> : 
            <EmptyCover bg={bgStyle}>
              {faviconUrl && !faviconError ? (
                <img 
                  src={faviconUrl} 
                  alt="网站图标" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
                  }} 
                  onError={() => setFaviconError(true)}
                />
              ) : (
                '🌐'
              )}
            </EmptyCover>
        }
      actions={[
        <Tooltip title="点赞" key="like">
          <CardButton
            icon={<LikeOutlined />}
            onClick={handleLike}
            loading={liking}
            type={isLiked ? 'primary' : 'default'}
            size="small"
            disabled={!website._id}
          >
            {website.likes?.length || 0}
          </CardButton>
        </Tooltip>,
        <Tooltip title="收藏" key="collect">
          <CardButton
            icon={<StarOutlined />}
            onClick={handleCollect}
            loading={collecting}
            type={isCollected ? 'primary' : 'default'}
            size="small"
            disabled={!website._id}
          >
            收藏
          </CardButton>
        </Tooltip>,
        <Tooltip title="浏览量" key="views">
          <CardButton disabled icon={<EyeOutlined />} size="small">
            {website.views || 0}
          </CardButton>
        </Tooltip>
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div>
          <Title level={4} style={{ margin: 0, marginBottom: 8, fontSize: '16px', fontWeight: '600' }}>
            <WebsiteUrl href={website.url} target="_blank" rel="noopener noreferrer">
              {faviconUrl && !faviconError && (
                <img 
                  src={faviconUrl} 
                  alt="网站图标" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    marginRight: '6px',
                    borderRadius: '2px'
                  }} 
                  onError={() => setFaviconError(true)}
                />
              )}
              {website.name || website.title}
              <LinkOutlined />
            </WebsiteUrl>
          </Title>
          
          <Space size="small" wrap style={{ marginBottom: 8 }} orientation="horizontal">
            <CategoryTag color="blue">{website.category}</CategoryTag>
            {website.subcategory && <CategoryTag color="green">{website.subcategory}</CategoryTag>}
            {website.tags?.map((tag, index) => (
              <CategoryTag key={index} color="default">{tag}</CategoryTag>
            ))}
          </Space>
        </div>
        
        <div 
          style={{ 
            fontSize: '14px', 
            color: '#666', 
            lineHeight: '1.6',
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexGrow: 1, // 让描述文字容器填充剩余空间
            minHeight: '44px' // 设置最小高度，确保与两行文本高度一致
          }}
        >
          {website.description || getDefaultDescription(website.name || website.title)}
        </div>
        
        <Space size="small" wrap style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }} orientation="horizontal">
          <Space size="small" align="center">
            <CardAvatar 
              src={website.creator?.avatar} 
              icon={<UserOutlined />} 
              size={24} 
              alt={website.creator?.nickname || '未知用户'}
            />
            <Text type="secondary" size="small">
              {website.creator?.nickname || (website._id ? '未知用户' : '本地数据')}
            </Text>
          </Space>
          
          <Text type="secondary" size="small" style={{ fontSize: '12px' }}>
            {website.createdAt ? new Date(website.createdAt).toLocaleDateString() : '未知时间'}
          </Text>
        </Space>
      </div>
    </StyledCard>
  );
};

export default WebsiteCard;
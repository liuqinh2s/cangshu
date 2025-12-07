import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Tag, Button, Space, List, Avatar, Input, Form, Spin, message } from 'antd';
import { LikeOutlined, StarOutlined, EyeOutlined, UserOutlined, CommentOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { websiteService } from '../services/api';
import { useUser } from '../context/UserContext';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

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
  min-height: calc(100vh - 64px);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const WebsiteCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .ant-card-cover {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }
`;

const CommentCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .ant-card-head-title {
    font-size: 20px;
    font-weight: 600;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 8px 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const LikeButton = styled(ActionButton)`
  &.ant-btn-primary {
    background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
    border-color: #ff4d4f;

    &:hover {
      background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
      border-color: #ff7875;
    }
  }
`;

const CollectButton = styled(ActionButton)`
  &.ant-btn-primary {
    background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
    border-color: #faad14;

    &:hover {
      background: linear-gradient(135deg, #ffc53d 0%, #faad14 100%);
      border-color: #ffc53d;
    }
  }
`;

const ViewButton = styled(ActionButton)`
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-color: #52c41a;
  color: white;

  &:hover {
    background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
    border-color: #73d13d;
  }
`;

const CommentButton = styled(ActionButton)`
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-color: #1890ff;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
    border-color: #40a9ff;
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  }

  &:disabled {
    background: #d9d9d9;
    border-color: #d9d9d9;
    box-shadow: none;
  }
`;

const WebsiteTitle = styled(Title)`
  margin-bottom: 16px !important;
  font-size: 28px !important;
  font-weight: 600 !important;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .ant-avatar {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
`;

const WebsiteDetailPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentForm] = Form.useForm();

  // 获取网站详情
  const fetchWebsiteDetail = async () => {
    setLoading(true);
    try {
      const result = await websiteService.getWebsite(id);
      setWebsite(result);
    } catch (error) {
      message.error('获取网站详情失败');
      console.error('获取网站详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载网站详情
  useEffect(() => {
    fetchWebsiteDetail();
  }, [id]);

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    setLiking(true);
    try {
      if (website.likes?.some(u => u._id === user._id)) {
        await websiteService.unlikeWebsite(website._id);
        setWebsite({
          ...website,
          likes: website.likes.filter(u => u._id !== user._id)
        });
      } else {
        await websiteService.likeWebsite(website._id);
        setWebsite({
          ...website,
          likes: [...(website.likes || []), user]
        });
      }
    } catch (error) {
      message.error('点赞失败');
      console.error('点赞失败:', error);
    } finally {
      setLiking(false);
    }
  };

  // 处理收藏
  const handleCollect = async () => {
    if (!user) {
      message.error('请先登录');
      return;
    }

    setCollecting(true);
    try {
      if (user.collectedWebsites?.includes(website._id)) {
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
    } catch (error) {
      message.error('收藏失败');
      console.error('收藏失败:', error);
    } finally {
      setCollecting(false);
    }
  };

  // 检查用户是否已点赞或收藏
  const isLiked = user && website?.likes?.some(u => u._id === user._id);
  const isCollected = user && user.collectedWebsites?.includes(website?._id);

  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '22px', fontWeight: '600' }}>
          仓鼠导航
        </Title>
      </StyledHeader>
      <StyledContent>
        <Spin spinning={loading}>
          {website && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 网站详情卡片 */}
              <WebsiteCard
                cover={website.thumbnail ? <img alt={website.title} src={website.thumbnail} /> : null}
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <CreatorInfo>
                    <Avatar src={website.creator?.avatar}>{website.creator?.nickname?.charAt(0)}</Avatar>
                    <Text style={{ fontWeight: '500' }}>{website.creator?.nickname}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(website.createdAt).toLocaleString()}</Text>
                  </CreatorInfo>
                  
                  <div>
                    <WebsiteTitle level={2}>
                      <a href={website.url} target="_blank" rel="noopener noreferrer">
                        {website.title}
                        <LinkOutlined />
                      </a>
                    </WebsiteTitle>
                    <Space size="small" wrap>
                      <Tag color="blue" style={{ borderRadius: '6px', fontSize: '14px', padding: '4px 10px' }}>{website.category}</Tag>
                      {website.tags?.map((tag, index) => (
                        <Tag key={index} style={{ borderRadius: '6px', fontSize: '14px', padding: '4px 10px' }}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                  
                  <div>
                    <Text style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>{website.description}</Text>
                  </div>
                  
                  <div>
                    <Space size="middle">
                      <LikeButton
                        type={isLiked ? 'primary' : 'default'}
                        icon={<LikeOutlined />}
                        onClick={handleLike}
                        loading={liking}
                      >
                        {website.likes?.length || 0} 点赞
                      </LikeButton>
                      <CollectButton
                        type={isCollected ? 'primary' : 'default'}
                        icon={<StarOutlined />}
                        onClick={handleCollect}
                        loading={collecting}
                      >
                        {isCollected ? '已收藏' : '收藏'}
                      </CollectButton>
                      <ViewButton
                        icon={<EyeOutlined />}
                        disabled
                      >
                        {website.views || 0} 浏览
                      </ViewButton>
                    </Space>
                  </div>
                </Space>
              </WebsiteCard>
              
              {/* 评论区域 */}
              <CommentCard title="评论">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* 评论表单 */}
                  <Form
                    form={commentForm}
                    layout="vertical"
                    // onFinish={handleSubmitComment}
                  >
                    <Form.Item
                      name="content"
                      rules={[{ required: true, message: '请输入评论内容' }]}
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="请输入评论内容"
                        variant="outlined"
                        style={{ borderRadius: '8px' }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <CommentButton
                        type="primary"
                        htmlType="submit"
                        icon={<CommentOutlined />}
                        // loading={commentLoading}
                        disabled={!user}
                      >
                        {user ? '发表评论' : '请先登录'}
                      </CommentButton>
                    </Form.Item>
                  </Form>
                  
                  {/* 评论列表 */}
                  <List
                    dataSource={comments}
                    renderItem={comment => (
                      <List.Item
                        key={comment._id}
                        actions={[
                          <Text key="like" style={{ cursor: 'pointer', color: '#ff4d4f', fontWeight: '500' }}>
                            <LikeOutlined /> {comment.likes?.length || 0}
                          </Text>
                        ]}
                        style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}
                      >
                        <List.Item.Meta
                          avatar={comment.user?.avatar ? <Avatar src={comment.user.avatar} /> : <Avatar icon={<UserOutlined />} />}
                          title={<Text style={{ fontWeight: '500' }}>{comment.user?.nickname}</Text>}
                          description={
                            <Space direction="vertical" size="small">
                              <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>{comment.content}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(comment.createdAt).toLocaleString()}</Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: <Text type="secondary">暂无评论，快来发表第一条评论吧！</Text> }}
                    style={{ marginTop: 8 }}
                  />
                </Space>
              </CommentCard>
            </Space>
          )}
        </Spin>
      </StyledContent>
    </StyledLayout>
  );
};

export default WebsiteDetailPage;
import React, { useState } from 'react';
import { Layout, Form, Input, Select, Switch, Button, Typography, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { websiteService } from '../services/api';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
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
`;

const StyledForm = styled(Form)`
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 30px 24px;
    margin: 0 16px;
  }
`;

const AddButton = styled(Button)`
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-color: #1890ff;
  color: white;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
    border-color: #40a9ff;
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
    transform: translateY(-2px);
  }

  &:focus {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-color: #1890ff;
  }
`;

const AddWebsitePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 网站分类选项
  const categories = ['工具', '设计', '开发', '学习', '娱乐', '生活', '其他'];

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 处理标签，将字符串分割为数组
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      // 准备提交数据
      const websiteData = {
        ...values,
        tags
      };

      // 调用API创建网站
      const result = await websiteService.createWebsite(websiteData);
      message.success('网站添加成功');
      
      // 重置表单
      form.resetFields();
      
      console.log('网站添加成功:', result);
    } catch (error) {
      message.error('网站添加失败');
      console.error('网站添加失败:', error);
    } finally {
      setLoading(false);
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
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: 8, fontSize: '24px', fontWeight: '600' }}>添加网站</Title>
            </div>
            
            <Form.Item
              name="title"
              label="网站标题"
              rules={[{ required: true, message: '请输入网站标题' }]}
            >
              <Input placeholder="请输入网站标题" variant="outlined" />
            </Form.Item>

            <Form.Item
              name="url"
              label="网站地址"
              rules={[
                { required: true, message: '请输入网站地址' },
                { type: 'url', message: '请输入有效的URL地址' }
              ]}
            >
              <Input placeholder="请输入网站地址，以http://或https://开头" variant="outlined" />
            </Form.Item>

            <Form.Item
              name="description"
              label="网站描述"
              rules={[{ required: true, message: '请输入网站描述' }]}
            >
              <TextArea rows={4} placeholder="请输入网站描述" variant="outlined" />
            </Form.Item>

            <Form.Item
              name="category"
              label="网站分类"
              rules={[{ required: true, message: '请选择网站分类' }]}
            >
              <Select placeholder="请选择网站分类" variant="outlined">
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="tags"
              label="网站标签"
              tooltip="请输入标签，多个标签用逗号分隔"
            >
              <Input placeholder="请输入标签，例如：工具,设计,开发" variant="outlined" />
            </Form.Item>

            <Form.Item
              name="thumbnail"
              label="网站缩略图"
              tooltip="可选，输入图片URL"
            >
              <Input placeholder="请输入网站缩略图URL" variant="outlined" />
            </Form.Item>

            <Form.Item
              name="isPublic"
              label="是否公开"
              valuePropName="checked"
            >
              <Switch defaultChecked checkedChildren="公开" unCheckedChildren="私有" />
            </Form.Item>

            <Form.Item>
              <AddButton
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loading}
                size="large"
              >
                添加网站
              </AddButton>
            </Form.Item>
          </Space>
        </StyledForm>
      </StyledContent>
    </StyledLayout>
  );
};

export default AddWebsitePage;
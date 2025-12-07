import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { websiteApi, commentApi } from '../services/api';

// 评论组件
const CommentItem = ({ comment }) => {
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{comment.user.username || '匿名用户'}</Text>
        <Text style={styles.commentTime}>{comment.createdAt}</Text>
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );
};

export default function WebsiteDetailScreen({ route, navigation }) {
  const { websiteId } = route.params;
  const [website, setWebsite] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);

  // 加载网站详情
  const loadWebsiteDetail = async () => {
    try {
      setLoading(true);
      const response = await websiteApi.getWebsiteDetail(websiteId);
      
      if (response.success) {
        const websiteData = response.data;
        setWebsite(websiteData);
        setIsLiked(websiteData.isLiked);
        setIsCollected(websiteData.isCollected);
        setLikeCount(websiteData.likeCount);
        setCollectionCount(websiteData.collectionCount);
        loadComments();
      }
    } catch (error) {
      console.error('加载网站详情失败：', error);
      Alert.alert('错误', '加载网站详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载评论
  const loadComments = async () => {
    try {
      const response = await commentApi.getComments({ websiteId });
      if (response.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('加载评论失败：', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadWebsiteDetail();
  }, [websiteId]);

  // 点赞/取消点赞
  const toggleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await websiteApi.likeWebsite(websiteId, action);
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(prevCount => action === 'like' ? prevCount + 1 : prevCount - 1);
      }
    } catch (error) {
      console.error('点赞操作失败：', error);
      Alert.alert('错误', '点赞操作失败');
    }
  };

  // 收藏/取消收藏
  const toggleCollect = async () => {
    try {
      const action = isCollected ? 'uncollect' : 'collect';
      const response = await websiteApi.collectWebsite(websiteId, action);
      
      if (response.success) {
        setIsCollected(!isCollected);
        setCollectionCount(prevCount => action === 'collect' ? prevCount + 1 : prevCount - 1);
      }
    } catch (error) {
      console.error('收藏操作失败：', error);
      Alert.alert('错误', '收藏操作失败');
    }
  };

  // 打开网站
  const openWebsite = () => {
    Linking.openURL(website.url).catch(err => {
      console.error('打开网站失败：', err);
      Alert.alert('错误', '无法打开该网站');
    });
  };

  // 提交评论
  const submitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }

    try {
      const response = await commentApi.addComment({
        websiteId,
        content: commentText.trim(),
      });
      
      if (response.success) {
        setCommentText('');
        loadComments(); // 重新加载评论列表
        Alert.alert('成功', '评论提交成功');
      }
    } catch (error) {
      console.error('提交评论失败：', error);
      Alert.alert('错误', '提交评论失败');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!website) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>网站不存在</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 网站信息区域 */}
        <View style={styles.websiteInfo}>
          <Text style={styles.websiteTitle}>{website.title}</Text>
          <Text style={styles.websiteUrl}>{website.url}</Text>
          
          <Text style={styles.sectionTitle}>网站描述</Text>
          <Text style={styles.websiteDescription}>{website.description}</Text>
          
          <Text style={styles.sectionTitle}>标签</Text>
          <View style={styles.tagsContainer}>
            {website.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>元数据</Text>
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>分类:</Text>
              <Text style={styles.metadataValue}>{website.category || '未分类'}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>创建时间:</Text>
              <Text style={styles.metadataValue}>{website.createdAt}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>更新时间:</Text>
              <Text style={styles.metadataValue}>{website.updatedAt}</Text>
            </View>
          </View>
        </View>
        
        {/* 操作按钮区域 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Ionicons 
              name={isLiked ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isLiked ? '#ff4d4f' : '#666'} 
            />
            <Text style={styles.actionButtonText}>{likeCount} 赞</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={toggleCollect}>
            <Ionicons 
              name={isCollected ? 'star' : 'star-outline'} 
              size={24} 
              color={isCollected ? '#faad14' : '#666'} 
            />
            <Text style={styles.actionButtonText}>{collectionCount} 收藏</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
            <Ionicons name="open" size={24} color="#1890ff" />
            <Text style={styles.actionButtonText}>打开网站</Text>
          </TouchableOpacity>
        </View>
        
        {/* 评论区 */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>评论 ({comments.length})</Text>
          
          {/* 评论输入框 */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="写下你的评论..."
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={[styles.submitButton, !commentText.trim() && styles.submitButtonDisabled]} 
              onPress={submitComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.submitButtonText}>发布</Text>
            </TouchableOpacity>
          </View>
          
          {/* 评论列表 */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))
          ) : (
            <Text style={styles.noCommentsText}>暂无评论</Text>
          )}
        </View>
      </ScrollView>
      
      {/* 返回按钮 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4f',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  websiteInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  websiteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  websiteUrl: {
    fontSize: 16,
    color: '#1890ff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  websiteDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  metadataContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#999',
    width: 80,
  },
  metadataValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  commentsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 80,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { websiteApi, authApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 收藏网站卡片组件
const CollectionCard = ({ website, onPress, onRemove }) => {
  return (
    <View style={styles.collectionCard}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <Text style={styles.cardTitle}>{website.title}</Text>
        <Text style={styles.cardUrl}>{website.url}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
      </TouchableOpacity>
    </View>
  );
};

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(false);

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const userString = await AsyncStorage.getItem('userInfo');
      if (userString) {
        const userInfo = JSON.parse(userString);
        setUser(userInfo);
      }
    } catch (error) {
      console.error('加载用户信息失败：', error);
    }
  };

  // 加载收藏的网站
  const loadCollections = async () => {
    try {
      setLoadingCollections(true);
      const response = await websiteApi.getUserCollections();
      
      if (response.success) {
        setCollections(response.data);
      }
    } catch (error) {
      console.error('加载收藏的网站失败：', error);
    } finally {
      setLoadingCollections(false);
    }
  };

  // 初始加载
  useEffect(() => {
    const init = async () => {
      await loadUserInfo();
      await loadCollections();
      setLoading(false);
    };
    init();
  }, []);

  // 刷新数据
  const handleRefresh = async () => {
    await loadUserInfo();
    await loadCollections();
  };

  // 退出登录
  const handleLogout = async () => {
    Alert.alert(
      '确认退出登录',
      '您确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              // 清除本地存储的用户信息
              await AsyncStorage.removeItem('userInfo');
              await AsyncStorage.removeItem('token');
              // 导航到登录页
              navigation.navigate('Login');
            } catch (error) {
              console.error('退出登录失败：', error);
              Alert.alert('错误', '退出登录失败');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 打开网站详情
  const openWebsiteDetail = (website) => {
    navigation.navigate('WebsiteDetail', { websiteId: website._id });
  };

  // 移除收藏
  const removeCollection = async (websiteId) => {
    Alert.alert(
      '确认取消收藏',
      '您确定要取消收藏该网站吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              const response = await websiteApi.collectWebsite(websiteId, 'uncollect');
              if (response.success) {
                // 更新收藏列表
                setCollections(collections.filter(item => item._id !== websiteId));
                Alert.alert('成功', '取消收藏成功');
              }
            } catch (error) {
              console.error('取消收藏失败：', error);
              Alert.alert('错误', '取消收藏失败');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 用户信息区域 */}
      <View style={styles.userInfoSection}>
        <Image
          style={styles.avatar}
          source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
        />
        <Text style={styles.username}>{user?.username || '未登录'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4d4f" />
          <Text style={styles.logoutButtonText}>退出登录</Text>
        </TouchableOpacity>
      </View>

      {/* 收藏的网站区域 */}
      <View style={styles.collectionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>我的收藏</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={20} color="#1890ff" />
          </TouchableOpacity>
        </View>

        {loadingCollections ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1890ff" />
          </View>
        ) : (
          collections.length > 0 ? (
            <FlatList
              data={collections}
              renderItem={({ item }) => (
                <CollectionCard
                  website={item}
                  onPress={() => openWebsiteDetail(item)}
                  onRemove={() => removeCollection(item._id)}
                />
              )}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.collectionsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="star-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>暂无收藏的网站</Text>
              <TouchableOpacity 
                style={styles.exploreButton} 
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.exploreButtonText}>去探索</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  userInfoSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#ff4d4f',
    marginLeft: 5,
  },
  collectionsSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  collectionsList: {
    paddingVertical: 10,
  },
  collectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  cardUrl: {
    fontSize: 14,
    color: '#1890ff',
  },
  removeButton: {
    padding: 5,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#1890ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  exploreButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
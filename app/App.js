import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

// 导入页面
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import WebsiteDetailScreen from './src/screens/WebsiteDetailScreen';
import AddWebsiteScreen from './src/screens/AddWebsiteScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// 创建导航器
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 检查用户是否已登录
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 从本地存储获取token和用户信息
        const token = await AsyncStorage.getItem('userToken');
        const userInfoJson = await AsyncStorage.getItem('userInfo');
        
        if (token && userInfoJson) {
          setUserToken(token);
          setUserInfo(JSON.parse(userInfoJson));
        }
      } catch (e) {
        // 恢复token失败
        console.log('Failed to restore token', e);
      }
      
      // 加载完成
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  // 加载中状态
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName={userToken ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1890ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {userToken ? (
          // 已登录的路由
          [
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: '仓鼠导航' }}
            />,
            <Stack.Screen 
              name="WebsiteDetail" 
              component={WebsiteDetailScreen} 
              options={{ title: '网站详情' }}
            />,
            <Stack.Screen 
              name="AddWebsite" 
              component={AddWebsiteScreen} 
              options={{ title: '添加网站' }}
            />,
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: '个人中心' }}
            />
          ]
        ) : (
          // 未登录的路由
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
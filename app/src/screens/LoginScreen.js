import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { authApi } from '../services/api';

// 微信登录配置
const WECHAT_CLIENT_ID = 'your-wechat-app-id';
const WECHAT_REDIRECT_URI = 'your-wechat-redirect-uri';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  // 微信登录
  const handleWechatLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. 获取微信授权码
      const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_CLIENT_ID}&redirect_uri=${encodeURIComponent(WECHAT_REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=wechat_login#wechat_redirect`;
      
      // 使用WebBrowser打开微信授权页面
      const result = await WebBrowser.openAuthSessionAsync(authUrl, WECHAT_REDIRECT_URI);
      
      if (result.type === 'success' && result.url) {
        // 2. 解析授权码
        const code = result.url.match(/code=(.*?)&/)[1];
        
        // 3. 调用后端API获取用户信息和token
        const response = await authApi.wechatLogin(code, {});
        
        if (response.success) {
          // 4. 保存token和用户信息到本地存储
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
          
          // 5. 导航到首页
          navigation.replace('Home');
        } else {
          alert('登录失败：' + response.message);
        }
      }
    } catch (error) {
      console.error('微信登录失败：', error);
      alert('微信登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#1890ff', '#096dd9']} 
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>仓鼠导航</Text>
        <Text style={styles.tagline}>发现和分享优质网站</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.wechatLoginButton} 
          onPress={handleWechatLogin}
          disabled={isLoading}
        >
          <Text style={styles.wechatLoginText}>微信授权登录</Text>
        </TouchableOpacity>
        
        <Text style={styles.privacyText}>
          登录即表示您同意《用户协议》和《隐私政策》
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  wechatLoginButton: {
    backgroundColor: '#07C160',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wechatLoginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  privacyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
});
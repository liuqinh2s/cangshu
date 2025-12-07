import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { websiteApi } from '../services/api';

export default function AddWebsiteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  // 验证URL格式
  const validateUrl = (url) => {
    if (!url) return false;
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return regex.test(url);
  };

  // 提交表单
  const submitForm = async () => {
    // 表单验证
    if (!title.trim()) {
      Alert.alert('提示', '请输入网站标题');
      return;
    }

    if (!url.trim() || !validateUrl(url)) {
      Alert.alert('提示', '请输入有效的网站URL');
      return;
    }

    if (!description.trim()) {
      Alert.alert('提示', '请输入网站描述');
      return;
    }

    try {
      setLoading(true);

      // 处理标签（逗号分隔转数组）
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // 调用API添加网站
      const response = await websiteApi.addWebsite({
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        tags: tagsArray,
        category: category.trim() || '未分类',
        isPublic,
      });

      if (response.success) {
        Alert.alert('成功', '网站添加成功', [
          {
            text: '确定',
            onPress: () => {
              // 清空表单
              setTitle('');
              setUrl('');
              setDescription('');
              setTags('');
              setCategory('');
              setIsPublic(true);
              // 返回首页
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('添加网站失败：', error);
      Alert.alert('错误', '添加网站失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>添加网站</Text>

        {/* 表单字段 */}
        <View style={styles.formContainer}>
          {/* 网站标题 */}
          <View style={styles.formItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>网站标题</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="请输入网站标题"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
            />
          </View>

          {/* 网站URL */}
          <View style={styles.formItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>网站URL</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="请输入网站URL，如：https://www.example.com"
              placeholderTextColor="#999"
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* 网站描述 */}
          <View style={styles.formItem}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>网站描述</Text>
              <Text style={styles.required}>*</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="请输入网站描述"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* 标签 */}
          <View style={styles.formItem}>
            <Text style={styles.label}>标签</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入标签，用逗号分隔"
              placeholderTextColor="#999"
              value={tags}
              onChangeText={setTags}
              autoCapitalize="none"
            />
          </View>

          {/* 分类 */}
          <View style={styles.formItem}>
            <Text style={styles.label}>分类</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入网站分类"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
              autoCapitalize="sentences"
            />
          </View>

          {/* 公开设置 */}
          <View style={styles.formItem}>
            <Text style={styles.label}>是否公开</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>{isPublic ? '公开' : '私有'}</Text>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#d9d9d9', true: '#1890ff' }}
                thumbColor={isPublic ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={submitForm}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '提交中...' : '提交'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 返回按钮 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  formItem: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  required: {
    fontSize: 16,
    color: '#ff4d4f',
    marginLeft: 2,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 120,
    paddingVertical: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  switchText: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#91d5ff',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
#!/usr/bin/env python3
"""
解析导航网站Markdown文件，提取分类和链接信息
"""

import re
import json
import sys


def parse_markdown(file_path):
    """
    解析Markdown文件，提取分类和链接信息
    
    Args:
        file_path: Markdown文件路径
        
    Returns:
        dict: 包含分类和链接的字典
    """
    categories = []
    current_category = None
    current_subcategory = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # 跳过空行和YAML头
            if not line or line.startswith('---'):
                continue
                
            # 匹配一级分类 (#)
            if line.startswith('# '):
                category_name = line[2:].strip()
                current_category = {
                    'name': category_name,
                    'subcategories': []
                }
                categories.append(current_category)
                current_subcategory = None
                continue
                
            # 匹配二级分类 (##)
            if line.startswith('## '):
                if not current_category:
                    continue
                
                subcategory_name = line[3:].strip()
                
                # 检查是否已存在同名子分类
                existing_subcat = None
                for subcat in current_category['subcategories']:
                    if subcat['name'] == subcategory_name:
                        existing_subcat = subcat
                        break
                
                if existing_subcat:
                    current_subcategory = existing_subcat
                else:
                    current_subcategory = {
                        'name': subcategory_name,
                        'websites': []
                    }
                    current_category['subcategories'].append(current_subcategory)
                continue
                
            # 匹配链接 (- [名称](URL))
            if line.startswith('- ['):
                if not current_subcategory:
                    # 如果没有二级分类，创建一个默认的
                    if not current_category:
                        continue
                    if not current_category['subcategories']:
                        current_subcategory = {
                            'name': '默认',
                            'websites': []
                        }
                        current_category['subcategories'].append(current_subcategory)
                    else:
                        current_subcategory = current_category['subcategories'][-1]
                
                # 提取描述部分（如果有）
                description_match = re.search(r'\s+-\s+(.+)$', line)
                description = description_match.group(1) if description_match else ''
                
                # 提取所有链接
                links = re.findall(r'\[(.*?)\]\((.*?)\)', line)
                for link in links:
                    name = link[0].strip()
                    url = link[1].strip()
                    
                    website = {
                        'name': name,
                        'url': url,
                        'description': description
                    }
                    
                    # 检查是否已存在相同的网站URL
                    url_exists = False
                    for existing_website in current_subcategory['websites']:
                        if existing_website['url'] == website['url']:
                            url_exists = True
                            break
                    if not url_exists:
                        current_subcategory['websites'].append(website)
    
    return categories


def main():
    if len(sys.argv) != 2:
        print("Usage: python parse_navigation.py <markdown_file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    categories = parse_markdown(file_path)
    
    # 输出JSON格式
    print(json.dumps(categories, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
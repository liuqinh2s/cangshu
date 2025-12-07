import json

# 读取导航数据
with open('/Users/a1-6/git/cangshu/frontend/src/data/navigation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('检查加密货币分类:')
print('-' * 50)

# 遍历所有分类
for category in data:
    print(f'\n当前分类: {category["name"]}')
    
    # 遍历当前分类下的所有子分类
    for subcategory in category['subcategories']:
        if subcategory['name'] == '加密货币':
            print(f'找到加密货币子分类!')
            print(f'网站数量: {len(subcategory["websites"])}')
            print('网站列表:')
            for website in subcategory['websites']:
                print(f'  - {website["name"]}: {website["url"]}')
            print('\n子分类完整数据:')
            print(json.dumps(subcategory, ensure_ascii=False, indent=2))

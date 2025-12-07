import json

# 读取导航数据
with open('/Users/a1-6/git/cangshu/frontend/src/data/navigation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 检查特定网站
websites_to_check = [
    '槽边往事',
    '酷壳的延续',
    '酷壳',
    'paint-board'
]

found_websites = []

for category in data:
    for subcategory in category['subcategories']:
        for website in subcategory['websites']:
            if website['name'] in websites_to_check:
                found_websites.append(website)

print('检查结果:')
print('-' * 50)
for website in found_websites:
    print(f'名称: {website["name"]}')
    print(f'URL: {website["url"]}')
    print(f'描述: {website["description"]}')
    print('-' * 50)

print(f'共找到 {len(found_websites)} 个网站')

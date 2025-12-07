import json

# 读取导航数据
with open('/Users/a1-6/git/cangshu/frontend/src/data/navigation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 统计网站数量
total_websites = 0
print('各分类网站数量统计:')
print('-' * 50)
for category in data:
    category_total = 0
    for subcat in category['subcategories']:
        count = len(subcat['websites'])
        category_total += count
        print(f'{category["name"]} > {subcat["name"]}: {count}个网站')
    print(f'{category["name"]} 总计: {category_total}个网站')
    print('-' * 50)
    total_websites += category_total

print(f'\n所有分类总计: {total_websites}个网站')

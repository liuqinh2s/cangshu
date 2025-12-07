import json

# 读取导航数据
with open('/Users/a1-6/git/cangshu/frontend/src/data/navigation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 检查重复的一级分类
categories = {}
for category in data:
    name = category['name']
    if name in categories:
        categories[name].append(category)
    else:
        categories[name] = [category]

duplicates = {k: v for k, v in categories.items() if len(v) > 1}
print('重复的一级分类:')
for name, items in duplicates.items():
    print(f'- {name}: {len(items)} 个重复项')

# 检查重复的二级分类
print('\n重复的二级分类:')
for category in data:
    subcategories = {}
    for subcat in category['subcategories']:
        subcat_name = subcat['name']
        if subcat_name in subcategories:
            subcategories[subcat_name].append(subcat)
        else:
            subcategories[subcat_name] = [subcat]
    
    sub_duplicates = {k: v for k, v in subcategories.items() if len(v) > 1}
    if sub_duplicates:
        print(f'在一级分类 "{category["name"]}" 下:')
        for name, items in sub_duplicates.items():
            print(f'  - {name}: {len(items)} 个重复项')

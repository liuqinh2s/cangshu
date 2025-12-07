import json

# 读取导航数据
with open('/Users/a1-6/git/cangshu/frontend/src/data/navigation_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 查找重复的视频分类
for category in data:
    if category['name'] == '我的工具':
        print('在"我的工具"分类下的所有子分类:')
        for i, subcat in enumerate(category['subcategories']):
            print(f'[{i+1}] {subcat["name"]} ({len(subcat["websites"])}个网站)')
        
        print('\n重复的"视频"分类详情:')
        video_count = 1
        for i, subcat in enumerate(category['subcategories']):
            if subcat['name'] == '视频':
                print(f'\n视频分类 {video_count}:')
                video_count += 1
                print(f'包含 {len(subcat["websites"])} 个网站:')
                for site in subcat['websites']:
                    print(f'  - {site["name"]} ({site["url"]})')

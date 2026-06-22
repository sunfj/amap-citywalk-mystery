# AI CityWalk 剧本杀

> 基于高德地图的城市解谜探索 Skill — 让 AI 当你的剧本杀主持人

## 项目简介

AI CityWalk 剧本杀是一个创意地图 Skill，将**剧本杀**的游戏体验搬到**真实城市街道**上。AI 不只是"念稿机器"，而是真正的**剧本杀主持人**——根据你的城市、主题偏好，自动生成沉浸式多章节剧本，串联真实地点，规划步行路线，生成可交互的地图链接，并通过 **GPS 定位 + 现场拍照 + 答案校验** 三重验证逐站引导，只有真正到达现场并完成任务才能解锁下一章。

## Demo 展示

已完成 **5 个城市 × 5 种主题** 的完整 Demo，所有地点均为高德 POI 真实数据：

| 主题 | 城市 | 剧本名 | 站点 | 路线 | 文件 |
|------|------|--------|------|------|------|
| 🔍 悬疑侦探 | 杭州 | 西湖迷踪 | 4站 | 8.4km / 114min | [demo_output.txt](demo_output.txt) |
| 🏛️ 历史穿越 | 北京 | 皇城秘史 | 4站 | 6.1km / 84min | [demo_beijing_history.txt](demo_beijing_history.txt) |
| 🍜 美食探索 | 成都 | 蜀味寻踪 | 4站 | 6.6km / 89min | [demo_chengdu_food.txt](demo_chengdu_food.txt) |
| 💕 浪漫爱情 | 上海 | 沪上情书 | 4站 | 3.1km / 43min | [demo_shanghai_romance.txt](demo_shanghai_romance.txt) |
| 🎨 文艺清新 | 广州 | 羊城手账 | 4站 | 6.1km / 82min | [demo_guangzhou_art.txt](demo_guangzhou_art.txt) |
| 🎮 互动对话 | 杭州 | 西湖迷踪 | 4站 | 三重验证对话流 | [demo_interactive_flow.txt](demo_interactive_flow.txt) |

**数据总览**：5 个 Demo · 20 个真实 POI 站点 · 30.3km 总步行路线

### Demo 亮点

- **真实数据**：所有地点通过高德 POI 搜索获取，确保真实存在
- **真实路线**：步行路线通过高德路径规划 API 计算，确保可达
- **沉浸叙事**：每个 Demo 包含完整的故事主线、线索任务和到达确认
- **地图可视化**：每个 Demo 附带可交互的高德地图链接

### 互动玩法（核心机制）

与普通的城市攻略不同，本 Skill 采用**逐站解锁 + 三重验证**的剧本杀互动模式：

```
用户：我想在杭州玩一个悬疑主题
AI：🎭 欢迎来到 AI CityWalk 剧本杀！
    规则：每到一站需完成三步验证——定位、拍照、答题……

[AI 输出故事背景 + 第一站内容]

用户：[分享位置]
AI：📍 定位确认！你距离「纯真年代书吧」约 85 米。

用户：[上传门口石碑照片]
AI：📷 照片确认！我看到了石碑上的创办年份。

用户：答案是 1999
AI：🎉 正确！积分 +15！🔓 解锁第二站……

用户：[分享位置 + 上传照片] 石柱有 5 根
AI：❌ 不对哦，再想想？提示：看主入口两侧……
用户：[重新拍照] 3 根！
AI：✅ 正确！积分 +10！解锁下一站……

[全部通关后]
AI：🏆 通关成绩卡
    总分：50/80  评级：B级「勇气冒险者」
    [专属结局 + 完整回顾]
```

**验证机制**：

| 验证层 | 方式 | 作用 | 是否必须 |
|--------|------|------|---------|
| 📍 **打卡定位** | AI 生成 H5 打卡链接，用户点击后浏览器获取 GPS | 确认真的到达现场（偏差 <500m），全平台通用 | **必须** |
| 📷 **照片验证** | 用户上传现场照片，AI 多模态识别 | 核心防作弊：确认到场场景 + 拍到答案线索 | **必须** |
| ✍️ **答案验证** | 用户文字回答 | AI 比对预设标准答案，校验对错 | **必须** |

> **注意**：
> - AI 模型必须支持多模态（图像识别），如 GPT-4o、Claude 3.5、Qwen-VL 等
> - 定位打卡服务需部署在公网服务器上，利用浏览器 `navigator.geolocation` 获取真实 GPS

**游戏机制**：
- 🔓 **逐站解锁** — 三重验证全通过才能看到下一站剧情
- 💡 **智能提示** — 答错会给提示，3次后直接告知答案
- 🏆 **积分系统** — 首次答对+15分，再次答对+10分，加分任务+5分
- 🏅 **通关评级** — S/A/B/C 四个等级，对应不同结局
- ⏭️ **跳过机制** — 允许跳过但不得分

## 可视化素材

| 文件 | 内容 |
|------|------|
| [workflow.svg](assets/workflow.svg) | Skill 8 步执行流程图 |
| [themes.svg](assets/themes.svg) | 五大主题卡片 + 数据总览 |
| [architecture.svg](assets/architecture.svg) | 技术架构图 |

## 使用场景

- 周末不知道去哪玩？让 AI 给你安排一场城市冒险
- 情侣想要独特的约会体验
- 旅行者想深度探索一座城市
- 亲子户外探索活动
- 团建活动组织

## 功能描述

1. **智能剧本生成** — AI 根据城市和主题创作沉浸式故事
2. **真实地点串联** — 调用高德 POI 搜索，确保每个地点都真实存在
3. **步行路线规划** — 调用高德路径规划，确保路线合理可达
4. **地图可视化** — 生成可交互的地图链接，一键查看路线
5. **照片验证通关** — AI 多模态识别现场照片，确认到场且拍到答案线索（核心防作弊）
6. **逐站互动主持** — AI 逐站引导，照片+答案验证通过才能解锁下一站
7. **积分与评级** — 实时计分，通关后生成专属成绩卡和评级
8. **天气辅助** — 查询天气，给出穿搭出行建议
9. **多主题支持** — 悬疑侦探/浪漫爱情/美食探索/历史穿越/文艺清新

## 前置条件

- Node.js 16+
- 高德开放平台 Web Service API Key（[免费申请](https://console.amap.com/dev/key/app)）
- **AI 模型必须支持多模态**（图像识别）：如 GPT-4o、Claude 3.5、Qwen-VL 等，
  通关验证依赖 AI 分析用户上传的现场照片

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

方式一：创建配置文件
```bash
cp config.example.json config.json
# 编辑 config.json，填入你的高德 API Key
```

方式二：环境变量
```bash
export AMAP_WEBSERVICE_KEY=your_key_here
```

### 3. 使用脚本

#### POI 搜索
```bash
node scripts/search-locations.js --keywords=咖啡馆 --city=杭州
node scripts/search-locations.js --keywords=书店 --city=北京 --types=140600
```

#### 路径规划
```bash
node scripts/plan-route.js --type=walking --origin=120.14873,30.25954 --destination=120.14433,30.25700
```

#### 生成地图
```bash
node scripts/generate-map.js --data=route_data.json
node scripts/generate-map.js --inline='[{"type":"poi","name":"地点","location":"120.1,30.2","clue":"线索","chapter":1}]'
```

#### 天气查询
```bash
node scripts/check-weather.js --city=杭州
```

#### 启动定位打卡服务（独立项目 checkin-service/）
```bash
cd ../checkin-service

# 启动服务（需部署到公网服务器）
node server.js

# 生成打卡链接
node server.js --generate --name="纯真年代书吧" --lng=120.14873 --lat=30.25954 --host=https://your-domain.com

# 查询打卡结果
node server.js --status=<sessionId>
```

### 4. 在 AI 助手中使用

安装为 Skill 后，直接在对话中使用：

```
用户：我想在杭州玩一个悬疑主题的CityWalk，大概2小时
AI：好的！让我为你设计一场杭州悬疑CityWalk……
```

## 支持的主题

| 主题 | 风格 | POI 类型编码 | 适合人群 |
|------|------|-------------|---------|
| 🔍 悬疑侦探 | 追踪线索、层层推理 | 140100\|140200\|140600 | 喜欢解谜的玩家 |
| 💕 浪漫爱情 | 情书追踪、甜蜜任务 | 050500\|050600\|140600 | 情侣约会 |
| 🍜 美食探索 | 隐藏美味、味觉挑战 | 050000\|050100\|050300 | 吃货一族 |
| 🏛️ 历史穿越 | 文物追踪、历史拼图 | 110000\|110100\|140100 | 历史文化爱好者 |
| 🎨 文艺清新 | 城市手账、艺术收集 | 140600\|140300\|060000 | 文艺青年 |

## 技术实现

### 调用的高德开放平台能力

| API | 用途 | 端点 |
|-----|------|------|
| POI 搜索 | 搜索真实的故事场景地点 | `/v3/place/text` |
| 路径规划 | 规划步行路线串联各站点 | `/v3/direction/walking` |
| 天气查询 | 获取天气辅助出行建议 | `/v3/weather/weatherInfo` |
| 地图可视化 | 生成可交互的路线地图链接 | `travel_plan.html` |

### 项目结构

```
amap-citywalk-mystery/
├── SKILL.md                        # Skill 核心指令文件（AI 阅读）
├── index.js                        # 核心模块（POI搜索/路径规划/地图生成）
├── scripts/
│   ├── search-locations.js         # POI 搜索脚本
│   ├── plan-route.js               # 路径规划脚本
│   ├── generate-map.js             # 地图可视化生成脚本
│   ├── check-weather.js            # 天气查询脚本
├── assets/
│   ├── workflow.svg                # Skill 执行流程图
│   ├── themes.svg                  # 五大主题卡片
│   └── architecture.svg            # 技术架构图
├── demo_output.txt                 # Demo: 杭州悬疑「西湖迷踪」
├── demo_beijing_history.txt        # Demo: 北京历史「皇城秘史」
├── demo_chengdu_food.txt           # Demo: 成都美食「蜀味寻踪」
├── demo_shanghai_romance.txt       # Demo: 上海浪漫「沪上情书」
├── demo_guangzhou_art.txt          # Demo: 广州文艺「羊城手账」
├── demo_interactive_flow.txt       # Demo: 三重验证互动对话流程（GPS+拍照+答题）
├── config.example.json             # 配置模板
├── package.json                    # 依赖配置
└── README.md                       # 本文件
```

## 使用教程

### 典型部署方式

本 Skill 的典型使用场景是：**部署 OpenClaw 到服务器 → 通过聊天工具接入**

```
┌──────────┐     ┌──────────────┐     ┌────────────┐
│  用户手机  │────→│ 微信/QQ/飞书  │────→│  OpenClaw   │
│          │←────│  /钉钉 聊天   │←────│  远程服务器  │
└──────────┘     └──────────────┘     └────────────┘
  发送位置/拍照/文字          AI + Skill 运行
```

### 在 OpenClaw 中使用

```bash
# 1. 在远程服务器上部署 OpenClaw 并安装此 Skill
cp -r amap-citywalk-mystery/ ~/openclaw-workspace/skills/

# 2. 配置高德 API Key
cd ~/openclaw-workspace/skills/amap-citywalk-mystery/
cp config.example.json config.json
# 编辑 config.json 填入 Key

# 3. 将 OpenClaw 接入微信/QQ/飞书/钉钉
# （参考 OpenClaw 官方文档配置消息通道）
```

用户通过聊天工具直接对话即可开始游戏：
```
帮我生成一个北京的浪漫CityWalk剧本
```

### 在 Cursor 中使用

```bash
# 放到项目的 .cursor/skills 目录
mkdir -p .cursor/skills
ln -s /path/to/amap-citywalk-mystery .cursor/skills/amap-citywalk-mystery
```

## License

MIT

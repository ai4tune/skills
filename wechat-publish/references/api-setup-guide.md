# 微信公众号 API 配置与部署指南

## 概述

本指南帮你完成从零到自动发布的全部配置。完成后，你的 Skill 可以直接调用微信 API 创建草稿、预览和发布。

## 第一步：获取 AppID 和 AppSecret

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入「设置与开发」→「基本配置」
3. 记录 **AppID（应用ID）**
4. 点击「重置」获取 **AppSecret（应用密钥）**

> ⚠️ **AppSecret 只显示一次**，请立即保存到安全位置。丢失后只能重置。

```yaml
# 配置示例
wechat_api:
  app_id: "wx1234567890abcdef"
  app_secret: "your_app_secret_here"   # 切勿提交到代码仓库！
```

## 第二步：配置 IP 白名单

微信 API 只允许白名单内的 IP 地址调用。这是最常踩的坑。

1. 在「基本配置」页面找到「IP 白名单」
2. 添加你服务器的**公网 IP 地址**

### 🚨 坑点：动态 IP 问题

**问题**：如果你使用本地部署或普通云服务器，IP 可能在重启后变化。一旦 IP 不在白名单内，所有 API 调用都会失败。

**解决方案**：使用腾讯云函数 SCF + 固定弹性 IP

```
你的应用 → 腾讯云函数（SCF） → 固定弹性 IP → 微信 API
```

#### 配置步骤：

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 创建云函数（Serverless Cloud Function）
3. 为云函数绑定 **NAT 网关 + 弹性公网 IP（EIP）**
4. 将该固定 IP 加入微信公众号白名单
5. 通过云函数转发所有微信 API 请求

> ✅ 一次配置，永久生效。IP 地址不会再变化。

### 备选方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| 腾讯云 SCF + EIP | IP 固定，免运维 | 需要腾讯云账号 |
| 固定 IP 云服务器 | 简单直接 | 需要持续运行服务器，有成本 |
| Cloudflare Workers | 免费额度大 | 配置较复杂，IP 不固定 |

## 第三步：获取 Access Token

所有 API 调用都需要 `access_token`，有效期 2 小时。

```
GET https://api.weixin.qq.com/cgi-bin/token
  ?grant_type=client_credential
  &appid={APP_ID}
  &secret={APP_SECRET}
```

**返回示例**：
```json
{
  "access_token": "ACCESS_TOKEN_VALUE",
  "expires_in": 7200
}
```

> ⚠️ **Token 管理要点**：
> - Token 有效期 7200 秒（2 小时），需定时刷新
> - 每日调用上限 2000 次
> - 建议本地缓存 Token，过期前 5 分钟刷新

## 第四步：核心 API 接口

### 创建草稿

```
POST https://api.weixin.qq.com/cgi-bin/draft/add
  ?access_token={ACCESS_TOKEN}

Body:
{
  "articles": [{
    "title": "文章标题",
    "author": "作者",
    "digest": "摘要",
    "content": "<p>HTML 格式正文</p>",
    "thumb_media_id": "封面图素材ID",
    "need_open_comment": 1,
    "only_fans_can_comment": 0
  }]
}
```

### 上传封面图

```
POST https://api.weixin.qq.com/cgi-bin/material/add_material
  ?access_token={ACCESS_TOKEN}
  &type=image

Form: multipart/form-data
  media: [图片文件]
```

> 📐 **封面图尺寸要求**：
> - 推荐比例：21:9（900×383 像素）
> - 文件大小：≤ 10MB
> - 格式：JPG / PNG

### 预览文章

```
POST https://api.weixin.qq.com/cgi-bin/message/mass/preview
  ?access_token={ACCESS_TOKEN}

Body:
{
  "touser": "接收者的 OpenID",
  "mpnews": {
    "media_id": "草稿素材ID"
  },
  "msgtype": "mpnews"
}
```

### 群发（直接发布）

```
POST https://api.weixin.qq.com/cgi-bin/message/mass/sendall
  ?access_token={ACCESS_TOKEN}

Body:
{
  "filter": {
    "is_to_all": true
  },
  "mpnews": {
    "media_id": "草稿素材ID"
  },
  "msgtype": "mpnews"
}
```

> 🛑 **群发操作不可撤回！** 发布前务必预览确认。

## 第五步：封面图生成 API 配置

### 方案一：Nano Banana Pro（推荐）

```yaml
cover_image:
  provider: "nano_banana_pro"
  api_key: "your_api_key"
  default_style: "professional"
  size: "900x383"
```

### 方案二：即梦 Seedream

```yaml
cover_image:
  provider: "jimeng_seedream"
  api_key: "your_api_key"
  model: "seedream-5.0"
  size: "900x383"
```

### 方案三：手动上传

直接在对话中发送图片给 AI，AI 会自动裁剪为 21:9 比例并上传。

## 常见问题 FAQ

### Q1：API 调用返回 40164 "invalid ip"
**原因**：你的服务器 IP 不在白名单中
**解决**：检查当前公网 IP，添加到微信后台白名单

### Q2：Access Token 频繁失效
**原因**：可能有多个应用同时刷新 Token，导致旧 Token 被覆盖
**解决**：使用统一的 Token 管理服务，避免多处同时刷新

### Q3：草稿创建成功但看不到
**原因**：草稿需要在公众号后台的「草稿箱」中查看
**解决**：登录 mp.weixin.qq.com → 内容管理 → 草稿箱

### Q4：封面图上传失败
**原因**：图片超过 10MB 或格式不支持
**解决**：压缩图片到 10MB 以下，使用 JPG 或 PNG 格式

### Q5：如何在手机端审核发布？
**步骤**：
1. 下载「微信公众号助手」App
2. 登录你的公众号账号
3. 在 App 中查看草稿
4. 预览并确认发布

> 💡 **全程手机操作**：选题（5分钟）→ AI 创作（自动）→ 手机审核发布（2分钟）

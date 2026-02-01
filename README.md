# Simple Commercial Blog Generator

这是为您定制的简易博客生成系统。

## 目录结构

- `article/`: 存放您的 Markdown (.md) 文章。
- `assets/`: CSS 样式和图片资源。
- `build.js`: 生成 HTML 的核心脚本。
- `template.html`: 网站 HTML 模板。
- `package.json`: 项目配置。

## 如何使用

1. **写文章**: 在 `article/` 目录下创建新的 `.md` 文件。
   文件头部必须包含 Front Matter (元数据):
   ```yaml
   ---
   title: "文章标题"
   date: "2024-02-01"
   description: "文章简短描述"
   ---
   ```
   如果是"关于我"等独立页面，请添加 `type: "page"` 以避免出现在文章列表中。

2. **生成网站**:
   在终端运行:
   ```bash
   npm run build
   ```
   这不仅仅是转换 Markdown，它会：
   - 将 MD 转换为 HTML
   - 套用商业风格模板
   - 自动生成首页 (`index.html`) 列表

3. **发布**:
   将所有生成的 `.html` 文件提交到 GitHub 仓库即可。

## 文档转换能力

您提到的核心需求"将MD文档转化为HTML"已完全集成在 `npm run build` 命令中。您只需关注 `article` 文件夹的内容即可。

## 修改样式

- 修改布局: `template.html`
- 修改样式: `assets/css/style.css`

# 如何导入谷歌书签

## 导出 Chrome/Edge 书签

1. **打开浏览器书签管理器**
   - Chrome: 按 `Ctrl + Shift + O` 或访问 `chrome://bookmarks/`
   - Edge: 按 `Ctrl + Shift + O` 或访问 `edge://favorites/`

2. **导出书签**
   - 点击右上角的三个点 `⋮` 菜单
   - 选择 "导出书签" (Export bookmarks)
   - 保存 HTML 文件到本地

3. **导入到 iLinks**
   - 在 iLinks 首页点击 "导入谷歌书签" 按钮
   - 选择刚才导出的 HTML 文件
   - 书签文件夹将自动转换为分类卡片

## 书签文件结构

导出的 HTML 文件结构如下：

```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3>文件夹名称</H3>
    <DL><p>
        <DT><A HREF="https://example.com">链接标题</A>
        <DT><A HREF="https://example2.com">链接标题2</A>
    </DL><p>
</DL><p>
```

## 功能特性

- ✅ 自动解析书签文件夹结构
- ✅ 支持嵌套文件夹（子文件夹会被展平）
- ✅ 每个文件夹转换为一个分类卡片
- ✅ 导入的书签保存在浏览器本地存储
- ✅ 支持添加、删除书签
- ✅ 支持折叠/展开分类

## 注意事项

- 只有包含链接的文件夹才会被导入
- 空文件夹会被自动忽略
- 导入的书签会保存在浏览器的 localStorage 中
- 清除浏览器数据会删除导入的书签

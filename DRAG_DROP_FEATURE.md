# 拖拽排序功能说明

## ✨ 新功能：拖拽调整文件夹顺序

现在您可以通过拖拽来调整导入的书签文件夹的显示顺序了！

## 🎯 功能特性

### 1. 拖拽排序
- 🖱️ **鼠标拖拽**: 点击并按住任意导入的文件夹卡片，拖动到想要的位置
- 📍 **实时预览**: 拖拽时卡片会变半透明并缩小，提供视觉反馈
- 💾 **自动保存**: 调整顺序后自动保存到 localStorage

### 2. 视觉提示
- ⋮⋮ **拖拽图标**: 导入的文件夹左侧显示拖拽手柄图标（GripVertical）
- 🎨 **拖拽状态**: 正在拖拽的卡片会显示半透明效果（opacity: 50%）
- 📏 **缩放效果**: 拖拽时卡片轻微缩小（scale: 95%）
- 🖱️ **鼠标样式**: 鼠标悬停时显示 `cursor-move`

### 3. 只对导入的文件夹生效
- ✅ **导入的文件夹**: 可以拖拽排序
- ❌ **默认分类**: 保持固定位置，不可拖拽

## 🚀 使用方法

1. **导入书签文件夹**
   - 点击"导入谷歌书签"按钮
   - 选择书签 HTML 文件
   - 文件夹会显示在页面顶部

2. **调整顺序**
   - 找到想要移动的文件夹
   - 点击并按住文件夹卡片
   - 拖动到目标位置
   - 松开鼠标完成排序

3. **查看效果**
   - 文件夹顺序立即更新
   - 刷新页面后顺序保持不变

## 💻 技术实现

### 拖拽 API
使用 HTML5 原生拖拽 API：
- `draggable`: 标记元素可拖拽
- `onDragStart`: 开始拖拽时记录索引
- `onDragOver`: 拖拽经过时重新排序
- `onDragEnd`: 结束拖拽时清除状态

### 状态管理
```typescript
const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

const handleDragStart = (index: number) => {
  setDraggedIndex(index);
};

const handleDragOver = (e: React.DragEvent, index: number) => {
  e.preventDefault();
  if (draggedIndex === null || draggedIndex === index) return;
  
  // 重新排序
  const newFolders = [...importedFolders];
  const draggedItem = newFolders[draggedIndex];
  newFolders.splice(draggedIndex, 1);
  newFolders.splice(index, 0, draggedItem);
  
  setImportedFolders(newFolders);
  setDraggedIndex(index);
  localStorage.setItem('importedBookmarks', JSON.stringify(newFolders));
};
```

### 视觉反馈
```tsx
<div
  draggable
  className={`transition-all duration-200 ${
    draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'
  } cursor-move`}
>
  <CategorySection isDraggable={true} />
</div>
```

## 🎨 UI 设计

### 拖拽图标
- 图标：`GripVertical` (⋮⋮)
- 颜色：`text-white/50`
- 位置：文件夹图标左侧

### 拖拽状态
- **正常状态**: 完全不透明，正常大小
- **拖拽中**: 50% 透明度，95% 缩放
- **过渡动画**: 200ms 平滑过渡

## 📝 注意事项

1. **只对导入的文件夹生效**
   - 默认分类（AI、电影电视等）不可拖拽
   - 只有通过"导入谷歌书签"添加的文件夹可以排序

2. **顺序持久化**
   - 调整后的顺序保存在 localStorage
   - 刷新页面后顺序保持不变
   - 清除浏览器数据会重置顺序

3. **性能优化**
   - 使用 CSS 过渡动画，流畅自然
   - 拖拽时实时更新，无延迟

## 🔮 未来优化

- [ ] 添加拖拽时的占位符效果
- [ ] 支持键盘快捷键调整顺序
- [ ] 添加"重置顺序"按钮
- [ ] 支持默认分类的拖拽排序
- [ ] 添加拖拽音效和触觉反馈

---

享受您的新拖拽排序功能！🎉

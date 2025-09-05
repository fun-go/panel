<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { NIcon, NButton, NCard, NBreadcrumb, NBreadcrumbItem, NTooltip, NInput } from 'naive-ui'
import {
  Folder, File, Search, FileAlt, FileArchive, FileAudio, FileCode, FileExcel,
  FileImage, FilePdf, FilePowerpoint, FileVideo, FileWord, Html5, Css3Alt, Js, Vuejs,
  Java, Python, Php, Swift, Rust, FileCsv, Sass, Git, GitAlt, Docker, Yarn,
  Database, Server, Redo
} from '@vicons/fa'

interface FileItem {
  name: string
  type: 'folder' | 'file'
  size?: string
  modified: string
  selected?: boolean
}

// 当前路径
const currentPath = ref('/home/user/documents')

// 搜索关键词
const searchQuery = ref('')

// 面包屑路径
const breadcrumbItems = reactive([
  { name: 'home', path: '/home' },
  { name: 'user', path: '/home/user' },
  { name: 'documents', path: '/home/user/documents' }
])

// 格式化数字，确保两位数显示
const formatNumber = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`
}

// 生成100个文件用于展示效果
const generateFileList = () => {
  const fileList: FileItem[] = []

  // 添加一些文件夹
  fileList.push(
    { name: 'Projects', type: 'folder', modified: '2023-05-10 14:30' },
    { name: 'Documents', type: 'folder', modified: '2023-05-12 09:15' },
    { name: 'Images', type: 'folder', modified: '2023-05-11 16:45' },
    { name: 'Videos', type: 'folder', modified: '2023-05-09 10:20' },
    { name: 'Music', type: 'folder', modified: '2023-05-08 16:30' },
    { name: 'Downloads', type: 'folder', modified: '2023-05-13 11:45' },
    { name: 'Desktop', type: 'folder', modified: '2023-05-14 09:15' },
    { name: 'Public', type: 'folder', modified: '2023-05-07 13:20' }
  )

  // 添加一些文件
  const files: FileItem[] = [
    { name: 'README.md', type: 'file', size: '1.2 KB', modified: '2023-05-01 09:30' },
    { name: 'package.json', type: 'file', size: '2.1 KB', modified: '2023-05-02 14:15' },
    { name: 'main.ts', type: 'file', size: '0.8 KB', modified: '2023-05-03 10:45' },
    { name: 'App.vue', type: 'file', size: '5.3 KB', modified: '2023-05-04 16:20' },
    { name: 'index.html', type: 'file', size: '0.3 KB', modified: '2023-05-05 11:30' },
    { name: 'style.css', type: 'file', size: '1.5 KB', modified: '2023-05-06 13:45' },
    { name: 'data.csv', type: 'file', size: '3.2 MB', modified: '2023-05-07 09:15' },
    { name: 'report.docx', type: 'file', size: '25 KB', modified: '2023-05-08 15:30' },
    { name: 'presentation.pptx', type: 'file', size: '120 KB', modified: '2023-05-09 10:20' },
    { name: 'manual.pdf', type: 'file', size: '512 KB', modified: '2023-05-10 14:45' },
    { name: 'song.mp3', type: 'file', size: '4.2 MB', modified: '2023-05-11 18:10' },
    { name: 'video.mp4', type: 'file', size: '25.7 MB', modified: '2023-05-12 20:05' },
    { name: 'photo.jpg', type: 'file', size: '3.5 MB', modified: '2023-05-13 12:30' },
    { name: 'logo.png', type: 'file', size: '1.2 MB', modified: '2023-05-14 08:45' },
    { name: 'archive.zip', type: 'file', size: '15.3 MB', modified: '2023-05-15 16:50' },
    { name: 'script.js', type: 'file', size: '2.8 KB', modified: '2023-05-16 11:20' },
    { name: 'data.xlsx', type: 'file', size: '1.8 MB', modified: '2023-05-17 14:35' },
    { name: 'diagram.svg', type: 'file', size: '0.5 MB', modified: '2023-05-18 09:10' }
  ]

  // 添加文件到列表
  fileList.push(...files)

  // 添加额外的文件以达到100个
  const extensions = ['txt', 'md', 'js', 'ts', 'vue', 'json', 'css', 'html', 'pdf', 'docx', 'xlsx', 'jpg', 'png', 'gif', 'zip', 'rar']
  const sizes = ['1.2 KB', '2.1 KB', '0.8 KB', '5.3 KB', '0.3 KB', '1.5 MB', '3.2 MB', '25 KB', '120 KB', '512 KB']

  for (let i = 1; i <= 74; i++) {
    const ext = extensions[Math.floor(Math.random() * extensions.length)]
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    const hours = Math.floor(Math.random() * 24)
    const minutes = Math.floor(Math.random() * 60)

    fileList.push({
      name: `file${i}.${ext}`,
      type: 'file',
      size: size,
      modified: `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())} ${formatNumber(hours)}:${formatNumber(minutes)}`
    })
  }

  return fileList
}

// 获取文件对应的图标
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''

  switch (ext) {
    case 'md':
    case 'txt':
      return FileAlt
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return FileArchive
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return FileAudio
    case 'js':
      return Js
    case 'ts':
    case 'tsx':
      return FileCode
    case 'vue':
      return Vuejs
    case 'html':
    case 'htm':
      return Html5
    case 'css':
      return Css3Alt
    case 'scss':
    case 'sass':
      return Sass
    case 'java':
      return Java
    case 'py':
      return Python
    case 'php':
      return Php
    case 'swift':
      return Swift
    case 'rs':
      return Rust
    case 'xls':
    case 'xlsx':
      return FileExcel
    case 'csv':
      return FileCsv
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return FileImage
    case 'pdf':
      return FilePdf
    case 'ppt':
    case 'pptx':
      return FilePowerpoint
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
      return FileVideo
    case 'doc':
    case 'docx':
      return FileWord
    case 'git':
    case 'gitignore':
    case 'gitconfig':
      return Git
    case 'gitlab-ci.yml':
      return GitAlt
    case 'dockerfile':
    case 'dockerignore':
      return Docker
    case 'yarn.lock':
    case 'yarnrc':
      return Yarn
    case 'db':
    case 'sqlite':
    case 'sql':
      return Database
    case 'conf':
    case 'config':
    case 'ini':
    case 'yaml':
    case 'yml':
      return Server
    default:
      return File
  }
}

// 检查文件是否有缩略图
const hasThumbnail = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
  return imageExts.indexOf(ext) !== -1 || videoExts.indexOf(ext) !== -1
}

// 获取缩略图URL
const getThumbnailUrl = (fileName: string) => {
  // 在实际应用中，这里应该返回真实的缩略图URL
  // 目前使用占位符图片
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']

  if (imageExts.indexOf(ext) !== -1) {
    // 对于图片文件，返回图片本身的小图
    return `/thumbnails/${fileName}?size=thumb`
  } else {
    // 对于视频文件，返回第一帧图片
    return `/thumbnails/${fileName}?frame=0`
  }
}

// 文件列表
const fileList = ref<FileItem[]>(generateFileList())

// 框选相关
const isSelecting = ref(false)
const selectionStart = ref({ x: 0, y: 0 })
const selectionEnd = ref({ x: 0, y: 0 })
const selectionBox = ref({ top: 0, left: 0, width: 0, height: 0 })
const fileGridRef = ref<HTMLElement | null>(null)

// 计算过滤后的文件列表
const filteredFileList = computed(() => {
  if (!searchQuery.value) {
    return fileList.value
  }

  const query = searchQuery.value.toLowerCase()
  return fileList.value.filter((item: FileItem) =>
    item.name.toLowerCase().indexOf(query) !== -1
  )
})

// 面包屑导航点击事件
function handleBreadcrumbClick(path: string) {
  currentPath.value = path
  // 这里可以添加实际的目录切换逻辑
}

// 文件/文件夹点击事件
function handleItemClick(item: FileItem) {
  if (item.type === 'folder') {
    // 模拟进入文件夹
    const newPath = `${currentPath.value}/${item.name}`
    currentPath.value = newPath
    breadcrumbItems.push({ name: item.name, path: newPath })

    // 模拟加载新目录下的文件
    if (item.name === 'Projects') {
      fileList.value = [
        { name: 'MyProject1', type: 'folder', modified: '2023-05-10 14:30' },
        { name: 'MyProject2', type: 'folder', modified: '2023-05-11 09:15' },
        { name: 'todo.txt', type: 'file', size: '0.5 KB', modified: '2023-05-09 11:20' }
      ]
    } else if (item.name === 'Documents') {
      fileList.value = [
        { name: 'Work', type: 'folder', modified: '2023-05-10 14:30' },
        { name: 'Personal', type: 'folder', modified: '2023-05-11 09:15' },
        { name: 'notes.docx', type: 'file', size: '25 KB', modified: '2023-05-09 11:20' },
        { name: 'resume.pdf', type: 'file', size: '120 KB', modified: '2023-05-12 10:30' }
      ]
    } else if (item.name === 'Images') {
      fileList.value = [
        { name: 'screenshot.png', type: 'file', size: '1.2 MB', modified: '2023-05-10 14:30' },
        { name: 'photo.jpg', type: 'file', size: '3.5 MB', modified: '2023-05-11 09:15' }
      ]
    }
  }
}

// 开始框选
const startSelection = (event: MouseEvent) => {
  isSelecting.value = true
  selectionStart.value = { x: event.clientX, y: event.clientY }
  selectionEnd.value = { x: event.clientX, y: event.clientY }
  updateSelectionBox()
}

// 更新框选
const updateSelection = (event: MouseEvent) => {
  if (!isSelecting.value) return

  selectionEnd.value = { x: event.clientX, y: event.clientY }
  updateSelectionBox()
}

// 结束框选
const endSelection = () => {
  if (!isSelecting.value) return

  isSelecting.value = false
  // 这里可以添加选择项目逻辑
}

// 更新选择框位置和大小
function updateSelectionBox() {
  const start = selectionStart.value
  const end = selectionEnd.value

  selectionBox.value = {
    top: Math.min(start.y, end.y),
    left: Math.min(start.x, end.x),
    width: Math.abs(start.x - end.x),
    height: Math.abs(start.y - end.y)
  }
}

// 切换文件选择状态
function toggleFileSelection(item: FileItem) {
  item.selected = !item.selected
}

// 刷新文件列表
function refreshFileList() {
  // 模拟刷新操作
  console.log('刷新文件列表')
  // 实际项目中这里会重新加载文件列表
}

onMounted(() => {
  if (fileGridRef.value) {
    fileGridRef.value.addEventListener('mousedown', startSelection as EventListener)
    document.addEventListener('mousemove', updateSelection as EventListener)
    document.addEventListener('mouseup', endSelection as EventListener)
  }
})

onUnmounted(() => {
  if (fileGridRef.value) {
    fileGridRef.value.removeEventListener('mousedown', startSelection as EventListener)
    document.removeEventListener('mousemove', updateSelection as EventListener)
    document.removeEventListener('mouseup', endSelection as EventListener)
  }
})
</script>

<template>
  <div class="file-manager">
    <!-- 顶部工具栏：路径在左，搜索在右 -->
    <div class="toolbar">
      <div class="path-navigation">
        <span style="margin-right: 10px;"></span>
        <n-breadcrumb>
          <n-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" @click="handleBreadcrumbClick(item.path)">
            {{ item.name }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>

      <div class="search-container">
        <n-input v-model:value="searchQuery" placeholder="搜索文件..." clearable>
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
          <n-button  @click="refreshFileList">
      <n-icon :component="Redo" />
    </n-button>
    </div>
    <!-- 文件图标视图 -->
    <div ref="fileGridRef" class="file-grid">
      <div v-for="item in filteredFileList" :key="item.name" class="file-item" :class="{ selected: item.selected }"
        @click="handleItemClick(item)" @click.ctrl="toggleFileSelection(item)">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="file-icon-container">
              <template v-if="item.type === 'folder'">
                <n-icon :component="Folder" class="file-icon" :class="{ 'folder-icon': item.type === 'folder' }" />
              </template>
              <template v-else-if="hasThumbnail(item.name)">
                <img :src="getThumbnailUrl(item.name)" :alt="item.name" class="file-thumbnail" />
              </template>
              <template v-else>
                <n-icon :component="getFileIcon(item.name)" class="file-icon" />
              </template>
            </div>
          </template>
          <div>
            <div>Name: {{ item.name }}</div>
            <div v-if="item.size">Size: {{ item.size }}</div>
            <div>Modified: {{ item.modified }}</div>
          </div>
        </n-tooltip>
        <div class="file-name">{{ item.name }}</div>
      </div>
    </div>

    <!-- 选择框 -->
    <div v-show="isSelecting && selectionBox.width > 5 && selectionBox.height > 5" class="selection-box" :style="{
      top: selectionBox.top + 'px',
      left: selectionBox.left + 'px',
      width: selectionBox.width + 'px',
      height: selectionBox.height + 'px'
    }"></div>
  </div>
</template>

<style scoped>
.file-manager {
  height: 100%;
  background-color: #fff;
  position: relative;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}

.path-navigation {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  flex: 1;
  min-width: 0;
  /* 允许收缩 */
  height: 34px;
  /* 与搜索框高度一致 */
}

.search-container {
  width: 200px;
}

.file-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  user-select: none;
  height: calc(100% - 50px);
  min-width: 0;
  overflow-y: auto;
  /* 启用垂直滚动 */

  /* 隐藏滚动条 - Webkit浏览器 */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  /* 隐藏滚动条 - Firefox */
  scrollbar-width: none;

  /* 隐藏滚动条 - IE/Edge */
  -ms-overflow-style: none;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  position: relative;
  z-index: 2;
}


.file-item.selected {
  background-color: #e0f0ff;
  outline: 2px solid #409eff;
}

.file-icon-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.file-icon {
  font-size: 36px;
  color: #909399;
  width: 100%;
  height: 100%;
}

.folder-icon {
  color: #409eff;
}

.file-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-name {
  font-size: 12px;
  text-align: center;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.selection-box {
  position: fixed;
  border: 2px dashed #409eff;
  background-color: rgba(64, 158, 255, 0.2);
  z-index: 1;
  pointer-events: none;
}
</style>
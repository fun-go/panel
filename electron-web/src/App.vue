<script setup lang="ts">
import { type MenuOption, NIcon, NMenu, NSelect, NConfigProvider } from 'naive-ui'
import { MinusRound, CloseRound, SettingsRound, TerminalRound, SecurityRound } from "@vicons/material"
import { Database, Docker,Folder,Server ,NetworkWired,TachometerAlt} from "@vicons/fa"
import { h, type Component } from 'vue'
import FileManager from './components/FileManager.vue'
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const themeOverrides = {
  Menu: {
    itemHeight:"29px"
  }
}

const menuOptions: MenuOption[] = [
    {
    key: 'the-godfather-part-iv',
    icon: renderIcon(TachometerAlt)
  },
  {
    key: 'the-godfather-part-ii',
    icon: renderIcon(Docker)
  },
    {
    key: 'the-godfather-part-iii',
    icon: renderIcon(NetworkWired)
  },
  {
    key: 'hear-the-wind-sing',
    icon: renderIcon(Folder)
  },
  {
    key: 'a-wild-sheep-chase',
    icon: renderIcon(TerminalRound)
  },
    {
    key: 'the-godfather',
    icon: renderIcon(Database)
  },
  {
    key: 'the-wizard-of-oz',
    icon: renderIcon(SecurityRound)
  },
  {
    key: 'pinball-1973',
    icon: renderIcon(SettingsRound)
  }
]

// 选择框选项
const selectOptions = [
  {
    label: '选项一',
    value: 'option1'
  },
  {
    label: '选项二',
    value: 'option2'
  },
  {
    label: '选项三',
    value: 'option3'
  }
]

// 窗口控制函数（需要在 Electron 环境中实现具体功能）
function minimizeWindow() {
  console.log('最小化窗口')
  // 在 Electron 中需要通过 IPC 调用主进程方法
  window.electron.ipcRenderer.send('window-minimize')
}

function closeWindow() {
  console.log('关闭窗口')
  // 在 Electron 中需要通过 IPC 调用主进程方法
  window.electron.ipcRenderer.send('window-close')
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="background-container">
      <!-- 顶部导航条 -->
      <div class="top-bar">
        <div class="top-bar-left">
          <!-- 苹果风格的窗口控制按钮 -->
          <div class="window-controls">
            <button class="window-control-btn close-btn" @click="closeWindow"></button>
            <button class="window-control-btn minimize-btn" @click="minimizeWindow"></button>
            <button class="window-control-btn disabled-btn" disabled></button>
          </div>
        </div>
        <div class="top-bar-right">
          <div class="server-selector" style="display:flex;align-items: center;">
            <n-icon :component="Server" color="#000" size="20"/>
            <p style="color:#000">免费服务器</p>
          </div>
        </div>
      </div>

      <div class="glass-menu">
        <n-menu :collapsed="true" :collapsed-width="45" :options="menuOptions" :collapsed-icon-size="15" :default-value="'the-godfather-part-iv'" />
      </div>
      <div class="gradient-overlay">
        <FileManager />
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped>
.background-container {
  width: 950px;
  height: 700px;
  background-size: cover;
  background-position: center;
  display: flex;
  position: relative;
  background-color: #ffffff; /* 白色背景 */
}

/* 顶部导航条样式 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #ffffff; /* 白色顶部导航条 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  -webkit-app-region: drag;
  /* 支持窗口拖拽 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加阴影以增强层次感 */
  border-bottom: 1px solid #e0e0e0; /* 添加底部边框 */
}

.top-bar-left {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  /* 防止图标和选择框影响拖拽 */
  padding-left: 10px;
}

.top-bar-right {
  display: flex;
  -webkit-app-region: no-drag;
  /* 防止按钮影响拖拽 */
  padding-right: 10px;
}

/* 苹果风格的窗口控制按钮 */
.window-controls {
  display: flex;
  gap: 8px;
}

.window-control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
}

.close-btn {
  background-color: #ff5f56;
}

.minimize-btn {
  background-color: #ffbd2e;
}

.disabled-btn {
  background-color: #cccccc;
  cursor: not-allowed;
}

.close-btn:hover:not(:disabled) {
  background-color: #ff3b30;
}

.minimize-btn:hover:not(:disabled) {
  background-color: #ffb400;
}

.glass-menu {
  width: 45px;
  background: #ffffff; /* 浅灰色背景 */
  z-index: 10;
  margin-top: 40px;
  /* 为顶部导航条留出空间 */
  border-right: 1px solid #e0e0e0; /* 添加右边框 */
}

/* 使用深度选择器穿透样式，确保背景色透明 */
:deep(.n-base-selection .n-base-selection-label) {
  background-color: transparent !important;
}

:deep(.n-base-selection-input__content) {
  color: #000000 !important;
}

.server-selector:hover {
  background-color: #EAF5EF;
  cursor: pointer;
}

.server-selector:hover p {
  color: #18A058 !important;
}

:deep(.server-selector:hover .n-icon) {
  color: #18A058 !important;
}

:deep(.server-selector:hover .n-icon svg) {
  color: #18A058 !important;
  fill: #18A058 !important;
}

.server-selector {
  height: 30px;
  margin:0 4px;
  padding:0 4px;
  border-radius: 5px;
  gap: 4px;
}

.gradient-overlay {
  flex: 1;
  background: #ffffff; /* 白色背景 */
  margin: 0;
  border-radius: 0;
  margin-top: 40px;
  /* 为顶部导航条留出空间 */
  padding: 16px;
  border-top: 1px solid #e0e0e0; /* 添加顶部边框 */
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
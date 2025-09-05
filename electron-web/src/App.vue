<script setup lang="ts">
import { ref, computed } from 'vue'
import { type MenuOption, NIcon, NMenu, NSelect, NConfigProvider,NMessageProvider } from 'naive-ui'
import { MinusRound, CloseRound, SettingsRound, TerminalRound, SecurityRound } from "@vicons/material"
import { Database, Docker, Folder, Server, NetworkWired, TachometerAlt } from "@vicons/fa"
import { h, type Component } from 'vue'
import FileManager from './components/FileManager.vue'
import DockerManager from './components/DockerManager.vue'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const themeOverrides = {
  Menu: {
    itemHeight: "29px"
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

// 当前激活的菜单项
const activeMenu = ref('hear-the-wind-sing')

// 计算当前应该显示的组件
const currentComponent = computed(() => {
  switch (activeMenu.value) {
    case 'the-godfather-part-ii':
      return DockerManager
    case 'hear-the-wind-sing':
    default:
      return FileManager
  }
})

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
    <n-message-provider>
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
              <n-icon :component="Server" color="#000" size="20" />
              <p style="color:#000">免费服务器</p>
            </div>
          </div>
        </div>

        <div class="glass-menu">
          <n-menu :collapsed="true" :collapsed-width="45" :options="menuOptions" :collapsed-icon-size="15"
            :default-value="'hear-the-wind-sing'" v-model:value="activeMenu" />
        </div>
        <div class="gradient-overlay">
          <component :is="currentComponent" />
        </div>
      </div>
    </n-message-provider>
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
  background-color: #ffffff;
  /* 白色背景 */
}

/* 顶部导航条样式 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #ffffff;
  /* 白色顶部导航条 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  -webkit-app-region: drag;
  /* 支持窗口拖拽 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 添加阴影以增强层次感 */
  border-bottom: 1px solid #e0e0e0;
  /* 添加底部边框 */
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
  align-items: center;
  padding-right: 10px;
  -webkit-app-region: no-drag;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
}

.close-btn {
  background-color: #ff5f56;
}

.close-btn:hover {
  background-color: #ff3b30;
}

.minimize-btn {
  background-color: #ffbd2e;
}

.minimize-btn:hover {
  background-color: #ffb400;
}

.disabled-btn {
  background-color: #cccccc;
  cursor: not-allowed;
}

.server-selector {
  display: flex;
  align-items: center;
  gap: 5px;
}

.glass-menu {
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 0;
  width: 45px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
  padding-top: 10px;
}

.gradient-overlay {
  position: absolute;
  left: 45px;
  top: 40px;
  right: 0;
  bottom: 0;
  padding: 20px;
  overflow: hidden;
}
</style>
<script setup lang="ts">
import { type MenuOption, NIcon, NMenu, NSelect } from 'naive-ui'
import { AcUnitRound, MinusRound, CloseRound } from "@vicons/material"
import { h, type Component } from 'vue'
import bg from "./assets/bg.jpg"

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: renderIcon(AcUnitRound)
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    icon: renderIcon(AcUnitRound),
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat'
      }
    ]
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true,
    icon: renderIcon(AcUnitRound)
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
  // window.electron.ipcRenderer.send('window-minimize')
}

function closeWindow() {
  console.log('关闭窗口')
  // 在 Electron 中需要通过 IPC 调用主进程方法
  // window.electron.ipcRenderer.send('window-close')
}
</script>

<template>
  <div class="background-container" :style="{backgroundImage: `url(${bg})`}">
    <!-- 顶部导航条 -->
    <div class="top-bar">
      <div class="top-bar-left">
        <img src="https://minio.cyi.cc/ssl/system/image/icon.png" class="custom-icon" alt="icon" />
        <n-select 
          :options="selectOptions" 
          defaultValue="option1" 
          style="width: 150px; margin-left: 10px;"
          size="small"
        />
      </div>
      <div class="top-bar-right">
        <button class="window-control-btn minimize-btn" @click="minimizeWindow">
          <n-icon :component="MinusRound"/>
        </button>
        <button class="window-control-btn close-btn" @click="closeWindow">
          <n-icon :component="CloseRound"/>
        </button>
      </div>
    </div>
    
    <div class="glass-menu">
      <n-menu
        :collapsed="true"
        :collapsed-width="64"
        :options="menuOptions"
      />
    </div>
    <div class="gradient-overlay">
      <h1>111111</h1>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  width: 950px;
  height: 700px;
  background-size: cover;
  background-position: center;
  display: flex;
  position: relative;
}

/* 顶部导航条样式 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  -webkit-app-region: drag; /* 支持窗口拖拽 */
}

.custom-icon {
  height: 30px;
  width: 30px;
  margin-left: 10px;
  object-fit: contain;
}

.top-bar-left {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag; /* 防止图标和选择框影响拖拽 */
}

.menu-icon {
  color: white;
  margin-left: 5px;
}

.top-bar-right {
  display: flex;
  -webkit-app-region: no-drag; /* 防止按钮影响拖拽 */
}

.window-control-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.window-control-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.minimize-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background-color: #e81123;
}

.glass-menu {
  width: 64px;
  background: linear-gradient(to right, rgba(25, 25, 25, 0.3), rgba(40, 40, 40, 0.3));
  backdrop-filter: blur(40px);
  z-index: 10;
  margin-top: 50px; /* 为顶部导航条留出空间 */
}

.gradient-overlay {
  flex: 1;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(40px);
  margin: 0;
  border-radius: 0;
  margin-top: 50px; /* 为顶部导航条留出空间 */
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
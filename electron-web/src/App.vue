<script setup lang="ts">
import { MenuOption,NIcon,NMenu } from 'naive-ui'
import {AcUnitRound} from "@vicons/material"
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
</script>

<template>
  <div class="background-container" :style="{backgroundImage: `url(${bg})`}">
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
  width: 1000px;
  height: 800px;
  background-size: cover;
  background-position: center;
  display: flex;
  position: relative;
}

.glass-menu {
  width: 64px;
  background: linear-gradient(to right, rgba(25, 25, 25, 0.3), rgba(40, 40, 40, 0.3));
  backdrop-filter: blur(40px);
  z-index: 10;
}

.gradient-overlay {
  flex: 1;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(40px);
  margin: 0;
  border-radius: 0;
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
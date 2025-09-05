<template>
  <div class="docker-manager">
    <n-card :bordered="false" style="height: 100%;">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <n-button type="primary" @click="handleCreateContainer">
            <template #icon>
              <n-icon :component="Plus" />
            </template>
            创建容器
          </n-button>
          <n-button @click="handleRefresh">
            <template #icon>
              <n-icon :component="Redo" />
            </template>
            刷新
          </n-button>
        </div>
        
        <div class="toolbar-right">
          <n-input 
            v-model:value="searchQuery" 
            placeholder="搜索容器..." 
            clearable
            style="width: 200px;"
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>
      </div>

      <!-- 容器卡片网格 -->
      <div class="container-grid">
        <div 
          v-for="container in filteredContainers" 
          :key="container.id"
          class="container-card"
        >
          <n-card :bordered="true" class="card-content">
            <div class="card-header">
              <div class="container-icon">
                <n-icon 
                  :component="container.status === 'running' ? Play : Stop"
                  :color="container.status === 'running' ? '#63e2b7' : '#ccc'"
                  size="24"
                />
              </div>
              <div class="container-name">
                {{ container.name }}
              </div>
              <div class="container-status" :class="container.status">
                {{ getStatusText(container.status) }}
              </div>
            </div>
            
            <div class="card-body">
              <div class="container-info">
                <div class="info-row">
                  <span class="info-label">镜像:</span>
                  <span class="info-value">{{ container.image }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">端口:</span>
                  <span class="info-value">{{ container.ports }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">创建时间:</span>
                  <span class="info-value">{{ container.created }}</span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <n-button 
                size="small" 
                :type="container.status === 'running' ? 'error' : 'primary'"
                @click="handleToggleContainer(container)"
              >
                {{ container.status === 'running' ? '停止' : '启动' }}
              </n-button>
              <n-button 
                size="small" 
                type="info" 
                @click="handleInspectContainer(container)"
              >
                详情
              </n-button>
              <n-button 
                size="small" 
                type="error" 
                @click="handleRemoveContainer(container)"
              >
                删除
              </n-button>
            </div>
          </n-card>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <n-pagination 
          v-model:page="currentPage" 
          :page-count="pageCount" 
          :page-sizes="[10, 20, 30]"
          show-size-picker
          show-quick-jumper
        />
      </div>
    </n-card>

    <!-- 创建容器对话框 -->
    <n-modal v-model:show="showCreateModal" preset="dialog" title="创建容器">
      <n-form :model="containerForm" :rules="containerRules" ref="formRef">
        <n-form-item label="镜像名称" path="image">
          <n-input v-model:value="containerForm.image" placeholder="例如: nginx:latest" />
        </n-form-item>
        <n-form-item label="容器名称" path="name">
          <n-input v-model:value="containerForm.name" placeholder="例如: my-nginx" />
        </n-form-item>
        <n-form-item label="端口映射" path="ports">
          <n-dynamic-input v-model:value="containerForm.ports" preset="pair" key-placeholder="主机端口" value-placeholder="容器端口" />
        </n-form-item>
        <n-form-item label="环境变量" path="env">
          <n-dynamic-input v-model:value="containerForm.env" preset="pair" key-placeholder="键" value-placeholder="值" />
        </n-form-item>
        <n-form-item label="卷映射" path="volumes">
          <n-dynamic-input v-model:value="containerForm.volumes" preset="pair" key-placeholder="主机路径" value-placeholder="容器路径" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showCreateModal = false">取消</n-button>
        <n-button type="primary" @click="submitContainerForm" :loading="creating">创建</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,h } from 'vue'
import { 
  NButton, 
  NCard, 
  NIcon, 
  NInput, 
  NModal, 
  NForm, 
  NFormItem, 
  NDynamicInput,
  NPagination,
  useMessage
} from 'naive-ui'
import { 
  Plus, 
  Redo, 
  Search,
  Play,
  Stop,
  Trash,
  Eye
} from '@vicons/fa'

// 类型定义
interface Container {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'paused' | 'restarting' | 'exited' | ''
  ports: string
  created: string
}

// 表格列定义
const columns = [
  {
    title: '容器名称',
    key: 'name',
    render(row: Container) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NIcon, { 
          component: row.status === 'running' ? Play : Stop,
          style: { 
            color: row.status === 'running' ? '#63e2b7' : '#ccc',
            marginRight: '8px' 
          }
        }),
        h('span', row.name)
      ])
    }
  },
  {
    title: '镜像',
    key: 'image'
  },
  {
    title: '状态',
    key: 'status',
    render(row: Container) {
      const statusMap: Record<string, { text: string, color: string }> = {
        running: { text: '运行中', color: '#63e2b7' },
        stopped: { text: '已停止', color: '#ccc' },
        paused: { text: '已暂停', color: '#f2c97d' },
        restarting: { text: '重启中', color: '#3399ff' },
        exited: { text: '已退出', color: '#ff6666' }
      }
      
      const status = statusMap[row.status] || { text: row.status, color: '#ccc' }
      return h('span', { style: { color: status.color } }, status.text)
    }
  },
  {
    title: '端口',
    key: 'ports'
  },
  {
    title: '创建时间',
    key: 'created'
  },
  {
    title: '操作',
    key: 'actions',
    render(row: Container) {
      return h('div', { style: { display: 'flex', gap: '8px' } }, [
        h(NButton, {
          size: 'small',
          type: row.status === 'running' ? 'error' : 'primary',
          onClick: () => handleToggleContainer(row)
        }, {
          default: () => row.status === 'running' ? '停止' : '启动'
        }),
        h(NButton, {
          size: 'small',
          type: 'info',
          onClick: () => handleInspectContainer(row)
        }, {
          default: () => '详情',
          icon: () => h(NIcon, { component: Eye })
        }),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleRemoveContainer(row)
        }, {
          default: () => '删除',
          icon: () => h(NIcon, { component: Trash })
        })
      ])
    }
  }
]

// 数据和状态
const containers = ref<Container[]>([])
const loading = ref(false)
const creating = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showCreateModal = ref(false)
const formRef = ref()
const message = useMessage()

// 表单数据
const containerForm = ref({
  image: '',
  name: '',
  ports: [{ key: '', value: '' }],
  env: [{ key: '', value: '' }],
  volumes: [{ key: '', value: '' }]
})

// 表单验证规则
const containerRules = {
  image: {
    required: true,
    message: '请输入镜像名称',
    trigger: 'blur'
  },
  name: {
    required: true,
    message: '请输入容器名称',
    trigger: 'blur'
  }
}

// 计算属性
const filteredContainers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return containers.value.filter((container: Container) => 
    container.name.toLowerCase().indexOf(query) !== -1 || 
    container.image.toLowerCase().indexOf(query) !== -1
  )
})

const pageCount = computed(() => {
  return Math.ceil(filteredContainers.value.length / pageSize.value)
})


// 方法
const fetchContainers = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    containers.value = generateMockContainers()
    loading.value = false
  }, 500)
}

// 模拟数据
const generateMockContainers = () => {
  return [
    {
      id: '1',
      name: 'nginx-server',
      image: 'nginx:latest',
      status: 'running',
      ports: '80:80, 443:443',
      created: '2023-05-10 14:30'
    },
    {
      id: '2',
      name: 'mysql-db',
      image: 'mysql:8.0',
      status: 'running',
      ports: '3306:3306',
      created: '2023-05-11 09:15'
    },
    {
      id: '3',
      name: 'redis-cache',
      image: 'redis:alpine',
      status: 'stopped',
      ports: '6379:6379',
      created: '2023-05-12 16:45'
    },
    {
      id: '4',
      name: 'mongo-db',
      image: 'mongo:latest',
      status: 'running',
      ports: '27017:27017',
      created: '2023-05-13 10:20'
    },
    {
      id: '5',
      name: 'node-app',
      image: 'node:16',
      status: 'exited',
      ports: '3000:3000',
      created: '2023-05-14 11:30'
    }
  ]
}


const handleRefresh = () => {
  fetchContainers()
  message.success('刷新成功')
}

const handleCreateContainer = () => {
  showCreateModal.value = true
  // 重置表单
  containerForm.value = {
    image: '',
    name: '',
    ports: [{ key: '', value: '' }],
    env: [{ key: '', value: '' }],
    volumes: [{ key: '', value: '' }]
  }
}

const submitContainerForm = (e: Event) => {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      creating.value = true
      // 模拟创建容器
      setTimeout(() => {
        creating.value = false
        showCreateModal.value = false
        message.success('容器创建成功')
        fetchContainers()
      }, 1000)
    } else {
      message.error('请填写必填字段')
    }
  })
}

const handleToggleContainer = (container: Container) => {
  message.info(`正在${container.status === 'running' ? '停止' : '启动'}容器 ${container.name}`)
  // 模拟API调用
  setTimeout(() => {
    const index = containers.value.findIndex((c: Container) => c.id === container.id)
    if (index !== -1) {
      containers.value[index].status = container.status === 'running' ? 'stopped' : 'running'
      message.success(`${container.status === 'running' ? '停止' : '启动'}成功`)
    }
  }, 500)
}

const handleInspectContainer = (container: Container) => {
  message.info(`查看容器 ${container.name} 详情`)
}

const handleRemoveContainer = (container: Container) => {
  message.info(`正在删除容器 ${container.name}`)
  // 模拟API调用
  setTimeout(() => {
    containers.value = containers.value.filter((c: Container) => c.id !== container.id)
    message.success(`容器 ${container.name} 删除成功`)
  }, 500)
}

// 生命周期
onMounted(() => {
  fetchContainers()
})
</script>

<style scoped>
.docker-manager {
  height: 100%;
  background-color: #fff;
  position: relative;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.container-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  height: calc(100% - 120px);
  overflow-y: auto;
}

.container-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.container-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.container-icon {
  margin-right: 10px;
}

.container-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
}

.container-status.running {
  background-color: #63e2b7;
}

.container-status.stopped {
  background-color: #ccc;
}

.container-status.paused {
  background-color: #f2c97d;
}

.container-status.restarting {
  background-color: #3399ff;
}

.container-status.exited {
  background-color: #ff6666;
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.container-info .info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  width: 70px;
  font-size: 12px;
  color: #666;
}

.info-value {
  flex: 1;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
<template>
  <div class="app" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="status-announcer"></div>
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-mark">C</div>
        <div class="logo-text" v-show="!sidebarCollapsed">
          <span class="logo-name">{{ t('nav.companyName') }}</span>
          <span class="logo-subtitle">{{ t('nav.subtitle') }}</span>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="sidebar-nav">
        <router-link to="/" class="sidebar-link" :class="{ active: $route.path === '/' }" :title="t('nav.overview')" :aria-current="$route.path === '/' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.overview') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.overview') }}</span>
        </router-link>

        <router-link to="/inventory" class="sidebar-link" :class="{ active: $route.path === '/inventory' }" :title="t('nav.inventory')" :aria-current="$route.path === '/inventory' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.inventory') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.inventory') }}</span>
        </router-link>

        <router-link to="/orders" class="sidebar-link" :class="{ active: $route.path === '/orders' }" :title="t('nav.orders')" :aria-current="$route.path === '/orders' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.orders') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.orders') }}</span>
        </router-link>

        <router-link to="/spending" class="sidebar-link" :class="{ active: $route.path === '/spending' }" :title="t('nav.finance')" :aria-current="$route.path === '/spending' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.finance') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.finance') }}</span>
        </router-link>

        <router-link to="/demand" class="sidebar-link" :class="{ active: $route.path === '/demand' }" :title="t('nav.demandForecast')" :aria-current="$route.path === '/demand' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.demandForecast') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.demandForecast') }}</span>
        </router-link>

        <router-link to="/reports" class="sidebar-link" :class="{ active: $route.path === '/reports' }" title="Reports" :aria-current="$route.path === '/reports' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">Reports</span>
          <span v-if="sidebarCollapsed" class="sr-only">Reports</span>
        </router-link>

        <router-link to="/restocking" class="sidebar-link" :class="{ active: $route.path === '/restocking' }" :title="t('nav.restocking')" :aria-current="$route.path === '/restocking' ? 'page' : undefined">
          <span class="nav-icon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.66"/></svg>
          </span>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ t('nav.restocking') }}</span>
          <span v-if="sidebarCollapsed" class="sr-only">{{ t('nav.restocking') }}</span>
        </router-link>
      </nav>

      <!-- Bottom utilities -->
      <div class="sidebar-bottom">
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>

      <!-- Collapse toggle at very bottom -->
      <button class="sidebar-toggle" @click="toggleSidebar" :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg v-if="sidebarCollapsed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    </aside>

    <div class="main-content">
      <FilterBar />
      <router-view />
    </div>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    const sidebarCollapsed = ref(false)
    const toggleSidebar = () => { sidebarCollapsed.value = !sidebarCollapsed.value }

    // Auto-collapse below 768px — non-obvious: we collapse on resize but don't
    // re-expand automatically to respect manual user preference above the breakpoint
    const handleResize = () => {
      if (window.innerWidth < 768) sidebarCollapsed.value = true
    }

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(() => {
      loadTasks()
      handleResize()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => window.removeEventListener('resize', handleResize))

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      sidebarCollapsed,
      toggleSidebar
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #f8fafc;
}

/* ── Sidebar ── */
.sidebar {
  width: 220px;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.2s ease;
  z-index: 100;
}

.sidebar-collapsed .sidebar {
  width: 60px;
}

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #1e293b;
  overflow: hidden;
  flex-shrink: 0;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.logo-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: #64748b;
  line-height: 1.2;
}

/* Nav */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0.5rem;
  gap: 2px;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.15s, color 0.15s;
}

.sidebar-link:hover {
  background: #1e293b;
  color: #e2e8f0;
}

.sidebar-link.active {
  background: #1d4ed8;
  color: white;
}

.nav-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Bottom utilities */
.sidebar-bottom {
  padding: 0.75rem 0.5rem;
  border-top: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-shrink: 0;
}

/* Collapse toggle */
.sidebar-toggle {
  width: 100%;
  padding: 0.625rem;
  background: transparent;
  border: none;
  border-top: 1px solid #1e293b;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.sidebar-toggle:hover {
  background: #1e293b;
  color: #e2e8f0;
}

/* Main content */
.main-content {
  flex: 1;
  min-width: 0;
  padding: 1.5rem 2rem;
  overflow-x: auto;
}

/* Collapsed: center icons */
.sidebar-collapsed .sidebar-link {
  justify-content: center;
  padding: 0.625rem;
}

.sidebar-collapsed .sidebar-logo {
  justify-content: center;
  padding: 1.25rem 0;
}

.sidebar-collapsed .sidebar-bottom {
  align-items: center;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: #64748b;
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: #ea580c;
}

.stat-card.success .stat-value {
  color: #059669;
}

.stat-card.danger .stat-value {
  color: #dc2626;
}

.stat-card.info .stat-value {
  color: #2563eb;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: #d1fae5;
  color: #065f46;
}

.badge.warning {
  background: #fed7aa;
  color: #92400e;
}

.badge.danger {
  background: #fecaca;
  color: #991b1b;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.badge.increasing {
  background: #d1fae5;
  color: #065f46;
}

.badge.decreasing {
  background: #fecaca;
  color: #991b1b;
}

.badge.stable {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.high {
  background: #fecaca;
  color: #991b1b;
}

.badge.medium {
  background: #fed7aa;
  color: #92400e;
}

.badge.low {
  background: #dbeafe;
  color: #1e40af;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }

  .nav-label,
  .logo-text {
    display: none;
  }

  .sidebar-link {
    justify-content: center;
    padding: 0.625rem;
  }

  .sidebar-logo {
    justify-content: center;
    padding: 1.25rem 0;
  }

  .sidebar-bottom {
    align-items: center;
  }
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}
</style>

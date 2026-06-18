import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001/api'

// Map of endpoint URL (with query params) → AbortController
// If the same URL is requested again before the previous call completes,
// the in-flight request is aborted to prevent stale data races.
const pendingControllers = new Map()

function makeRequest(url, options = {}) {
  // Abort any in-flight request for this exact URL
  if (pendingControllers.has(url)) {
    pendingControllers.get(url).abort()
  }

  const controller = new AbortController()
  pendingControllers.set(url, controller)

  return axios.get(url, { ...options, signal: controller.signal })
    .then(response => {
      // Clean up the controller entry once the request succeeds
      pendingControllers.delete(url)
      return response
    })
    .catch(err => {
      if (axios.isCancel(err) || err.name === 'AbortError' || err.name === 'CanceledError') {
        // Aborted request — return null so callers can skip state updates
        return null
      }
      pendingControllers.delete(url)
      throw err
    })
}

export const api = {
  async getInventory(filters = {}) {
    const params = new URLSearchParams()
    if (filters.warehouse && filters.warehouse !== 'all') params.append('warehouse', filters.warehouse)
    if (filters.category && filters.category !== 'all') params.append('category', filters.category)

    const url = `${API_BASE_URL}/inventory?${params.toString()}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getInventoryItem(id) {
    const url = `${API_BASE_URL}/inventory/${id}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getOrders(filters = {}) {
    const params = new URLSearchParams()
    if (filters.warehouse && filters.warehouse !== 'all') params.append('warehouse', filters.warehouse)
    if (filters.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters.month && filters.month !== 'all') params.append('month', filters.month)

    const url = `${API_BASE_URL}/orders?${params.toString()}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getOrder(id) {
    const url = `${API_BASE_URL}/orders/${id}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getDemandForecasts() {
    const url = `${API_BASE_URL}/demand`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getBacklog() {
    const url = `${API_BASE_URL}/backlog`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getDashboardSummary(filters = {}) {
    const params = new URLSearchParams()
    if (filters.warehouse && filters.warehouse !== 'all') params.append('warehouse', filters.warehouse)
    if (filters.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters.month && filters.month !== 'all') params.append('month', filters.month)

    const url = `${API_BASE_URL}/dashboard/summary?${params.toString()}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getSpendingSummary() {
    const url = `${API_BASE_URL}/spending/summary`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getMonthlySpending() {
    const url = `${API_BASE_URL}/spending/monthly`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getCategorySpending() {
    const url = `${API_BASE_URL}/spending/categories`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getTransactions() {
    const url = `${API_BASE_URL}/spending/transactions`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getTasks() {
    const url = `${API_BASE_URL}/tasks`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async createTask(taskData) {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData)
    return response.data
  },

  async deleteTask(taskId) {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`)
    return response.data
  },

  async toggleTask(taskId) {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}`)
    return response.data
  },

  async createPurchaseOrder(purchaseOrderData) {
    const response = await axios.post(`${API_BASE_URL}/purchase-orders`, purchaseOrderData)
    return response.data
  },

  async getPurchaseOrderByBacklogItem(backlogItemId) {
    const url = `${API_BASE_URL}/purchase-orders/${backlogItemId}`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async getRestockingOrders() {
    const url = `${API_BASE_URL}/restocking-orders`
    const response = await makeRequest(url)
    return response ? response.data : null
  },

  async createRestockingOrder(data) {
    const response = await axios.post(`${API_BASE_URL}/restocking-orders`, data)
    return response.data
  }
}

<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('nav.restocking') }}</h2>
      <p>Recommend items to restock based on demand forecasts and available budget.</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>

      <!-- Success Banner -->
      <div v-if="submittedOrder" class="success-banner">
        Order <strong>{{ submittedOrder.order_number }}</strong> submitted &mdash;
        expected delivery {{ formatDate(submittedOrder.expected_delivery) }}
      </div>

      <!-- Submit Error -->
      <div v-if="submitError" class="submit-error">{{ submitError }}</div>

      <!-- Budget Slider Card -->
      <div class="card budget-card">
        <div class="card-header">
          <h3 class="card-title">Available Budget</h3>
        </div>
        <div class="budget-controls">
          <div class="budget-slider-row">
            <label class="budget-label" for="budget-slider">
              Available Budget
            </label>
            <span class="budget-value">{{ formatCurrency(budget) }}</span>
          </div>
          <input
            id="budget-slider"
            type="range"
            class="budget-slider"
            :min="0"
            :max="500000"
            :step="5000"
            v-model.number="budget"
          />
          <div class="budget-range-labels">
            <span>$0</span>
            <span>$500,000</span>
          </div>
        </div>
      </div>

      <!-- Recommended Items Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recommended Items</h3>
          <button
            class="place-order-btn"
            :disabled="recommendedItems.length === 0 || submitting"
            @click="placeOrder"
          >
            {{ submitting ? 'Submitting...' : 'Place Order' }}
          </button>
        </div>

        <div v-if="recommendedItems.length === 0" class="empty-state">
          No items fit the current budget. Increase the budget to see recommendations.
        </div>

        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Trend</th>
                <th>Qty to Order</th>
                <th>Unit Cost</th>
                <th>Item Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendedItems" :key="item.sku">
                <td><strong>{{ item.sku }}</strong></td>
                <td>{{ item.name }}</td>
                <td>
                  <span :class="['badge', item.trend]">
                    {{ capitalize(item.trend) }}
                  </span>
                </td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.unit_cost) }}</td>
                <td><strong>{{ formatCurrency(item.item_total) }}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="table-summary">
            <span>
              <strong>{{ recommendedItems.length }}</strong>
              {{ recommendedItems.length === 1 ? 'item' : 'items' }} recommended &mdash;
              <strong>{{ formatCurrency(totalCost) }}</strong> of
              <strong>{{ formatCurrency(budget) }}</strong> budget used
            </span>
            <span class="budget-remaining" :class="{ 'budget-tight': budgetRemaining < 5000 }">
              {{ formatCurrency(budgetRemaining) }} remaining
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { api } from '../api'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t } = useI18n()

    const budget = ref(50000)
    const allForecasts = ref([])
    const inventoryItems = ref([])
    const loading = ref(false)
    const submitting = ref(false)
    const error = ref(null)
    const submitError = ref(null)
    const submittedOrder = ref(null)

    // Build a map of sku -> unit_cost from inventory for O(1) lookups
    const inventoryMap = computed(() => {
      const map = {}
      for (const item of inventoryItems.value) {
        map[item.sku] = item
      }
      return map
    })

    // Sorted candidate list: join forecasts with inventory, skip missing matches
    const sortedCandidates = computed(() => {
      const trendPriority = { increasing: 0, stable: 1, decreasing: 2 }

      const candidates = []
      for (const forecast of allForecasts.value) {
        const inventoryItem = inventoryMap.value[forecast.item_sku]
        if (!inventoryItem) continue

        const unit_cost = inventoryItem.unit_cost
        if (unit_cost == null) continue

        candidates.push({
          sku: forecast.item_sku,
          name: forecast.item_name,
          trend: forecast.trend,
          quantity: forecast.forecasted_demand,
          unit_cost,
          item_total: forecast.forecasted_demand * unit_cost,
          _trendPriority: trendPriority[forecast.trend] ?? 3
        })
      }

      // Sort: trend priority asc, then forecasted_demand desc within same tier
      candidates.sort((a, b) => {
        if (a._trendPriority !== b._trendPriority) {
          return a._trendPriority - b._trendPriority
        }
        return b.quantity - a.quantity
      })

      return candidates
    })

    // Greedy fill: include item if it fits; skip (don't stop) if it doesn't
    const recommendedItems = computed(() => {
      let runningTotal = 0
      const result = []

      for (const candidate of sortedCandidates.value) {
        if (runningTotal + candidate.item_total <= budget.value) {
          runningTotal += candidate.item_total
          result.push(candidate)
        }
        // skip but continue — a cheaper later item might still fit
      }

      return result
    })

    const totalCost = computed(() => {
      return recommendedItems.value.reduce((sum, item) => sum + item.item_total, 0)
    })

    const budgetRemaining = computed(() => {
      return budget.value - totalCost.value
    })

    const loadData = async () => {
      loading.value = true
      error.value = null
      try {
        const [forecastsData, inventoryData] = await Promise.all([
          api.getDemandForecasts(),
          api.getInventory({})
        ])
        allForecasts.value = forecastsData
        inventoryItems.value = inventoryData
      } catch (err) {
        error.value = 'Failed to load restocking data: ' + err.message
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const placeOrder = async () => {
      if (recommendedItems.value.length === 0 || submitting.value) return

      submitting.value = true
      submitError.value = null
      submittedOrder.value = null

      try {
        const payload = {
          items: recommendedItems.value.map(item => ({
            sku: item.sku,
            name: item.name,
            quantity: item.quantity,
            unit_cost: item.unit_cost
          })),
          total_cost: totalCost.value
        }

        const response = await api.createRestockingOrder(payload)
        submittedOrder.value = response
      } catch (err) {
        submitError.value = 'Failed to submit order: ' + (err.response?.data?.detail || err.message)
        console.error(err)
      } finally {
        submitting.value = false
      }
    }

    const formatCurrency = (value) => {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      })
    }

    const formatDate = (str) => {
      const date = new Date(str)
      if (isNaN(date.getTime())) return str
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const capitalize = (str) => {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    onMounted(() => loadData())

    return {
      t,
      budget,
      loading,
      submitting,
      error,
      submitError,
      submittedOrder,
      recommendedItems,
      totalCost,
      budgetRemaining,
      placeOrder,
      formatCurrency,
      formatDate,
      capitalize
    }
  }
}
</script>

<style scoped>
.restocking {
  padding-bottom: 2rem;
}

/* Success Banner */
.success-banner {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.938rem;
}

/* Submit Error */
.submit-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.875rem 1.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.938rem;
}

/* Budget Card */
.budget-card {
  margin-bottom: 1.25rem;
}

.budget-controls {
  padding: 0.5rem 0;
}

.budget-slider-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.budget-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.budget-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}

.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.4);
  transition: box-shadow 0.2s;
}

.budget-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 1px 8px rgba(37, 99, 235, 0.6);
}

.budget-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.4);
}

.budget-range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Place Order Button */
.place-order-btn {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.place-order-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.place-order-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 0.938rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

/* Table Summary Row */
.table-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0.75rem;
  background: #f8fafc;
  border-top: 2px solid #e2e8f0;
  font-size: 0.875rem;
  color: #334155;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.budget-remaining {
  font-size: 0.813rem;
  font-weight: 600;
  color: #059669;
}

.budget-remaining.budget-tight {
  color: #dc2626;
}
</style>

import axios from 'axios';
import { mockStore } from './mockStore';

const isProductionVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && !import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcanteen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: Handle fallback responses when Spring Boot backend is not running or Vercel returns HTML rewrites
function handleMockFallback(url, method, data, params) {
  const cleanUrl = url.replace(/^\/?api\/?/, '/');

  // AUTH
  if (cleanUrl.startsWith('/auth/login') || cleanUrl.startsWith('auth/login')) {
    const email = data?.email || 'admin@smartcanteen.com';
    let role = 'ADMIN';
    let name = 'Canteen Administrator';
    if (email.includes('chef')) { role = 'STAFF'; name = 'Head Chef Ramesh'; }
    if (email.includes('student')) { role = 'STUDENT'; name = 'Aarav Sharma (Student)'; }

    return {
      token: 'demo-jwt-token-' + Date.now(),
      id: 1,
      name,
      email,
      role
    };
  }

  if (cleanUrl.startsWith('/auth/register') || cleanUrl.startsWith('auth/register')) {
    return {
      token: 'demo-jwt-token-' + Date.now(),
      id: Date.now(),
      name: data?.name || 'New User',
      email: data?.email,
      role: data?.role || 'STUDENT'
    };
  }

  if (cleanUrl.startsWith('/auth/me') || cleanUrl.startsWith('auth/me')) {
    const raw = localStorage.getItem('sc_user');
    if (raw) return JSON.parse(raw);
    return {
      id: 1,
      name: 'Canteen Administrator',
      email: 'admin@smartcanteen.com',
      role: 'ADMIN'
    };
  }

  // DASHBOARD
  if (cleanUrl.startsWith('/dashboard/stats') || cleanUrl.startsWith('dashboard/stats')) {
    const plans = mockStore.getPlans();
    const inventory = mockStore.getInventory();
    const lowStock = inventory.filter(i => i.currentStock <= i.minThresholdStock).length;
    const wasteLogs = mockStore.getWasteLogs();
    const totalWasted = wasteLogs.reduce((acc, l) => acc + (l.wastedPortions || 0), 0);
    const costLost = wasteLogs.reduce((acc, l) => acc + (l.estimatedCostLost || 0), 0);

    return {
      totalPreOrdersToday: 48,
      totalAttendingStudentsToday: 185,
      totalDishesPlannedToday: plans.length,
      totalWastedPortionsMonth: totalWasted || 42,
      totalCostLostMonth: costLost || 2730.00,
      wasteReductionRatePercentage: 74.5,
      lowStockInventoryCount: lowStock,
      weeklyDemandVsWaste: [
        { day: 'Mon', date: '2026-10-05', prepared: 260, consumed: 248, wasted: 12 },
        { day: 'Tue', date: '2026-10-06', prepared: 240, consumed: 232, wasted: 8 },
        { day: 'Wed', date: '2026-10-07', prepared: 250, consumed: 244, wasted: 6 },
        { day: 'Thu', date: '2026-10-08', prepared: 270, consumed: 261, wasted: 9 },
        { day: 'Fri', date: '2026-10-09', prepared: 310, consumed: 302, wasted: 8 },
        { day: 'Sat', date: '2026-10-10', prepared: 180, consumed: 175, wasted: 5 },
        { day: 'Sun', date: '2026-10-11', prepared: 130, consumed: 126, wasted: 4 },
      ]
    };
  }

  // FOOD ITEMS
  if (cleanUrl.startsWith('/food-items') || cleanUrl.startsWith('food-items')) {
    const items = mockStore.getFoodItems();
    if (method === 'get') {
      return items;
    }
    if (method === 'post') {
      const newItem = { ...data, id: Date.now() };
      const updated = [...items, newItem];
      mockStore.setFoodItems(updated);
      return newItem;
    }
    if (cleanUrl.includes('toggle-availability')) {
      const id = parseInt(cleanUrl.split('/')[2]);
      const updated = items.map(i => i.id === id ? { ...i, availableToday: !i.availableToday } : i);
      mockStore.setFoodItems(updated);
      return updated.find(i => i.id === id);
    }
    if (method === 'delete') {
      const id = parseInt(cleanUrl.split('/')[2]);
      mockStore.setFoodItems(items.filter(i => i.id !== id));
      return { success: true };
    }
  }

  // INVENTORY
  if (cleanUrl.startsWith('/inventory') || cleanUrl.startsWith('inventory')) {
    const inventory = mockStore.getInventory();
    if (method === 'get') {
      if (cleanUrl.includes('low-stock')) {
        return inventory.filter(i => i.currentStock <= i.minThresholdStock);
      }
      return inventory;
    }
    if (method === 'post') {
      const newItem = { ...data, id: Date.now(), lastRestockedDate: new Date().toISOString().split('T')[0] };
      mockStore.setInventory([...inventory, newItem]);
      return newItem;
    }
    if (method === 'put') {
      const id = parseInt(cleanUrl.split('/')[2]);
      const updated = inventory.map(i => i.id === id ? { ...i, ...data } : i);
      mockStore.setInventory(updated);
      return updated.find(i => i.id === id);
    }
  }

  // PREDICTIONS
  if (cleanUrl.startsWith('/predictions') || cleanUrl.startsWith('predictions')) {
    const items = mockStore.getFoodItems();
    if (method === 'post' || cleanUrl.includes('generate')) {
      const weather = data?.weatherCondition || 'CLEAR';
      const event = data?.specialEvent || 'NORMAL_DAY';
      const date = data?.forecastDate || new Date().toISOString().split('T')[0];
      const meal = data?.mealType || 'LUNCH';

      const weatherFactor = weather === 'RAIN' ? 1.20 : weather === 'EXTREME_HEAT' ? 0.90 : 1.0;
      const eventFactor = event === 'FESTIVAL' ? 1.35 : event === 'SPORTS_DAY' ? 1.40 : event === 'EXAM_WEEK' ? 0.85 : 1.0;

      const generated = items.map(item => {
        const base = item.category === 'LUNCH' ? 110 : 80;
        const predicted = Math.round(base * 1.15 * weatherFactor * eventFactor);
        const minBuffer = Math.round(predicted * 0.88);
        const maxCap = Math.round(predicted * 1.15);
        return {
          id: Date.now() + item.id,
          foodItem: item,
          forecastDate: date,
          mealType: meal,
          historicalAvgQuantity: base,
          dayOfWeekFactor: 1.15,
          weatherFactor: weatherFactor,
          confirmedPreOrders: Math.round(predicted * 0.25),
          attendanceIntentSignals: Math.round(predicted * 0.55),
          predictedQuantity: predicted,
          minBufferQuantity: minBuffer,
          maxCapQuantity: maxCap,
          confidenceScore: 0.93,
          aiReasoning: `AI Model Recommendation: Prepare ${predicted} portions (Safety: ${minBuffer} - ${maxCap}). Incorporated day weights (1.15x), weather multiplier (${weatherFactor.toFixed(2)}x), and event modifier (${eventFactor.toFixed(2)}x).`
        };
      });
      return generated;
    }
    return [];
  }

  // KITCHEN PREP PLANS
  if (cleanUrl.startsWith('/prep-plans') || cleanUrl.startsWith('prep-plans')) {
    const plans = mockStore.getPlans();
    if (method === 'get') {
      return plans;
    }
    if (method === 'post') {
      const items = mockStore.getFoodItems();
      const foodItem = items.find(i => i.id === parseInt(params?.foodItemId)) || items[0];
      const newPlan = {
        id: Date.now(),
        planDate: params?.date || new Date().toISOString().split('T')[0],
        mealType: params?.mealType || 'LUNCH',
        foodItem,
        predictedQuantity: parseInt(params?.predictedQuantity) || 100,
        actualPreparedQuantity: parseInt(params?.predictedQuantity) || 100,
        actualSoldQuantity: 0,
        leftoverQuantity: 0,
        status: 'PLANNED',
        chefNotes: ''
      };
      const updated = [newPlan, ...plans];
      mockStore.setPlans(updated);
      return newPlan;
    }
    if (method === 'patch') {
      const id = parseInt(cleanUrl.split('/')[2]);
      const updated = plans.map(p => p.id === id ? { ...p, ...data } : p);
      mockStore.setPlans(updated);
      return updated.find(p => p.id === id);
    }
  }

  // WASTE LOGS
  if (cleanUrl.startsWith('/waste') || cleanUrl.startsWith('waste')) {
    const logs = mockStore.getWasteLogs();
    if (cleanUrl.includes('recent') || method === 'get') {
      return logs;
    }
    if (method === 'post') {
      const items = mockStore.getFoodItems();
      const foodItem = items.find(i => i.id === parseInt(data?.foodItemId)) || items[0];
      const newLog = {
        id: Date.now(),
        foodItem,
        wasteDate: data?.wasteDate || new Date().toISOString().split('T')[0],
        wastedPortions: parseInt(data?.wastedPortions) || 1,
        wasteReason: data?.wasteReason || 'OVER_PREPARATION',
        estimatedCostLost: (parseInt(data?.wastedPortions) || 1) * (foodItem.prepCostPerPlate || 40),
        loggedBy: 'Kitchen Staff'
      };
      const updated = [newLog, ...logs];
      mockStore.setWasteLogs(updated);
      return newLog;
    }
  }

  // PRE-ORDERS
  if (cleanUrl.startsWith('/preorders') || cleanUrl.startsWith('preorders')) {
    const orders = mockStore.getPreOrders();
    if (cleanUrl.includes('my-orders') || method === 'get') {
      return orders;
    }
    if (method === 'post') {
      const items = mockStore.getFoodItems();
      const foodItem = items.find(i => i.id === parseInt(data?.foodItemId)) || items[0];
      const qty = data?.quantity || 1;
      const newOrder = {
        id: Date.now(),
        foodItem,
        mealDate: data?.mealDate,
        mealType: data?.mealType,
        quantity: qty,
        totalPrice: foodItem.price * qty,
        status: 'CONFIRMED'
      };
      const updated = [newOrder, ...orders];
      mockStore.setPreOrders(updated);
      return newOrder;
    }
  }

  // ATTENDANCE INTENT
  if (cleanUrl.startsWith('/attendance-intent') || cleanUrl.startsWith('attendance-intent')) {
    return { success: true, message: 'Intent recorded' };
  }

  return { success: true };
}

// Response Interceptor: If response is HTML string (Vercel SPA rewrite) or fails, use mock fallback!
api.interceptors.response.use(
  (response) => {
    // If Vercel served index.html instead of a backend JSON API response
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!doctype') || response.data.trim().startsWith('<html') || response.data.trim().startsWith('<!DOCTYPE'))) {
      const fallbackData = handleMockFallback(response.config.url, response.config.method?.toLowerCase(), response.config.data ? JSON.parse(response.config.data) : null, response.config.params);
      return { ...response, data: fallbackData };
    }
    return response;
  },
  (error) => {
    // If backend is offline or network error, transparently return mock data
    console.warn(`[API Bridge] Backend call ${error.config?.url} failed. Serving client-side store:`, error.message);
    const method = error.config?.method?.toLowerCase() || 'get';
    let postData = null;
    try {
      if (error.config?.data) postData = JSON.parse(error.config.data);
    } catch {}
    const fallbackData = handleMockFallback(error.config?.url || '', method, postData, error.config?.params);
    return Promise.resolve({ data: fallbackData, status: 200, statusText: 'OK (Mock Store)' });
  }
);

export default api;

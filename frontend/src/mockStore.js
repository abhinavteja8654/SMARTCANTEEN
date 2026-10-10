// Stateful client-side mock store for Vercel / offline mode

const INITIAL_FOOD_ITEMS = [
  { id: 1, name: 'Hyderabadi Chicken Biryani', category: 'LUNCH', price: 150.0, calories: 650, description: 'Aromatic basmati rice cooked with marinated chicken pieces and whole spices.', prepCostPerPlate: 65.0, prepTimeMinutes: 30, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
  { id: 2, name: 'Paneer Butter Masala with Naan', category: 'LUNCH', price: 130.0, calories: 520, description: 'Rich creamy tomato curry with soft paneer cubes, served with 2 butter naans.', prepCostPerPlate: 50.0, prepTimeMinutes: 20, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500' },
  { id: 3, name: 'Mysore Masala Dosa', category: 'BREAKFAST', price: 70.0, calories: 380, description: 'Crispy golden crepe with spiced potato filling, coconut chutney & sambar.', prepCostPerPlate: 22.0, prepTimeMinutes: 15, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500' },
  { id: 4, name: 'Vegetable Fried Rice & Manchurian', category: 'DINNER', price: 110.0, calories: 480, description: 'Wok-tossed basmati rice with crunchy vegetables paired with spicy veg manchurian.', prepCostPerPlate: 40.0, prepTimeMinutes: 20, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },
  { id: 5, name: 'Crispy Punjabi Samosa (2 pcs)', category: 'SNACKS', price: 40.0, calories: 310, description: 'Golden fried pastry filled with spiced potatoes, green peas and served with mint chutney.', prepCostPerPlate: 14.0, prepTimeMinutes: 15, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' },
  { id: 6, name: 'South Indian Filter Coffee', category: 'BREAKFAST', price: 25.0, calories: 95, description: 'Freshly brewed chicory blend filter coffee with frothy whole milk.', prepCostPerPlate: 9.0, prepTimeMinutes: 10, availableToday: true, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500' }
];

const INITIAL_INVENTORY = [
  { id: 1, name: 'Basmati Rice', currentStock: 120.0, minThresholdStock: 30.0, unit: 'KG', costPerUnit: 65.0, lastRestockedDate: '2026-10-08' },
  { id: 2, name: 'Fresh Chicken', currentStock: 14.0, minThresholdStock: 15.0, unit: 'KG', costPerUnit: 190.0, lastRestockedDate: '2026-10-09' },
  { id: 3, name: 'Paneer (Cottage Cheese)', currentStock: 25.0, minThresholdStock: 10.0, unit: 'KG', costPerUnit: 320.0, lastRestockedDate: '2026-10-08' },
  { id: 4, name: 'Toor Dal / Lentils', currentStock: 48.0, minThresholdStock: 15.0, unit: 'KG', costPerUnit: 140.0, lastRestockedDate: '2026-10-07' },
  { id: 5, name: 'Fresh Onions', currentStock: 75.0, minThresholdStock: 20.0, unit: 'KG', costPerUnit: 35.0, lastRestockedDate: '2026-10-09' },
  { id: 6, name: 'Fresh Tomatoes', currentStock: 18.0, minThresholdStock: 20.0, unit: 'KG', costPerUnit: 40.0, lastRestockedDate: '2026-10-09' },
  { id: 7, name: 'Sunflower Cooking Oil', currentStock: 68.0, minThresholdStock: 25.0, unit: 'LITER', costPerUnit: 130.0, lastRestockedDate: '2026-10-06' }
];

function getStored(key, initial) {
  try {
    const raw = localStorage.getItem(`sc_${key}`);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(`sc_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const mockStore = {
  getFoodItems: () => getStored('food_items', INITIAL_FOOD_ITEMS),
  setFoodItems: (items) => setStored('food_items', items),

  getInventory: () => getStored('inventory', INITIAL_INVENTORY),
  setInventory: (items) => setStored('inventory', items),

  getPlans: () => getStored('prep_plans', [
    {
      id: 1,
      planDate: new Date().toISOString().split('T')[0],
      mealType: 'LUNCH',
      foodItem: INITIAL_FOOD_ITEMS[0],
      predictedQuantity: 130,
      actualPreparedQuantity: 130,
      actualSoldQuantity: 124,
      leftoverQuantity: 6,
      status: 'COMPLETED',
      chefNotes: 'Rain increased footfall as predicted. Minimal leftover recorded.'
    },
    {
      id: 2,
      planDate: new Date().toISOString().split('T')[0],
      mealType: 'LUNCH',
      foodItem: INITIAL_FOOD_ITEMS[1],
      predictedQuantity: 95,
      actualPreparedQuantity: 95,
      actualSoldQuantity: 92,
      leftoverQuantity: 3,
      status: 'COMPLETED',
      chefNotes: 'Good accuracy.'
    },
    {
      id: 3,
      planDate: new Date().toISOString().split('T')[0],
      mealType: 'DINNER',
      foodItem: INITIAL_FOOD_ITEMS[3],
      predictedQuantity: 110,
      actualPreparedQuantity: 110,
      actualSoldQuantity: 0,
      leftoverQuantity: 0,
      status: 'IN_PREPARATION',
      chefNotes: 'Currently cooking batch.'
    }
  ]),
  setPlans: (plans) => setStored('prep_plans', plans),

  getWasteLogs: () => getStored('waste_logs', [
    { id: 1, foodItem: INITIAL_FOOD_ITEMS[0], wasteDate: '2026-10-09', wastedPortions: 6, wasteReason: 'OVER_PREPARATION', estimatedCostLost: 390.0, loggedBy: 'chef@smartcanteen.com' },
    { id: 2, foodItem: INITIAL_FOOD_ITEMS[2], wasteDate: '2026-10-08', wastedPortions: 4, wasteReason: 'EXPIRED', estimatedCostLost: 88.0, loggedBy: 'chef@smartcanteen.com' },
    { id: 3, foodItem: INITIAL_FOOD_ITEMS[3], wasteDate: '2026-10-07', wastedPortions: 8, wasteReason: 'UNCOLLECTED_PREORDER', estimatedCostLost: 320.0, loggedBy: 'staff@smartcanteen.com' }
  ]),
  setWasteLogs: (logs) => setStored('waste_logs', logs),

  getPreOrders: () => getStored('pre_orders', [
    { id: 1, foodItem: INITIAL_FOOD_ITEMS[0], mealDate: new Date().toISOString().split('T')[0], mealType: 'LUNCH', quantity: 2, totalPrice: 300.0, status: 'CONFIRMED' }
  ]),
  setPreOrders: (orders) => setStored('pre_orders', orders),

  getPredictions: () => getStored('predictions', [])
};

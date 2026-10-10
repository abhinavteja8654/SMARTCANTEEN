import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  Layers
} from 'lucide-react';
import api from '../api';

export default function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    currentStock: 50,
    minThresholdStock: 15,
    unit: 'KG',
    costPerUnit: 100
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (err) {
      console.warn('Using default demo inventory', err);
      setItems([
        { id: 1, name: 'Basmati Rice', currentStock: 120.0, minThresholdStock: 30.0, unit: 'KG', costPerUnit: 65.0, lastRestockedDate: '2026-10-08' },
        { id: 2, name: 'Fresh Chicken', currentStock: 14.0, minThresholdStock: 15.0, unit: 'KG', costPerUnit: 190.0, lastRestockedDate: '2026-10-09' },
        { id: 3, name: 'Paneer (Cottage Cheese)', currentStock: 25.0, minThresholdStock: 10.0, unit: 'KG', costPerUnit: 320.0, lastRestockedDate: '2026-10-08' },
        { id: 4, name: 'Toor Dal / Lentils', currentStock: 48.0, minThresholdStock: 15.0, unit: 'KG', costPerUnit: 140.0, lastRestockedDate: '2026-10-07' },
        { id: 5, name: 'Fresh Onions', currentStock: 75.0, minThresholdStock: 20.0, unit: 'KG', costPerUnit: 35.0, lastRestockedDate: '2026-10-09' },
        { id: 6, name: 'Fresh Tomatoes', currentStock: 18.0, minThresholdStock: 20.0, unit: 'KG', costPerUnit: 40.0, lastRestockedDate: '2026-10-09' },
        { id: 7, name: 'Sunflower Cooking Oil', currentStock: 68.0, minThresholdStock: 25.0, unit: 'LITER', costPerUnit: 130.0, lastRestockedDate: '2026-10-06' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRestock = async (item, amount) => {
    try {
      const updated = {
        ...item,
        currentStock: item.currentStock + amount,
        lastRestockedDate: new Date().toISOString().split('T')[0]
      };
      await api.put(`/inventory/${item.id}`, updated);
      fetchInventory();
    } catch (err) {
      // Local fallback
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, currentStock: i.currentStock + amount } : i));
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', newItem);
      setShowAddModal(false);
      setNewItem({ name: '', currentStock: 50, minThresholdStock: 15, unit: 'KG', costPerUnit: 100 });
      fetchInventory();
    } catch (err) {
      setItems(prev => [...prev, { ...newItem, id: Date.now(), lastRestockedDate: new Date().toISOString().split('T')[0] }]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" /> Canteen Raw Material Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracks live warehouse stocks. Ingredients are automatically calculated and deducted per plate from AI-planned recipe specs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInventory}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Material
          </button>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => {
          const isLow = item.currentStock <= item.minThresholdStock;
          const ratio = Math.min(100, (item.currentStock / (item.minThresholdStock * 3)) * 100);

          return (
            <div 
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-xs space-y-3 transition ${
                isLow ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    Threshold: {item.minThresholdStock} {item.unit}
                  </span>
                </div>
                {isLow ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Optimal
                  </span>
                )}
              </div>

              {/* Current Quantity Display */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">{item.currentStock}</span>
                  <span className="text-xs font-semibold text-slate-500 ml-1">{item.unit}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  ₹{item.costPerUnit}/{item.unit}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isLow ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${ratio}%` }}
                />
              </div>

              {/* Quick Restock Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Quick restock:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickRestock(item, 10)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                  >
                    +10 {item.unit}
                  </button>
                  <button
                    onClick={() => handleQuickRestock(item, 25)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                  >
                    +25 {item.unit}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Raw Inventory Material</h3>
            
            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cooking Butter, Potatoes"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starting Stock</label>
                  <input
                    type="number"
                    required
                    value={newItem.currentStock}
                    onChange={(e) => setNewItem({ ...newItem, currentStock: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    required
                    value={newItem.minThresholdStock}
                    onChange={(e) => setNewItem({ ...newItem, minThresholdStock: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="KG">KG</option>
                    <option value="LITER">LITER</option>
                    <option value="PACK">PACK</option>
                    <option value="PIECE">PIECE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Per Unit (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem({ ...newItem, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

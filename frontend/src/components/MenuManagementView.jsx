import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  UtensilsCrossed 
} from 'lucide-react';
import api from '../api';

export default function MenuManagementView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'LUNCH',
    price: 120,
    calories: 450,
    description: '',
    prepCostPerPlate: 40,
    prepTimeMinutes: 25,
    imageUrl: '',
    availableToday: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/food-items');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Using default demo menu items', err);
      setItems([
        { id: 1, name: 'Hyderabadi Chicken Biryani', category: 'LUNCH', price: 150.0, prepCostPerPlate: 65.0, calories: 650, availableToday: true },
        { id: 2, name: 'Paneer Butter Masala with Naan', category: 'LUNCH', price: 130.0, prepCostPerPlate: 50.0, calories: 520, availableToday: true },
        { id: 3, name: 'Mysore Masala Dosa', category: 'BREAKFAST', price: 70.0, prepCostPerPlate: 22.0, calories: 380, availableToday: true },
        { id: 4, name: 'Vegetable Fried Rice & Manchurian', category: 'DINNER', price: 110.0, prepCostPerPlate: 40.0, calories: 480, availableToday: true },
        { id: 5, name: 'Crispy Punjabi Samosa (2 pcs)', category: 'SNACKS', price: 40.0, prepCostPerPlate: 14.0, calories: 310, availableToday: true },
        { id: 6, name: 'South Indian Filter Coffee', category: 'BREAKFAST', price: 25.0, prepCostPerPlate: 9.0, calories: 95, availableToday: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.patch(`/food-items/${item.id}/toggle-availability`);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, availableToday: !i.availableToday } : i));
    } catch (err) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, availableToday: !i.availableToday } : i));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/food-items/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/food-items', newItem);
      setShowAddModal(false);
      fetchItems();
    } catch (err) {
      setItems(prev => [...prev, { ...newItem, id: Date.now() }]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" /> Canteen Menu & Recipe Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure menu items, base plate preparation costs (for waste financial accounting), and toggle daily serving status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Dish to Menu
        </button>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Dish Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Selling Price</th>
                <th className="p-3.5">Prep Cost / Plate</th>
                <th className="p-3.5">Calories</th>
                <th className="p-3.5">Serving Today</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">₹{item.price}</td>
                  <td className="p-3.5 font-semibold text-slate-600">₹{item.prepCostPerPlate || 35}</td>
                  <td className="p-3.5 text-slate-500">{item.calories || 400} kcal</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${
                        item.availableToday 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {item.availableToday ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      {item.availableToday ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Dish to Canteen</h3>
            
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Khichdi & Curd"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meal Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  >
                    <option value="BREAKFAST">BREAKFAST</option>
                    <option value="LUNCH">LUNCH</option>
                    <option value="SNACKS">SNACKS</option>
                    <option value="DINNER">DINNER</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prep Cost / Plate (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.prepCostPerPlate}
                    onChange={(e) => setNewItem({ ...newItem, prepCostPerPlate: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={newItem.calories}
                    onChange={(e) => setNewItem({ ...newItem, calories: parseInt(e.target.value) || 0 })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Ingredients, serving style..."
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
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
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

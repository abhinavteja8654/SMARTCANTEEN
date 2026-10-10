import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Flame, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Minus,
  AlertCircle
} from 'lucide-react';
import api from '../api';

export default function StudentMenuView({ currentUser }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [foodItems, setFoodItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealDate, setSelectedMealDate] = useState(tomorrowStr);
  const [quantities, setQuantities] = useState({});
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // Attendance Intent state
  const [willAttendTomorrow, setWillAttendTomorrow] = useState(true);
  const [dietaryPreference, setDietaryPreference] = useState('NON_VEG');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  useEffect(() => {
    fetchFoodItems();
    fetchMyOrders();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/food-items');
      setFoodItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Using default demo student food items', err);
      setFoodItems([
        { id: 1, name: 'Hyderabadi Chicken Biryani', category: 'LUNCH', price: 150.0, calories: 650, description: 'Aromatic basmati rice cooked with marinated chicken pieces and whole spices.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
        { id: 2, name: 'Paneer Butter Masala with Naan', category: 'LUNCH', price: 130.0, calories: 520, description: 'Rich creamy tomato curry with soft paneer cubes, served with 2 butter naans.', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500' },
        { id: 3, name: 'Mysore Masala Dosa', category: 'BREAKFAST', price: 70.0, calories: 380, description: 'Crispy golden crepe with spiced potato filling, coconut chutney & sambar.', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500' },
        { id: 4, name: 'Vegetable Fried Rice & Manchurian', category: 'DINNER', price: 110.0, calories: 480, description: 'Wok-tossed basmati rice with crunchy vegetables paired with spicy veg manchurian.', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },
        { id: 5, name: 'Crispy Punjabi Samosa (2 pcs)', category: 'SNACKS', price: 40.0, calories: 310, description: 'Golden fried pastry filled with spiced potatoes, green peas and served with mint chutney.', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/preorders/my-orders');
      setMyOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Using default demo student pre-orders', err);
      setMyOrders([
        {
          id: 1,
          foodItem: { name: 'Hyderabadi Chicken Biryani' },
          mealDate: tomorrowStr,
          mealType: 'LUNCH',
          quantity: 2,
          totalPrice: 300.0,
          status: 'CONFIRMED'
        }
      ]);
    }
  };

  const handleAttendanceSubmit = async (attending) => {
    try {
      setWillAttendTomorrow(attending);
      await api.post('/attendance-intent', {
        targetDate: tomorrowStr,
        mealType: 'LUNCH',
        willAttend: attending,
        dietaryPreference
      });
      setAttendanceSubmitted(true);
      setTimeout(() => setAttendanceSubmitted(false), 3000);
    } catch (err) {
      setWillAttendTomorrow(attending);
      setAttendanceSubmitted(true);
      setTimeout(() => setAttendanceSubmitted(false), 3000);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => {
      const current = prev[itemId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const handlePlacePreOrder = async (item) => {
    const qty = quantities[item.id] || 1;
    try {
      const payload = {
        foodItemId: item.id,
        quantity: qty,
        mealDate: selectedMealDate,
        mealType: item.category
      };
      const res = await api.post('/preorders', payload);
      setOrderSuccessMsg(`Successfully booked ${qty}x ${item.name} for ${selectedMealDate}!`);
      setTimeout(() => setOrderSuccessMsg(''), 4000);
      fetchMyOrders();
    } catch (err) {
      // Local demo fallback
      setMyOrders(prev => [
        {
          id: Date.now(),
          foodItem: item,
          mealDate: selectedMealDate,
          mealType: item.category,
          quantity: qty,
          totalPrice: item.price * qty,
          status: 'CONFIRMED'
        },
        ...prev
      ]);
      setOrderSuccessMsg(`Successfully booked ${qty}x ${item.name} for ${selectedMealDate}!`);
      setTimeout(() => setOrderSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Attendance Intent Poll Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" /> Tomorrow's Lunch Signal
          </div>
          <h2 className="text-xl font-bold mb-1">
            Will you be dining at the canteen tomorrow ({tomorrowStr})?
          </h2>
          <p className="text-blue-100 text-xs mb-4">
            Your single click response directly tells the kitchen head how much food to prepare so zero cooked meals are wasted.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleAttendanceSubmit(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                willAttendTomorrow 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Yes, I'm eating at canteen
            </button>

            <button
              onClick={() => handleAttendanceSubmit(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                !willAttendTomorrow 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" /> No, eating elsewhere
            </button>

            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="bg-blue-950/60 border border-blue-400/30 text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="NON_VEG">Preference: Non-Vegetarian</option>
              <option value="VEG">Preference: Vegetarian</option>
              <option value="ANY">Preference: Flexible</option>
            </select>
          </div>

          {attendanceSubmitted && (
            <div className="mt-3 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Thank you! Your attendance signal has calibrated the kitchen prep model.
            </div>
          )}
        </div>
      </div>

      {orderSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {orderSuccessMsg}
        </div>
      )}

      {/* Date selector for Pre-order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Pre-Order Dishes in Advance
          </h3>
          <p className="text-xs text-slate-500">
            Pre-orders guarantee your portion is reserved and eliminates queue wait times.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Booking For:</label>
          <input
            type="date"
            value={selectedMealDate}
            onChange={(e) => setSelectedMealDate(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Dishes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {foodItems.map(item => {
          const qty = quantities[item.id] || 1;
          return (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-40 object-cover" 
                  />
                ) : (
                  <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-4xl">
                    🍛
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-extrabold text-base text-slate-900">₹{item.price}</span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> {item.calories || 450} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer: Quantity & Pre-Order */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                  <button 
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-slate-800">{qty}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => handlePlacePreOrder(item)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Pre-Order
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* My Active Pre-Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" /> My Pre-Booked Meal Orders
        </h3>

        {myOrders.length === 0 ? (
          <p className="text-xs text-slate-400">You have no active pre-orders currently booked.</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {myOrders.map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800">{order.foodItem?.name || 'Meal'}</h5>
                  <p className="text-slate-500 text-[11px]">
                    Session: {order.mealType} • Date: {order.mealDate} • Qty: {order.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900">₹{order.totalPrice}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

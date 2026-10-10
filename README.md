# Smart Canteen System: AI Demand Prediction & Waste Minimization

An intelligent canteen management platform that uses **multi-factor AI demand forecasting** to estimate food requirements, optimize raw inventory stocks, prevent over-preparation, and drastically reduce food wastage.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React (Vite), Tailwind CSS v4, Lucide Icons, Recharts | Responsive chef, admin, and student web application |
| **Backend** | Spring Boot 3.3.4 (Java 17), Spring Security 6, Spring Data JPA | REST APIs, multi-factor AI prediction engine, inventory automation |
| **CLI & Tools** | Spring CLI 3.3.4, Maven Wrapper (`mvnw`), npm | CLI-scaffolded architecture |
| **Security** | Stateless JWT (JJWT 0.12.6) + Role-Based Access Control | Secure endpoints for `ADMIN`, `STAFF`, and `STUDENT` |
| **Database** | MySQL 8.0 (with automated fallback / dev H2 profile) | Persistent relational schema for orders, recipes, inventory, and forecasts |

---

## 📁 Project Structure

```
SMARTCANTEEN/
├── backend/
│   ├── src/main/java/com/smartcanteen/api/
│   │   ├── config/          # SecurityConfig, DataInitializer (Pre-seeds demo data)
│   │   ├── controller/      # REST endpoints (Predictions, PrepPlans, Inventory, Waste, Orders, Auth)
│   │   ├── dto/             # Data transfer objects & simulation requests
│   │   ├── entity/          # JPA entities (User, FoodItem, InventoryItem, RecipeIngredient, etc.)
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT TokenProvider, AuthenticationFilter, UserDetails
│   │   └── service/         # AI PredictionService, InventoryService, PrepPlanService, WasteService
│   ├── src/main/resources/
│   │   ├── application.properties     # Primary MySQL database configuration
│   │   └── application-dev.properties # Embedded H2 mode for offline development
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Navigation tabs & 1-click Demo Role Switcher
│   │   │   ├── DashboardView.jsx      # High-level KPIs, 7-day prepared vs consumed charts
│   │   │   ├── PredictionView.jsx     # AI Demand Simulation (weather, events, pre-orders)
│   │   │   ├── KitchenScheduleView.jsx# Chef daily cooking schedule & inventory deductions
│   │   │   ├── InventoryView.jsx      # Warehouse stock tracking & low-stock alerts
│   │   │   ├── WasteAnalyticsView.jsx # Food waste audit logs & financial loss tracking
│   │   │   ├── StudentMenuView.jsx    # Student RSVP intent & meal pre-ordering portal
│   │   │   ├── MenuManagementView.jsx # Dish catalog & today's serving status
│   │   │   └── LoginModal.jsx         # Sign in / Register / 1-click demo logins
│   │   ├── api.js                     # Axios client with JWT interceptor
│   │   ├── App.jsx
│   │   └── index.css                  # Tailwind CSS styling
│   ├── package.json
│   └── vite.config.js
└── schema.sql                         # MySQL database schema DDL script
```

---

## ⚡ Quick Start Instructions

### 1. Running the Backend (Spring Boot)

Open a terminal in the `backend` folder:

```bash
cd backend

# Option A: Run with default MySQL (configure credentials in application.properties or pass via env vars)
./mvnw.cmd spring-boot:run

# Option B: Run with dev profile (in-memory database, no MySQL required):
./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

The Spring Boot backend will start on: **`http://localhost:8080`**

### 2. Running the Frontend (React + Vite)

Open a second terminal in the `frontend` folder:

```bash
cd frontend
npm run dev
```

The React frontend will start on: **`http://localhost:5173`** (with automatic API proxy to `http://localhost:8080`).

---

## 👥 Pre-Seeded Demo Accounts

You can switch between any role instantly using the **"Demo:" buttons** in the top navigation bar:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Canteen Admin** | `admin@smartcanteen.com` | `Admin@123` | Full access to insights, inventory, menus, and waste audits |
| **Kitchen Chef (Staff)** | `chef@smartcanteen.com` | `Staff@123` | Run AI forecasts, update cooking batches, view inventory |
| **Student (Patron)** | `student@smartcanteen.com` | `Student@123` | Submit attendance intent polls, place meal pre-orders |

---

## 🧠 AI Demand Prediction Algorithm

The prediction engine in [`PredictionService.java`](file:///c:/Users/abhin/Documents/workspace-spring-tools-for-eclipse-5.2.0.RELEASE/SMARTCANTEEN/backend/src/main/java/com/smartcanteen/api/service/PredictionService.java) combines four primary data streams:

1. **Historical Rolling Baseline**: Moving average of past portions consumed for each specific recipe.
2. **Day-of-Week Multiplier**: Canteen footfall curves (e.g. Fridays +25%, Saturdays -30%).
3. **Weather & Event Modifiers**: 
   - Rain: Increases indoor canteen footfall by +20%.
   - Exam week: Shifts meal times and decreases sit-down consumption (-15%).
   - Campus festivals: Anticipates +35% surges.
4. **Active Student Signals**: Direct incorporation of confirmed pre-orders and RSVP attendance intent polls.
5. **Dynamic Safety Buffer & Caps**: Prevents food shortages while capping maximum prepared portions to minimize leftovers.

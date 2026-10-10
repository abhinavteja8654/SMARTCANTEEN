-- Smart Canteen AI Demand Prediction & Inventory Management Schema
CREATE DATABASE IF NOT EXISTS smartcanteen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartcanteen_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    student_or_emp_id VARCHAR(100),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Food Items Catalog
CREATE TABLE IF NOT EXISTS food_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(38,2) NOT NULL,
    calories INT,
    description VARCHAR(1000),
    available_today BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    prep_time_minutes INT DEFAULT 20,
    prep_cost_per_plate DECIMAL(38,2) DEFAULT 35.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Raw Materials Inventory
CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    current_stock DOUBLE NOT NULL,
    min_threshold_stock DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    cost_per_unit DECIMAL(38,2),
    last_restocked_date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Recipe Ingredients Mapping
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    food_item_id BIGINT NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    quantity_per_plate DOUBLE NOT NULL,
    unit VARCHAR(50) NOT NULL,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Student Meal Pre-orders
CREATE TABLE IF NOT EXISTS meal_pre_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    food_item_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    total_price DECIMAL(38,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Student Attendance Intent / Poll
CREATE TABLE IF NOT EXISTS meal_attendance_intents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    will_attend BOOLEAN NOT NULL DEFAULT TRUE,
    dietary_preference VARCHAR(50),
    submitted_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Kitchen Daily Preparation Plans
CREATE TABLE IF NOT EXISTS daily_prep_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    food_item_id BIGINT NOT NULL,
    predicted_quantity INT,
    actual_prepared_quantity INT,
    actual_sold_quantity INT DEFAULT 0,
    leftover_quantity INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PLANNED',
    weather_condition VARCHAR(50) DEFAULT 'CLEAR',
    chef_notes VARCHAR(500),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Food Waste Audit Logs
CREATE TABLE IF NOT EXISTS waste_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    food_item_id BIGINT NOT NULL,
    waste_date DATE NOT NULL,
    wasted_portions INT NOT NULL,
    waste_reason VARCHAR(100) NOT NULL,
    estimated_cost_lost DECIMAL(38,2),
    logged_by VARCHAR(255),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. AI Demand Forecast Cache
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    forecast_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    food_item_id BIGINT NOT NULL,
    historical_avg_quantity INT,
    day_of_week_factor DOUBLE,
    weather_factor DOUBLE,
    confirmed_pre_orders INT,
    attendance_intent_signals INT,
    predicted_quantity INT,
    min_buffer_quantity INT,
    max_cap_quantity INT,
    confidence_score DOUBLE,
    ai_reasoning VARCHAR(1000),
    generated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (food_item_id) REFERENCES food_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

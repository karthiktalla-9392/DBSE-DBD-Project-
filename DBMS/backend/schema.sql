CREATE DATABASE IF NOT EXISTS smart_restaurant_kds;
USE smart_restaurant_kds;

CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  prep_minutes INT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(40) PRIMARY KEY,
  table_no VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100),
  status ENUM('received', 'preparing', 'ready') NOT NULL DEFAULT 'received',
  notes VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ready_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  menu_item_id VARCHAR(40) NOT NULL,
  name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(40) PRIMARY KEY,
  order_id VARCHAR(40),
  table_no VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(30) NOT NULL DEFAULT 'UPI',
  upi_id VARCHAR(100) NOT NULL,
  transaction_ref VARCHAR(100) NOT NULL,
  status ENUM('paid', 'failed', 'refunded') NOT NULL DEFAULT 'paid',
  paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

INSERT INTO menu_items (id, name, category, price, prep_minutes, available) VALUES
('m1', 'Hyderabadi Chicken Biryani', 'Biryani', 240.00, 18, TRUE),
('m2', 'Veg Dum Biryani', 'Biryani', 180.00, 16, TRUE),
('m3', 'Paneer Biryani', 'Biryani', 210.00, 17, TRUE),
('m4', 'Mutton Biryani', 'Biryani', 320.00, 24, TRUE),
('m5', 'Egg Biryani', 'Biryani', 170.00, 14, TRUE),
('m6', 'Family Chicken Biryani', 'Biryani', 560.00, 25, TRUE),
('m7', 'Paneer Tikka', 'Starters', 180.00, 14, TRUE),
('m8', 'Chicken 65', 'Starters', 210.00, 13, TRUE),
('m9', 'Veg Manchurian', 'Starters', 150.00, 11, TRUE),
('m10', 'Gobi Manchurian', 'Starters', 140.00, 11, TRUE),
('m11', 'Chilli Paneer', 'Starters', 190.00, 12, TRUE),
('m12', 'Chicken Lollipop', 'Starters', 230.00, 15, TRUE),
('m13', 'Masala Dosa', 'South Indian', 90.00, 8, TRUE),
('m14', 'Plain Dosa', 'South Indian', 70.00, 7, TRUE),
('m15', 'Idli Sambar', 'South Indian', 60.00, 5, TRUE),
('m16', 'Medu Vada', 'South Indian', 65.00, 6, TRUE),
('m17', 'Poori Bhaji', 'South Indian', 85.00, 8, TRUE),
('m18', 'Onion Uttapam', 'South Indian', 95.00, 10, TRUE),
('m19', 'Veg Fried Rice', 'Rice & Noodles', 140.00, 10, TRUE),
('m20', 'Chicken Fried Rice', 'Rice & Noodles', 180.00, 12, TRUE),
('m21', 'Schezwan Fried Rice', 'Rice & Noodles', 170.00, 12, TRUE),
('m22', 'Veg Noodles', 'Rice & Noodles', 130.00, 10, TRUE),
('m23', 'Chicken Noodles', 'Rice & Noodles', 175.00, 12, TRUE),
('m24', 'Curd Rice', 'Rice & Noodles', 95.00, 4, TRUE),
('m25', 'Paneer Butter Masala', 'Curries', 190.00, 15, TRUE),
('m26', 'Chicken Curry', 'Curries', 230.00, 16, TRUE),
('m27', 'Dal Tadka', 'Curries', 130.00, 12, TRUE),
('m28', 'Butter Chicken', 'Curries', 260.00, 18, TRUE),
('m29', 'Mushroom Masala', 'Curries', 175.00, 14, TRUE),
('m30', 'Mixed Veg Curry', 'Curries', 150.00, 13, TRUE),
('m31', 'Butter Naan', 'Breads', 45.00, 5, TRUE),
('m32', 'Tandoori Roti', 'Breads', 35.00, 4, TRUE),
('m33', 'Garlic Naan', 'Breads', 60.00, 6, TRUE),
('m34', 'Chapati', 'Breads', 25.00, 4, TRUE),
('m35', 'Parotta', 'Breads', 40.00, 5, TRUE),
('m36', 'Cheese Naan', 'Breads', 80.00, 7, TRUE),
('m37', 'Veg Burger', 'Snacks', 110.00, 9, TRUE),
('m38', 'French Fries', 'Snacks', 90.00, 7, TRUE),
('m39', 'Veg Sandwich', 'Snacks', 100.00, 8, TRUE),
('m40', 'Samosa Plate', 'Snacks', 50.00, 5, TRUE),
('m41', 'Gulab Jamun', 'Desserts', 70.00, 4, TRUE),
('m42', 'Chocolate Brownie', 'Desserts', 120.00, 5, TRUE),
('m43', 'Ice Cream Sundae', 'Desserts', 130.00, 4, TRUE),
('m44', 'Rasmalai', 'Desserts', 110.00, 4, TRUE),
('m45', 'Mango Lassi', 'Beverages', 80.00, 3, TRUE),
('m46', 'Fresh Lime Soda', 'Beverages', 70.00, 3, TRUE),
('m47', 'Cold Coffee', 'Beverages', 110.00, 5, TRUE),
('m48', 'Masala Tea', 'Beverages', 35.00, 4, TRUE)
ON DUPLICATE KEY UPDATE
name = VALUES(name),
category = VALUES(category),
price = VALUES(price),
prep_minutes = VALUES(prep_minutes),
available = VALUES(available);

-- Loka Boardgame Cafe - database MySQL/MariaDB
-- Cara pakai: phpMyAdmin > tab "Import" > pilih file ini > Go
CREATE DATABASE IF NOT EXISTS loka_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loka_cafe;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT UNSIGNED NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  menu_id INT UNSIGNED NULL,
  item_name VARCHAR(100) NOT NULL,
  qty INT UNSIGNED NOT NULL,
  total INT UNSIGNED NOT NULL,
  status ENUM('baru','diproses','selesai','dibatalkan') NOT NULL DEFAULT 'baru',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  people TINYINT UNSIGNED NOT NULL,
  status ENUM('menunggu','dikonfirmasi','selesai','dibatalkan') NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_history (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  email VARCHAR(150) NOT NULL,
  status ENUM('berhasil','gagal','keluar') NOT NULL,
  ip_address VARCHAR(45) NOT NULL DEFAULT '',
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_created (created_at),
  INDEX idx_login_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Menu awal (hanya diisi jika tabel menu masih kosong)
INSERT INTO menu (name, price)
SELECT * FROM (
  SELECT 'Kopi Susu Loka' AS name, 22000 AS price UNION ALL
  SELECT 'Matcha Latte', 25000 UNION ALL
  SELECT 'Es Teh Lemon', 15000 UNION ALL
  SELECT 'Kentang Goreng', 20000 UNION ALL
  SELECT 'Mie Goreng Loka', 28000 UNION ALL
  SELECT 'Roti Bakar Coklat', 18000
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM menu);

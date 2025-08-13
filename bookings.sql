-- full_schema.sql
CREATE DATABASE IF NOT EXISTS tour_booking;
USE tour_booking;

-- 1. Customers
CREATE TABLE IF NOT EXISTS customers (
  customerId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  cell VARCHAR(20),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Townships
CREATE TABLE IF NOT EXISTS township (
  townId INT AUTO_INCREMENT PRIMARY KEY,
  townName VARCHAR(100) NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Packages
CREATE TABLE IF NOT EXISTS packages (
  packageId INT AUTO_INCREMENT PRIMARY KEY,
  packageName VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Bookings
CREATE TABLE IF NOT EXISTS bookings (
  bookingId INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT,
  townId INT,
  packageId INT,
  numberOfPeople INT NOT NULL,
  totalPrice DECIMAL(10,2),
  status ENUM('pending','confirmed','paid','cancelled') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(customerId) ON DELETE CASCADE,
  FOREIGN KEY (townId) REFERENCES township(townId) ON DELETE SET NULL,
  FOREIGN KEY (packageId) REFERENCES packages(packageId) ON DELETE SET NULL
);

-- 5. Payments
CREATE TABLE IF NOT EXISTS payments (
  paymentId INT AUTO_INCREMENT PRIMARY KEY,
  bookingId INT,
  stripePaymentId VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'zar',
  status VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(bookingId) ON DELETE SET NULL
);

-- sample townships
INSERT INTO township (townName, description) VALUES
('Bo-Kaap', 'Historic cultural area in Cape Town'),
('Khayelitsha', 'Large township near Cape Town'),
('Mitchells Plain', 'Residential area in Cape Town'),
('Langa', 'One of the oldest townships in Cape Town');

-- sample packages
INSERT INTO packages (packageName, price, description) VALUES
('Single Township Tour', 1500.00, '5 hours, per person'),
('Township Duo Tour', 3000.00, '2 townships per person'),
('Full Cape Culture Tour', 6000.00, '4 day package');

-- sample customer (optional)
INSERT INTO customers (name, email, cell) VALUES
('John Doe', 'john@example.com', '0712345678');

SELECT * FROM customers;

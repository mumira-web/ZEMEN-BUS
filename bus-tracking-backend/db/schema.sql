-- Create database
CREATE DATABASE bus_tracking;

-- Connect to it: \c bus_tracking

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('passenger', 'driver', 'admin')) DEFAULT 'passenger',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  start_location VARCHAR(255) NOT NULL,
  end_location VARCHAR(255) NOT NULL,
  distance INT,
  estimated_duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buses table
CREATE TABLE IF NOT EXISTS buses (
  id SERIAL PRIMARY KEY,
  bus_number VARCHAR(50) UNIQUE NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  company_name VARCHAR(255),
  current_latitude DECIMAL(10,8),
  current_longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  route_id INT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  schedule_date DATE NOT NULL,
  fare_amount DECIMAL(10,2),
  available_seats INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  passenger_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  schedule_id INT NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  seats VARCHAR(255),
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  journey_date DATE
);

-- GPS tracking table
CREATE TABLE IF NOT EXISTS gps_tracking (
  id SERIAL PRIMARY KEY,
  bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  speed DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  passenger_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bus_id INT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_passenger_id ON bookings(passenger_id);
CREATE INDEX idx_bookings_bus_id ON bookings(bus_id);
CREATE INDEX idx_gps_tracking_bus_id ON gps_tracking(bus_id);
CREATE INDEX idx_feedback_passenger_id ON feedback(passenger_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

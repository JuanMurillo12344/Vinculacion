-- ============================================
-- Script de Inicialización de Base de Datos PostgreSQL
-- Sistema de Renta de Vehículos - Neon
-- ============================================

-- ============================================
-- Tabla: vehicles
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    year INTEGER NOT NULL,
    color VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    passengers INTEGER NOT NULL,
    luggage INTEGER NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    doors INTEGER NOT NULL,
    features TEXT,
    image VARCHAR(500),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(available);

-- ============================================
-- Tabla: reservations
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_id INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    pickup_time VARCHAR(10) NOT NULL,
    return_time VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendiente',
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_id ON reservations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(start_date, end_date);

-- ============================================
-- Tabla: customers
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ============================================
-- Datos iniciales - Vehículos
-- ============================================
INSERT INTO vehicles (name, category, description, year, color, price, passengers, luggage, transmission, fuel, doors, features, image) VALUES
('Toyota Corolla 2024', 'sedan', 'Sedán confiable y eficiente', 2024, 'Plateado', 45.00, 5, 3, 'automatico', 'gasolina', 4, 'Aire Acondicionado, Bluetooth, Cámara Trasera, Control de Crucero, USB', '/silver-toyota-corolla-2024-sedan-modern-elegant.jpg'),
('Honda CR-V 2024', 'suv', 'SUV espaciosa ideal para familias', 2024, 'Blanco', 65.00, 7, 5, 'automatico', 'gasolina', 5, '4x4, Aire Acondicionado, Sistema de Navegación, Asientos de Cuero, Bluetooth', '/white-honda-crv-2024-suv-modern-spacious.jpg'),
('Nissan Sentra 2024', 'sedan', 'Sedán compacto perfecto para la ciudad', 2024, 'Azul', 40.00, 5, 2, 'automatico', 'gasolina', 4, 'Aire Acondicionado, USB, Control Crucero, Bluetooth, Cámara Trasera', '/blue-nissan-sentra-2024-compact-sedan-modern.jpg'),
('Kia Rio 2023', 'compacto', 'Sedán compacto ideal para la ciudad', 2023, 'Blanco', 35.00, 5, 2, 'manual', 'gasolina', 4, 'Aire Acondicionado, Radio, USB, Dirección Asistida, Económico', '/white-kia-rio-2023-compact-sedan-efficient.jpg'),
('Chevrolet Spark 2024', 'compacto', 'Auto perfecto para moverse por la ciudad', 2024, 'Rojo', 30.00, 4, 2, 'manual', 'gasolina', 5, 'Aire Acondicionado, Radio, Económico, USB, Dirección Asistida', '/red-chevrolet-spark-2024-mini-compact-car-city.jpg'),
('Suzuki Swift 2023', 'hatchback', 'Hatchback versátil y económico', 2023, 'Azul', 32.00, 5, 2, 'manual', 'gasolina', 5, 'Aire Acondicionado, USB, Bluetooth, Económico, Dirección Asistida', '/blue-suzuki-swift-2023-hatchback-compact-city.jpg')
ON CONFLICT DO NOTHING;

-- ============================================
-- Datos iniciales - Reservas de ejemplo
-- ============================================
INSERT INTO reservations (customer, email, phone, vehicle_id, start_date, end_date, pickup_time, return_time, status, total) VALUES
('Juan Pérez', 'juan@ejemplo.com', '+593 98 765 4321', 1, '2024-01-15 10:00:00', '2024-01-20 10:00:00', '10:00', '10:00', 'activa', 225.00),
('María González', 'maria@ejemplo.com', '+593 99 123 4567', 2, '2024-01-18 14:00:00', '2024-01-22 14:00:00', '14:00', '14:00', 'activa', 260.00),
('Carlos Rodríguez', 'carlos@ejemplo.com', '+593 97 888 9999', 3, '2024-01-10 09:00:00', '2024-01-14 18:00:00', '09:00', '18:00', 'completada', 160.00),
('Ana Martínez', 'ana@ejemplo.com', '+593 96 555 6666', 4, '2024-01-20 11:00:00', '2024-01-25 11:00:00', '11:00', '11:00', 'pendiente', 175.00),
('Luis Fernández', 'luis@ejemplo.com', '+593 95 444 3333', 5, '2024-01-08 15:00:00', '2024-01-12 15:00:00', '15:00', '15:00', 'completada', 120.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- Datos iniciales - Clientes
-- ============================================
INSERT INTO customers (name, email, phone, address, city, country) VALUES
('Juan Pérez', 'juan@ejemplo.com', '+593 98 765 4321', 'Av. Principal 123', 'Quito', 'Ecuador'),
('María González', 'maria@ejemplo.com', '+593 99 123 4567', 'Calle Secundaria 456', 'Guayaquil', 'Ecuador'),
('Carlos Rodríguez', 'carlos@ejemplo.com', '+593 97 888 9999', 'Av. Libertad 789', 'Cuenca', 'Ecuador'),
('Ana Martínez', 'ana@ejemplo.com', '+593 96 555 6666', 'Calle Central 321', 'Quito', 'Ecuador'),
('Luis Fernández', 'luis@ejemplo.com', '+593 95 444 3333', 'Av. Norte 654', 'Guayaquil', 'Ecuador')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Función para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

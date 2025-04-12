CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('attendee', 'vendor', 'organizer') NOT NULL,
    profile_image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME,
    end_date DATETIME,
    location VARCHAR(255),
    organizer_id INT NOT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    total_seats INT,
    total_stalls INT,
    image VARCHAR(255),
    ticket_price DECIMAL(10, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id)
);

CREATE TABLE event_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE event_category_mapping (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES event_categories(category_id) ON DELETE CASCADE
);

CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_quantity INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE ticket_purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('confirmed', 'cancelled', 'refunded') DEFAULT 'confirmed',
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE stalls (
    stall_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    size VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'booked', 'unavailable') DEFAULT 'available',
    description TEXT,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE stall_bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    stall_id INT NOT NULL,
    vendor_id INT NOT NULL, -- from users table
    status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stall_id) REFERENCES stalls(stall_id),
    FOREIGN KEY (vendor_id) REFERENCES users(user_id)
);


CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    receipt_url VARCHAR(255),

    related_type ENUM('ticket', 'stall') NOT NULL,
    related_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE event_favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE event_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT CHECK (rating >= 1 AND rating <= 6),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

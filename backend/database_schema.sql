-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('sponsor', 'receiver', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Sponsor Profiles
CREATE TABLE sponsor_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    organization VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    preferred_contact_method ENUM('email', 'phone', 'system') DEFAULT 'email',
    profile_image VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Receiver Profiles (Children)
CREATE TABLE receiver_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NULL,
    guardian_name VARCHAR(200) NULL,
    guardian_contact VARCHAR(100) NULL,
    school_class VARCHAR(50) NULL,
    interests TEXT NULL,
    needs TEXT NULL,
    profile_image VARCHAR(255) NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Sponsorships Table
CREATE TABLE sponsorships (
    sponsorship_id INT AUTO_INCREMENT PRIMARY KEY,
    sponsor_id INT NOT NULL,
    receiver_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    purpose TEXT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    frequency ENUM('one-time', 'monthly', 'quarterly', 'annually') DEFAULT 'one-time',
    status ENUM('pending', 'active', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- Confirmations Table
CREATE TABLE confirmations (
    confirmation_id INT AUTO_INCREMENT PRIMARY KEY,
    sponsorship_id INT NOT NULL,
    confirmed_by INT NOT NULL,
    confirmation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_image VARCHAR(255) NULL,
    notes TEXT NULL,
    FOREIGN KEY (sponsorship_id) REFERENCES sponsorships(sponsorship_id),
    FOREIGN KEY (confirmed_by) REFERENCES users(user_id)
);

-- Messages Table
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255) NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    generated_by INT NOT NULL,
    report_type ENUM('sponsorship', 'financial', 'activity', 'custom') NOT NULL,
    file_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(user_id)
);sudo apt install unetbootin

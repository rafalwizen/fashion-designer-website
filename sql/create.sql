CREATE DATABASE fashion_portfolio;

USE fashion_portfolio;

CREATE TABLE users
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Insert admin user with hashed password
-- Note: The hashed password below is for 'admin1' using bcrypt with 10 rounds
INSERT INTO users (username, password, is_admin)
VALUES ('Admin', '$2b$10$rXbDX3ZXK5.7D8fH5z9zKOtZtZXB5Oa6Tn.zqDzGhqp6j3f8fcnHe', TRUE);

CREATE TABLE projects
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_images
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    image      LONGBLOB NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);
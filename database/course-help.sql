-- ============================================
-- course-help database schema
-- ============================================

CREATE DATABASE IF NOT EXISTS `course-help`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `course-help`;

-- ============================================
-- departments
-- ============================================
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- ============================================
-- lecturers
-- ============================================
CREATE TABLE lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    university VARCHAR(200),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(30),
    whatsapp VARCHAR(30),
    office VARCHAR(100),
    specialization VARCHAR(150),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ============================================
-- users  (plain accounts — login/session only, no roles)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- courses
-- ============================================
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_title VARCHAR(200) NOT NULL,
    description TEXT,
    level VARCHAR(20),
    units INT NOT NULL DEFAULT 0,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ============================================
-- course_lecturers (many-to-many pivot)
-- ============================================
CREATE TABLE course_lecturers (
    course_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    PRIMARY KEY (course_id, lecturer_id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- Sample seed data
-- ============================================

INSERT INTO departments (name) VALUES
('Computer Science'),
('Mathematics'),
('Physics'),
('General Studies');

INSERT INTO lecturers
(name, university, email, phone, whatsapp, office, specialization, department_id)
VALUES
('Dr. Amina Yusuf', 'University of Lagos', 'amina.yusuf@university.edu', '+2348012345678', '+2348012345678', 'CS Dept. Building', 'Web Development, Databases', 1),
('Dr. Bello Ibrahim', 'University of Lagos', 'bello.ibrahim@university.edu', '+2348023456789', '+2348023456789', 'Maths Dept. Building', 'Calculus, Statistics', 2),
('Dr. Chidinma Okafor', 'University of Lagos', 'chidinma.okafor@university.edu', '+2348034567890', '+2348034567890', 'Physics Dept. Building', 'Mechanics, Quantum Physics', 3);

INSERT INTO courses (course_code, course_title, description, level, units, department_id) VALUES
('CS101', 'Introduction to Computer Science', 'An introductory course that covers the basic concepts of computer science, including problem solving, programming fundamentals, and computational thinking.', '100', 3, 1),
('CS102', 'Data Structures and Algorithms', 'Covers core data structures and algorithms used in efficient software design.', '200', 3, 1),
('CS103', 'Web Development', 'Introduction to building websites with HTML, CSS, JavaScript and server-side basics.', '200', 3, 1),
('CS104', 'Database Systems', 'Fundamentals of relational databases, SQL, and database design.', '300', 3, 1),
('CS105', 'Operating Systems', 'Core concepts of operating systems including processes, memory and file systems.', '300', 3, 1),
('MTH101', 'Calculus I', 'Limits, derivatives, and introductory integral calculus.', '100', 3, 2),
('PHY101', 'Mechanics', 'Classical mechanics: motion, forces, energy and momentum.', '100', 3, 3),
('GST101', 'General Studies', 'Communication skills and general education requirements.', '100', 2, 4),
('SEN201', 'Software Engineering', 'Principles of software design, development lifecycle and team-based projects.', '200', 3, 1),
('STA101', 'Statistics', 'Introduction to descriptive and inferential statistics.', '100', 3, 2);

INSERT INTO course_lecturers (course_id, lecturer_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (9, 1),
(6, 2), (10, 2),
(7, 3);
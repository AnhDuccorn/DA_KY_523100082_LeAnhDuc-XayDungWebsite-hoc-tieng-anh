CREATE DATABASE IF NOT EXISTS english_learning
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english_learning;

DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS lesson_contents;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('learner','admin') NOT NULL DEFAULT 'learner',
  status ENUM('active','locked') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  status ENUM('active','hidden') DEFAULT 'active'
);

CREATE TABLE lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  level VARCHAR(50) DEFAULT 'Cơ bản',
  duration_minutes INT DEFAULT 15,
  status ENUM('active','hidden') DEFAULT 'active',
  FOREIGN KEY(topic_id) REFERENCES topics(id)
);

CREATE TABLE lesson_contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  content_type ENUM('vocabulary','grammar') NOT NULL,
  term VARCHAR(150),
  meaning VARCHAR(255),
  pronunciation VARCHAR(120),
  part_of_speech VARCHAR(80),
  grammar_structure VARCHAR(255),
  usage_note TEXT,
  example_en TEXT,
  example_vi TEXT,
  FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option ENUM('A','B','C','D') NOT NULL,
  FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  score DECIMAL(4,1) NOT NULL,
  correct_count INT NOT NULL,
  wrong_count INT NOT NULL,
  completed_at DATETIME NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(lesson_id) REFERENCES lessons(id)
);

CREATE TABLE progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completion_percent INT DEFAULT 0,
  status ENUM('not_started','learning','completed') DEFAULT 'not_started',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_progress(user_id, lesson_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(lesson_id) REFERENCES lessons(id)
);

INSERT INTO topics(name,description) VALUES
('Greetings','Chào hỏi cơ bản'),
('Family','Gia đình'),
('School','Trường học'),
('Food and Drink','Thức ăn và đồ uống'),
('Traveling','Du lịch');

INSERT INTO lessons(topic_id,title,description,level,duration_minutes) VALUES
(1,'Unit 1: Greetings','Chào hỏi cơ bản trong cuộc sống hằng ngày','Cơ bản',15),
(2,'Unit 2: Family','Từ vựng và mẫu câu về gia đình','Cơ bản',20),
(3,'Unit 3: School','Từ vựng về trường học','Cơ bản',20),
(4,'Unit 4: Food and Drink','Từ vựng món ăn và đồ uống','Cơ bản',25),
(5,'Unit 5: Traveling','Từ vựng và mẫu câu khi đi du lịch','Trung bình',25);

INSERT INTO lesson_contents
(lesson_id,content_type,term,meaning,pronunciation,part_of_speech,example_en,example_vi)
VALUES
(1,'vocabulary','hello','xin chào','/həˈləʊ/','thán từ','Hello! Nice to meet you.','Xin chào! Rất vui được gặp bạn.'),
(2,'vocabulary','aunt','cô/dì','/ɑːnt/','danh từ','My aunt lives in Hanoi.','Dì của tôi sống ở Hà Nội.'),
(3,'vocabulary','library','thư viện','/ˈlaɪbreri/','danh từ','I study in the library.','Tôi học trong thư viện.');

INSERT INTO lesson_contents
(lesson_id,content_type,grammar_structure,usage_note,example_en,example_vi)
VALUES
(1,'grammar','S + am/is/are + ...','Dùng động từ to be để giới thiệu hoặc mô tả.','I am a student.','Tôi là sinh viên.'),
(2,'grammar','This is my + noun','Dùng để giới thiệu thành viên gia đình.','This is my mother.','Đây là mẹ của tôi.'),
(3,'grammar','S + V(s/es) + O','Thì hiện tại đơn cho thói quen và sự thật.','She goes to school every day.','Cô ấy đi học mỗi ngày.');

INSERT INTO questions(lesson_id,question_text,option_a,option_b,option_c,option_d,correct_option) VALUES
(1,'Which word is used to greet someone?','Goodbye','Hello','Thanks','Sorry','B'),
(1,'Choose the correct sentence.','I is a student.','I are a student.','I am a student.','I be a student.','C'),
(2,'She is my father''s sister. She is my _____.','mother','aunt','grandmother','cousin','B'),
(2,'My mother and father are my _____.','parents','teachers','friends','students','A'),
(3,'Where can you borrow books?','hospital','market','library','restaurant','C');

-- Tạo tài khoản admin bằng script Node sau khi cài project:
-- node database/create-admin.js

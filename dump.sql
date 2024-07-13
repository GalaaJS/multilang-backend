-- Insert into projects
INSERT INTO projects (project_name, description, created_at, updated_at) VALUES
('Project A', 'Description of Project A', NOW(), NOW()),
('Project B', 'Description of Project B', NOW(), NOW());

-- Insert into languages
INSERT INTO languages (lang_code, lang_name, created_at, updated_at) VALUES
('en', 'English', NOW(), NOW()),
('fr', 'French', NOW(), NOW());

-- Insert into project_languages
INSERT INTO project_languages (project_id, lang_id, created_at, updated_at) VALUES
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(2, 1, NOW(), NOW());

-- Insert into translations
INSERT INTO translations (lang_id, key, value, status, created_at, updated_at) VALUES
(1, 'welcome_message', 'Welcome', 'active', NOW(), NOW()),
(2, 'welcome_message', 'Bienvenue', 'active', NOW(), NOW()),
(1, 'goodbye_message', 'Goodbye', 'active', NOW(), NOW()),
(2, 'goodbye_message', 'Au revoir', 'active', NOW(), NOW());

-- Insert into urls
INSERT INTO urls (project_id, url, created_at, updated_at) VALUES
(1, '/home', NOW(), NOW()),
(1, '/about', NOW(), NOW()),
(2, '/home', NOW(), NOW());

-- Insert into translation_urls
INSERT INTO translation_urls (translation_id, url_id, created_at, updated_at) VALUES
(1, 1, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(3, 2, NOW(), NOW()),
(4, 3, NOW(), NOW());

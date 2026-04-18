USE shunmugasteel_db;

-- Default admin account
-- Password: Admin@1234 (bcrypt hashed — change after first login)
INSERT INTO admins (name, email, password, role) VALUES
('Shunmuga Admin', 'admin@shunmugasteel.com',
 '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 'super_admin');

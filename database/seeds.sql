-- ARVEX CLOUD DATABASE SEEDS
-- Sample data for development

-- Insert admin user
INSERT INTO users (username, email, password_hash, first_name, last_name, role, email_verified, status)
VALUES (
    'admin',
    'admin@arvex.cloud',
    '$2b$10$1K8VLXqVZZzB0S4Z3Q4Qe.tQ9mKZxKv6fLqKqZK5BnWqZL2Vy.6qm', -- password: admin123
    'Admin',
    'User',
    'admin',
    TRUE,
    'active'
)
ON CONFLICT (email) DO NOTHING;

-- Insert test user
INSERT INTO users (username, email, password_hash, first_name, last_name, role, email_verified, status, balance)
VALUES (
    'testuser',
    'test@example.com',
    '$2b$10$1K8VLXqVZZzB0S4Z3Q4Qe.tQ9mKZxKv6fLqKqZK5BnWqZL2Vy.6qm', -- password: test123
    'Test',
    'User',
    'user',
    TRUE,
    'active',
    100.00
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample billing plans
INSERT INTO billing_plans (name, description, cpu_cores, memory_gb, disk_gb, bandwidth_gb, monthly_price, hourly_price, setup_fee)
VALUES
    ('Starter', 'Perfect for beginners', 1, 1, 20, 100, 5.00, 0.0070, 0),
    ('Professional', 'For growing projects', 2, 4, 60, 500, 15.00, 0.0208, 0),
    ('Enterprise', 'High-performance hosting', 4, 8, 160, 1000, 35.00, 0.0486, 0),
    ('Ultimate', 'Maximum performance', 8, 16, 320, 2000, 65.00, 0.0903, 0)
ON CONFLICT DO NOTHING;

-- Insert sample node
INSERT INTO nodes (node_id, node_name, ip_address, port, api_key, api_secret, cpu_cores, total_memory_gb, total_storage_gb, os_type, os_version, lxd_version, status)
VALUES (
    'node-001',
    'Production Node 1',
    '192.168.1.100',
    7777,
    'key_' || gen_random_uuid()::text,
    'secret_' || gen_random_uuid()::text,
    32,
    128,
    2000,
    'Linux',
    'Ubuntu 22.04 LTS',
    '5.19',
    'online'
)
ON CONFLICT (node_id) DO NOTHING;

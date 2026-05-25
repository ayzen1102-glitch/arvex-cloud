-- ARVEX CLOUD DATABASE SCHEMA
-- PostgreSQL Database for VPS Hosting Platform

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    balance DECIMAL(12, 2) DEFAULT 0.00,
    role VARCHAR(50) DEFAULT 'user', -- user, reseller, admin
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, banned
    email_verified BOOLEAN DEFAULT FALSE,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ==================== LOGIN HISTORY ====================
CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'success', -- success, failed
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== NODES TABLE ====================
CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(255) UNIQUE NOT NULL,
    node_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    port INTEGER DEFAULT 7777,
    api_key VARCHAR(255) UNIQUE,
    api_secret VARCHAR(255),
    cpu_cores INTEGER NOT NULL,
    total_memory_gb INTEGER NOT NULL,
    total_storage_gb INTEGER NOT NULL,
    available_memory_gb INTEGER,
    available_storage_gb INTEGER,
    os_type VARCHAR(50),
    os_version VARCHAR(100),
    lxd_version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'offline', -- online, offline, maintenance
    last_heartbeat TIMESTAMP,
    max_vps INTEGER DEFAULT 100,
    current_vps INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== VPS TABLE ====================
CREATE TABLE IF NOT EXISTS vps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vps_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    hostname VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, stopped, suspended, deleted
    os_type VARCHAR(50), -- ubuntu, debian, centos, etc
    os_version VARCHAR(50),
    image_name VARCHAR(255),
    cpu_cores INTEGER NOT NULL,
    memory_gb INTEGER NOT NULL,
    disk_gb INTEGER NOT NULL,
    ip_address VARCHAR(45),
    ipv6_address VARCHAR(128),
    root_password VARCHAR(255),
    auto_start BOOLEAN DEFAULT TRUE,
    backup_enabled BOOLEAN DEFAULT TRUE,
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ==================== VPS BACKUPS TABLE ====================
CREATE TABLE IF NOT EXISTS vps_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vps_id UUID NOT NULL REFERENCES vps(id) ON DELETE CASCADE,
    backup_name VARCHAR(255) NOT NULL,
    backup_size_gb DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restored_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- ==================== NETWORK TABLE ====================
CREATE TABLE IF NOT EXISTS networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vps_id UUID NOT NULL REFERENCES vps(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) UNIQUE,
    ip_type VARCHAR(10), -- IPv4, IPv6
    is_primary BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== FIREWALL RULES TABLE ====================
CREATE TABLE IF NOT EXISTS firewall_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vps_id UUID NOT NULL REFERENCES vps(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    direction VARCHAR(20), -- inbound, outbound
    protocol VARCHAR(20), -- tcp, udp, icmp
    port_from INTEGER,
    port_to INTEGER,
    source_ip VARCHAR(45),
    action VARCHAR(20), -- allow, deny
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MONITORING TABLE ====================
CREATE TABLE IF NOT EXISTS monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vps_id UUID NOT NULL REFERENCES vps(id) ON DELETE CASCADE,
    cpu_usage DECIMAL(5, 2),
    memory_usage DECIMAL(5, 2),
    disk_usage DECIMAL(5, 2),
    network_in_mbps DECIMAL(10, 2),
    network_out_mbps DECIMAL(10, 2),
    uptime_percentage DECIMAL(5, 2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== BILLING PLANS TABLE ====================
CREATE TABLE IF NOT EXISTS billing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cpu_cores INTEGER NOT NULL,
    memory_gb INTEGER NOT NULL,
    disk_gb INTEGER NOT NULL,
    bandwidth_gb INTEGER,
    monthly_price DECIMAL(10, 2) NOT NULL,
    hourly_price DECIMAL(10, 4),
    setup_fee DECIMAL(10, 2) DEFAULT 0,
    billing_cycle VARCHAR(50) DEFAULT 'monthly', -- monthly, hourly, yearly
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INVOICES TABLE ====================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vps_id UUID REFERENCES vps(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled, refunded
    payment_method VARCHAR(50),
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PAYMENTS TABLE ====================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50), -- stripe, paypal, crypto, bank_transfer
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== COUPONS TABLE ====================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== AUDIT LOGS TABLE ====================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_vps_user_id ON vps(user_id);
CREATE INDEX idx_vps_node_id ON vps(node_id);
CREATE INDEX idx_vps_status ON vps(status);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_monitoring_vps_id ON monitoring(vps_id);
CREATE INDEX idx_monitoring_recorded_at ON monitoring(recorded_at);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

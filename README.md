# 🔥 ARVEX CLOUD VPS PANEL

**A Production-Grade VPS Hosting Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)

---

## 📖 Overview

ARVEX CLOUD is a complete, scalable, production-ready VPS hosting platform similar to DigitalOcean, AWS Lightsail, or Linode. It provides everything needed to operate a cloud hosting business.

### ✨ Key Features

✅ **VPS Management**
- Create, delete, start, stop, restart VPS instances
- Multiple OS templates (Ubuntu, Debian, CentOS)
- Custom CPU, RAM, and disk allocation
- SSH access and web console
- Automated backups and snapshots

✅ **Multi-Node Architecture**
- Distribute VPS across multiple physical nodes
- Load balancing and failover
- Real-time node monitoring
- Auto-scaling support

✅ **Web Dashboard**
- Intuitive user interface
- Real-time stats and monitoring
- Account management
- Billing and invoicing
- Admin panel for management

✅ **Billing System**
- Multiple payment methods (Stripe, PayPal, Crypto)
- Flexible billing cycles (hourly, monthly, yearly)
- Coupon and discount system
- Automated invoicing
- Credit wallet system

✅ **Security**
- JWT authentication with 2FA
- Role-based access control (RBAC)
- Firewall rules per VPS
- DDoS protection basics
- Audit logs and activity tracking

✅ **Monitoring & Analytics**
- Real-time CPU, RAM, disk, network monitoring
- Uptime tracking
- System alerts and notifications
- Performance graphs and reports

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│           ARVEX CLOUD ARCHITECTURE                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (Next.js)  →  Nginx  ←  Backend (NestJS) │
│                          ↓                          │
│                    PostgreSQL + Redis               │
│                          ↓                          │
│  Node Agent 1  ·  Node Agent 2  ·  Node Agent N     │
│      (LXC)            (LXC)             (LXC)       │
│       ↓                ↓                 ↓          │
│    VPS1,2        VPS3,4,5           VPS6,7,8       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- PostgreSQL 15+ (if not using Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ayzen1102-glitch/arvex-cloud.git
cd arvex-cloud
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your settings
vim .env
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec backend npm run migration:run
```

5. **Access the platform**
- Frontend: http://localhost:3001
- API: http://localhost:3000/api
- Admin: http://localhost:3001/admin (default: admin/admin123)

---

## 📁 Project Structure

```
arvex-cloud/
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   ├── controllers/       # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── entities/          # Database models
│   │   └── config/            # Configuration
│   └── Dockerfile
│
├── frontend/                   # Next.js Dashboard
│   ├── pages/                 # Route pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── context/               # State management
│   └── styles/                # TailwindCSS
│
├── node-agent/                # Node VPS Manager
│   ├── src/
│   │   ├── lxc/              # LXC/LXD management
│   │   ├── api/              # API client
│   │   ├── monitoring/       # System monitoring
│   │   └── core/             # Core agent logic
│   └── Dockerfile
│
├── database/                  # Database files
│   ├── schema.sql            # Database schema
│   └── seeds.sql             # Sample data
│
├── nginx/                     # Nginx configuration
├── docker/                    # Docker files
├── scripts/                   # Deployment scripts
└── docker-compose.yml         # Docker Compose config
```

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/arvex
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
STRIPE_KEY=pk_test_xxxxx
```

### Frontend Configuration

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### Node Agent Configuration

Edit `node-agent/.env`:

```env
API_URL=http://backend:3000
NODE_ID=node-001
LXD_SOCKET=/var/snap/lxd/common/lxd.sock
```

---

## 📚 API Documentation

### Authentication

**Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### VPS Management

**Create VPS**
```bash
POST /api/vps
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Web Server",
  "image": "ubuntu:22.04",
  "cpu": 2,
  "memory": 4,
  "disk": 60
}
```

**List VPS**
```bash
GET /api/vps
Authorization: Bearer {token}
```

**Get VPS Details**
```bash
GET /api/vps/{id}
Authorization: Bearer {token}
```

**Start VPS**
```bash
POST /api/vps/{id}/start
Authorization: Bearer {token}
```

**Stop VPS**
```bash
POST /api/vps/{id}/stop
Authorization: Bearer {token}
```

Full API documentation available at `/api/docs` when running.

---

## 🛠️ Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Node Agent Development

```bash
cd node-agent
npm install
npm run dev
```

---

## 🐳 Docker Deployment

### Build Images

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f node-agent
```

### Stop Services

```bash
docker-compose down
```

---

## 📊 Database

### Schema

The database includes tables for:
- Users and authentication
- VPS instances and configuration
- Nodes (physical servers)
- Billing and payments
- Monitoring data
- Audit logs

### Migrations

```bash
# Run migrations
npm run migration:run

# Create new migration
npm run migration:create -- NameOfMigration

# Revert migration
npm run migration:revert
```

---

## 🔐 Security

### Best Practices Implemented

✅ Password hashing with bcryptjs  
✅ JWT tokens with expiration  
✅ CORS protection  
✅ SQL injection prevention via ORM  
✅ Rate limiting  
✅ HTTPS/TLS support  
✅ Audit logging  
✅ 2FA support  
✅ Role-based access control  

### Securing Deployment

1. Change all default passwords
2. Set strong JWT secret
3. Enable HTTPS with SSL certificates
4. Configure firewall rules
5. Set up monitoring and alerting
6. Regular security audits

---

## 📈 Scaling

### Horizontal Scaling

- Add more Node Agents for VPS distribution
- Use load balancer for API servers
- Scale PostgreSQL with replicas
- Scale Redis for caching

### Performance Optimization

- Cache frequently accessed data in Redis
- Optimize database queries with indexes
- Use CDN for static assets
- Implement pagination for large datasets

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- 📧 Email: support@arvex.cloud
- 💬 Discord: [Join Server](https://discord.gg/arvex)
- 📖 Documentation: [Full Docs](https://docs.arvex.cloud)
- 🐛 Issues: [GitHub Issues](https://github.com/ayzen1102-glitch/arvex-cloud/issues)

---

## 🙏 Acknowledgments

- Inspired by DigitalOcean, AWS Lightsail, and Linode
- Built with NestJS, Next.js, and PostgreSQL
- VPS management via LXC/LXD

---

**Made with ❤️ by ARVEX CLOUD Team**

GitHub: [@ayzen1102-glitch](https://github.com/ayzen1102-glitch)

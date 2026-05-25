# 🔥 ARVEX Node Agent

Node Agent for ARVEX Cloud VPS Platform - Handles VPS provisioning, management, and monitoring.

## Features

- ✅ LXC/LXD Container Management
- ✅ VPS Creation, Start, Stop, Restart, Delete
- ✅ System Monitoring & Stats
- ✅ Real-time Health Checks
- ✅ Secure API Communication
- ✅ Container Resource Limits
- ✅ OS Template Support (Ubuntu, Debian, CentOS)

## Installation

### Prerequisites
- Ubuntu 22.04 or later
- Node.js 18+
- LXD installed and configured

```bash
# Install LXD
sudo apt update && sudo apt install -y lxd
sudo lxd init

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Create .env file
cp .env.example .env
vi .env  # Edit with your configuration

# Start agent
npm start
```

## Configuration

Edit `.env` file:

```env
NODE_AGENT_ID=node-1
NODE_AGENT_TOKEN=your-secure-token
NODE_AGENT_PORT=8085
BACKEND_API_URL=http://localhost:3000
BACKEND_API_KEY=your-api-key
LXD_SOCKET_PATH=/var/snap/lxd/common/lxd.sock
```

## API Endpoints

### Health Check
```bash
GET /health
Authorization: Bearer <token>
```

### System Stats
```bash
GET /stats
Authorization: Bearer <token>
```

### Create VPS
```bash
POST /vps/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "vpsId": "uuid",
  "hostname": "vps-01",
  "cpu": 2,
  "memory": 2048,
  "disk": 20,
  "os": "ubuntu-22.04",
  "rootPassword": "secure-password"
}
```

### Start VPS
```bash
POST /vps/:vpsId/start
Authorization: Bearer <token>
```

### Stop VPS
```bash
POST /vps/:vpsId/stop
Authorization: Bearer <token>
```

### Restart VPS
```bash
POST /vps/:vpsId/restart
Authorization: Bearer <token>
```

### Delete VPS
```bash
DELETE /vps/:vpsId
Authorization: Bearer <token>
```

### Get VPS Stats
```bash
GET /vps/:vpsId/stats
Authorization: Bearer <token>
```

## Security

- All requests require valid Bearer token
- Token validation on every request
- Secure communication with backend API
- LXD socket restricted permissions

## Deployment

### Docker
```bash
docker build -t arvex-node-agent .
docker run -d \
  --name arvex-node-agent \
  -e NODE_AGENT_ID=node-1 \
  -e NODE_AGENT_TOKEN=your-token \
  -e BACKEND_API_URL=http://backend:3000 \
  -v /var/snap/lxd:/var/snap/lxd \
  -p 8085:8085 \
  arvex-node-agent
```

### Systemd Service
Create `/etc/systemd/system/arvex-node-agent.service`:

```ini
[Unit]
Description=ARVEX Node Agent
After=network.target

[Service]
Type=simple
User=node-agent
WorkingDirectory=/opt/arvex-node-agent
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable arvex-node-agent
sudo systemctl start arvex-node-agent
```

## Monitoring

Check logs:
```bash
journalctl -u arvex-node-agent -f
```

## License
MIT

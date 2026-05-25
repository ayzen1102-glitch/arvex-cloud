# ARVEX CLOUD API DOCUMENTATION

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [VPS Management](#vps-management)
- [Nodes](#nodes)
- [Billing](#billing)
- [Admin](#admin)
- [Errors](#errors)

---

## Authentication

### Register

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "user123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "user123",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer {refresh_token}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Users

### Get Profile

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "balance": 100.50,
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Profile

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "location": "USA",
  "bio": "Web developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "location": "USA",
    "bio": "Web developer",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Get Login History

**Endpoint:** `GET /api/users/login-history`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "ipAddress": "192.168.1.1",
      "deviceName": "Chrome on Windows",
      "status": "success",
      "loginAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

## VPS Management

### Create VPS

**Endpoint:** `POST /api/vps`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Web Server 1",
  "image": "ubuntu:22.04",
  "cpu": 2,
  "memory": 4,
  "disk": 60,
  "hostname": "web1.example.com",
  "rootPassword": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "vpsId": "vps-001",
    "name": "Web Server 1",
    "status": "pending",
    "image": "ubuntu:22.04",
    "cpu": 2,
    "memory": 4,
    "disk": 60,
    "ipAddress": "192.168.1.100",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### List VPS

**Endpoint:** `GET /api/vps`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Web Server 1",
      "status": "running",
      "cpu": 2,
      "memory": 4,
      "disk": 60,
      "ipAddress": "192.168.1.100",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

### Get VPS Details

**Endpoint:** `GET /api/vps/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "vpsId": "vps-001",
    "name": "Web Server 1",
    "status": "running",
    "image": "ubuntu:22.04",
    "cpu": 2,
    "memory": 4,
    "disk": 60,
    "ipAddress": "192.168.1.100",
    "ipv6Address": "2001:db8::1",
    "hostname": "web1.example.com",
    "autoStart": true,
    "backupEnabled": true,
    "monitoringEnabled": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Start VPS

**Endpoint:** `POST /api/vps/{id}/start`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "VPS started successfully"
}
```

### Stop VPS

**Endpoint:** `POST /api/vps/{id}/stop`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "VPS stopped successfully"
}
```

### Restart VPS

**Endpoint:** `POST /api/vps/{id}/restart`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "VPS restarted successfully"
}
```

### Delete VPS

**Endpoint:** `DELETE /api/vps/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "VPS deleted successfully"
}
```

### Get VPS Stats

**Endpoint:** `GET /api/vps/{id}/stats`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cpuUsage": 45.5,
    "memoryUsage": 62.3,
    "diskUsage": 72.8,
    "networkIn": 1024.5,
    "networkOut": 512.3,
    "uptime": 99.9,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Nodes

### Register Node

**Endpoint:** `POST /api/nodes/register`

**Headers:**
```
X-Node-ID: node-001
X-Signature: {signature}
X-Timestamp: {timestamp}
```

**Request:**
```json
{
  "nodeName": "Production Node 1",
  "cpuCores": 32,
  "totalMemoryGB": 128,
  "totalStorageGB": 2000,
  "osType": "Linux",
  "osVersion": "Ubuntu 22.04 LTS",
  "lxdVersion": "5.19"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "nodeId": "node-001",
    "nodeName": "Production Node 1",
    "status": "online",
    "apiKey": "key_xxx"
  }
}
```

### Send Heartbeat

**Endpoint:** `POST /api/nodes/heartbeat`

**Headers:**
```
X-Node-ID: node-001
X-Signature: {signature}
X-Timestamp: {timestamp}
```

**Request:**
```json
{
  "nodeId": "node-001",
  "status": "online",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Heartbeat received"
}
```

---

## Errors

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

API endpoints are rate-limited:
- 100 requests per minute per IP
- 1000 requests per hour per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705329600
```

---

## Pagination

Paginated endpoints accept:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Webhooks

Subscribe to events via webhooks:

**Supported Events:**
- `vps.created`
- `vps.started`
- `vps.stopped`
- `vps.deleted`
- `payment.completed`
- `invoice.generated`

**Webhook Payload:**
```json
{
  "event": "vps.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "vpsId": "vps-001",
    "name": "Web Server 1"
  }
}
```

---

## Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user123",
    "email": "user@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Create VPS
curl -X POST http://localhost:3000/api/vps \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Server",
    "image": "ubuntu:22.04",
    "cpu": 2,
    "memory": 4,
    "disk": 60
  }'
```

### Using JavaScript/Fetch

```javascript
// Create VPS
const response = await fetch('http://localhost:3000/api/vps', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Web Server',
    image: 'ubuntu:22.04',
    cpu: 2,
    memory: 4,
    disk: 60
  })
});

const data = await response.json();
console.log(data);
```

---

## Support

For API support, visit: https://docs.arvex.cloud

# Security Audit & Best Practices

Comprehensive security guidelines for identifying and mitigating vulnerabilities.

## Security Audit Checklist

### 1. Authentication & Authorization
- [ ] Multi-factor authentication available
- [ ] Password complexity requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Session management secure
- [ ] JWT tokens properly validated
- [ ] OAuth implementation correct
- [ ] API keys rotated regularly
- [ ] Role-based access control (RBAC)

### 2. Input Validation & Sanitization
```javascript
// SQL Injection Prevention
// BAD
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// XSS Prevention
// BAD
element.innerHTML = userInput;

// GOOD - Sanitize HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Command Injection Prevention
// BAD
exec(`convert ${filename} output.pdf`);

// GOOD - Use array arguments
execFile('convert', [filename, 'output.pdf']);
```

### 3. Common Vulnerabilities (OWASP Top 10)

#### A01: Broken Access Control
```javascript
// Implement proper authorization checks
const authorize = (requiredRole) => (req, res, next) => {
  if (!req.user || !req.user.roles.includes(requiredRole)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Verify resource ownership
const canAccessResource = async (userId, resourceId) => {
  const resource = await db.query(
    'SELECT owner_id FROM resources WHERE id = $1',
    [resourceId]
  );
  return resource.owner_id === userId;
};
```

#### A02: Cryptographic Failures
```javascript
// Use strong encryption
import crypto from 'crypto';

// Encrypt sensitive data
const encrypt = (text, password) => {
  const algorithm = 'aes-256-gcm';
  const salt = crypto.randomBytes(32);
  const key = crypto.scryptSync(password, salt, 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Hash passwords properly
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 12);
```

#### A03: Injection
```javascript
// Prevent NoSQL injection
// BAD
const user = await db.collection('users').findOne({
  username: req.body.username,
  password: req.body.password  // Could be {$ne: null}
});

// GOOD
const user = await db.collection('users').findOne({
  username: String(req.body.username),
  password: String(req.body.password)
});

// Prevent LDAP injection
import ldapEscape from 'ldap-escape';
const safeDn = ldapEscape.dn`cn=${username},ou=users,dc=example,dc=com`;
```

#### A04: Insecure Design
```javascript
// Implement rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 4. API Security
```javascript
// API Key validation
const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  const hashedKey = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
    
  const validKey = await db.query(
    'SELECT * FROM api_keys WHERE key_hash = $1 AND revoked = false',
    [hashedKey]
  );
  
  if (!validKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  // Log API usage
  await db.query(
    'INSERT INTO api_logs (key_id, endpoint, ip) VALUES ($1, $2, $3)',
    [validKey.id, req.path, req.ip]
  );
  
  next();
};

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

### 5. Data Protection
```javascript
// Implement field-level encryption
class FieldEncryption {
  constructor(masterKey) {
    this.masterKey = masterKey;
  }
  
  async encryptField(fieldName, value) {
    const fieldKey = await this.deriveFieldKey(fieldName);
    return encrypt(value, fieldKey);
  }
  
  async decryptField(fieldName, encryptedData) {
    const fieldKey = await this.deriveFieldKey(fieldName);
    return decrypt(encryptedData, fieldKey);
  }
  
  async deriveFieldKey(fieldName) {
    return crypto.pbkdf2Sync(
      this.masterKey,
      fieldName,
      100000,
      32,
      'sha256'
    );
  }
}

// Data masking for logs
const maskSensitiveData = (data) => {
  const masked = { ...data };
  
  // Mask credit card numbers
  if (masked.creditCard) {
    masked.creditCard = masked.creditCard.replace(/\d(?=\d{4})/g, '*');
  }
  
  // Mask email addresses
  if (masked.email) {
    const [localPart, domain] = masked.email.split('@');
    masked.email = `${localPart[0]}***@${domain}`;
  }
  
  // Remove passwords entirely
  delete masked.password;
  
  return masked;
};
```

### 6. Infrastructure Security
```yaml
# Docker security
FROM node:18-alpine

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy files with correct ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Security scanning in CI/CD
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Dependency scanning
      - name: Run npm audit
        run: npm audit --production
        
      # Static analysis
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        
      # Container scanning
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
```

### 7. Secrets Management
```javascript
// Use environment variables
const config = {
  database: {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h'
  }
};

// Rotate secrets programmatically
const rotateApiKeys = async () => {
  const oldKeys = await db.query(
    'SELECT * FROM api_keys WHERE created_at < NOW() - INTERVAL 90 days'
  );
  
  for (const key of oldKeys) {
    // Generate new key
    const newKey = crypto.randomBytes(32).toString('hex');
    
    // Save new key
    await db.query(
      'INSERT INTO api_keys (user_id, key_hash) VALUES ($1, $2)',
      [key.user_id, hashApiKey(newKey)]
    );
    
    // Notify user
    await notifyKeyRotation(key.user_id, newKey);
    
    // Mark old key for deletion
    await db.query(
      'UPDATE api_keys SET expires_at = NOW() + INTERVAL 7 days WHERE id = $1',
      [key.id]
    );
  }
};
```

### 8. Monitoring & Incident Response
```javascript
// Security event logging
const logSecurityEvent = async (event) => {
  await db.query(
    `INSERT INTO security_logs 
     (event_type, user_id, ip_address, user_agent, details) 
     VALUES ($1, $2, $3, $4, $5)`,
    [event.type, event.userId, event.ip, event.userAgent, event.details]
  );
  
  // Alert on suspicious activity
  if (event.severity === 'high') {
    await alertSecurityTeam(event);
  }
};

// Anomaly detection
const detectAnomalies = async (userId) => {
  const recentActivity = await db.query(
    `SELECT COUNT(*) as login_count, 
            COUNT(DISTINCT ip_address) as unique_ips
     FROM security_logs 
     WHERE user_id = $1 
       AND event_type = 'login'
       AND created_at > NOW() - INTERVAL 1 hour`,
    [userId]
  );
  
  if (recentActivity.login_count > 10 || recentActivity.unique_ips > 5) {
    await triggerSecurityAlert(userId, 'Suspicious login activity');
  }
};
```

## Security Testing Checklist
- [ ] Penetration testing performed
- [ ] Dependency vulnerabilities scanned
- [ ] Static code analysis completed
- [ ] Dynamic security testing done
- [ ] Container images scanned
- [ ] Infrastructure as Code reviewed
- [ ] Security headers configured
- [ ] SSL/TLS properly implemented
- [ ] Backup encryption verified
- [ ] Incident response plan tested
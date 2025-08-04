# Database Optimization Guide

Deep expertise for database performance tuning and optimization.

## PostgreSQL Performance

### Query Analysis & Optimization
```sql
-- Always start with EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT u.*, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.active = true
GROUP BY u.id;

-- Look for:
-- - Sequential scans on large tables
-- - High cost operations
-- - Actual time vs planned time discrepancies
-- - Buffer hits vs reads
```

### Index Strategies
```sql
-- Covering index for common queries
CREATE INDEX idx_users_email_active 
ON users(email, active) 
INCLUDE (name, created_at);

-- Partial index for filtered queries
CREATE INDEX idx_orders_pending 
ON orders(created_at) 
WHERE status = 'pending';

-- GIN index for full-text search
CREATE INDEX idx_posts_search 
ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- BRIN index for time-series data
CREATE INDEX idx_logs_created 
ON logs USING brin(created_at);

-- Expression index
CREATE INDEX idx_users_lower_email 
ON users(lower(email));
```

### Configuration Tuning
```ini
# postgresql.conf optimizations

# Memory settings
shared_buffers = 4GB              # 25% of RAM
effective_cache_size = 12GB       # 75% of RAM
work_mem = 64MB                   # Per operation
maintenance_work_mem = 1GB        # For VACUUM, indexes

# Checkpoint settings
checkpoint_segments = 32
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# Query planner
random_page_cost = 1.1           # For SSDs
cpu_tuple_cost = 0.01
cpu_index_tuple_cost = 0.005
cpu_operator_cost = 0.0025

# Parallel query
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
parallel_tuple_cost = 0.1

# Statistics
default_statistics_target = 100
track_io_timing = on
```

### Connection Pooling
```javascript
// PgBouncer configuration
const poolConfig = {
  // Application-side settings
  max: 20,                      // Maximum pool size
  min: 5,                       // Minimum pool size
  idleTimeoutMillis: 30000,     // Close idle connections
  connectionTimeoutMillis: 2000, // Connection timeout
  
  // PgBouncer settings (pgbouncer.ini)
  // pool_mode = transaction
  // max_client_conn = 1000
  // default_pool_size = 25
  // reserve_pool_size = 5
  // server_lifetime = 3600
};
```

### Performance Patterns
```sql
-- Batch operations
INSERT INTO user_events (user_id, event_type, data)
SELECT * FROM (VALUES
  (1, 'login', '{"ip": "1.2.3.4"}'),
  (2, 'purchase', '{"amount": 99.99}'),
  (3, 'logout', '{}')
) AS t(user_id, event_type, data);

-- Use CTEs for complex queries
WITH active_users AS (
  SELECT id, email FROM users WHERE active = true
),
recent_posts AS (
  SELECT user_id, COUNT(*) as count 
  FROM posts 
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY user_id
)
SELECT au.*, COALESCE(rp.count, 0) as recent_post_count
FROM active_users au
LEFT JOIN recent_posts rp ON au.id = rp.user_id;

-- Optimize pagination with cursors
SELECT * FROM posts
WHERE created_at < $1  -- cursor value
ORDER BY created_at DESC
LIMIT 20;
```

### Monitoring Queries
```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  stddev_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 100  -- queries averaging > 100ms
ORDER BY mean_time DESC
LIMIT 20;

-- Check for missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
  AND correlation < 0.1
ORDER BY n_distinct DESC;

-- Monitor table bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS external_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 20;
```

## Redis Optimization

### Data Structure Selection
```javascript
// Strings - Simple key-value
await redis.set('user:123:name', 'John Doe');
await redis.expire('user:123:name', 3600);

// Hashes - Object storage
await redis.hset('user:123', {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Lists - Queues, activity feeds
await redis.lpush('queue:emails', JSON.stringify(emailData));
const email = await redis.rpop('queue:emails');

// Sets - Unique collections
await redis.sadd('tags:post:123', 'javascript', 'nodejs', 'redis');
const tags = await redis.smembers('tags:post:123');

// Sorted Sets - Leaderboards, time-series
await redis.zadd('leaderboard', { score: 1000, value: 'user:123' });
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// HyperLogLog - Cardinality estimation
await redis.pfadd('unique:visitors:2024-01-01', 'user123', 'user456');
const count = await redis.pfcount('unique:visitors:2024-01-01');

// Bitmaps - Boolean flags
await redis.setbit('user:123:features', 5, 1); // Enable feature #5
const enabled = await redis.getbit('user:123:features', 5);
```

### Memory Optimization
```javascript
// Configure memory policies
await redis.configSet('maxmemory', '2gb');
await redis.configSet('maxmemory-policy', 'allkeys-lru');

// Use expiration strategically
await redis.setex('cache:api:response', 300, JSON.stringify(data));

// Compress large values
import zlib from 'zlib';
const compressed = zlib.gzipSync(JSON.stringify(largeObject));
await redis.set('data:compressed', compressed);

// Monitor memory usage
const info = await redis.info('memory');
console.log('Used memory:', info.used_memory_human);
console.log('Memory fragmentation:', info.mem_fragmentation_ratio);
```

### Performance Patterns
```javascript
// Pipeline for batch operations
const pipeline = redis.pipeline();
for (const user of users) {
  pipeline.hset(`user:${user.id}`, user);
  pipeline.expire(`user:${user.id}`, 3600);
}
await pipeline.exec();

// Lua scripts for atomic operations
const script = `
  local key = KEYS[1]
  local increment = ARGV[1]
  local current = redis.call('GET', key) or 0
  local new_value = tonumber(current) + tonumber(increment)
  redis.call('SET', key, new_value)
  redis.call('EXPIRE', key, 3600)
  return new_value
`;
const result = await redis.eval(script, 1, 'counter:123', 5);

// Pub/Sub for real-time updates
// Publisher
await redis.publish('updates:posts', JSON.stringify({
  action: 'created',
  postId: 123
}));

// Subscriber
redis.subscribe('updates:posts');
redis.on('message', (channel, message) => {
  const update = JSON.parse(message);
  // Handle update
});
```

### Redis Cluster
```javascript
// Cluster configuration
import { createCluster } from 'redis';

const cluster = createCluster({
  rootNodes: [
    { url: 'redis://127.0.0.1:7000' },
    { url: 'redis://127.0.0.1:7001' },
    { url: 'redis://127.0.0.1:7002' }
  ],
  defaults: {
    socket: { connectTimeout: 5000 },
    password: process.env.REDIS_PASSWORD
  }
});

// Handle cluster events
cluster.on('error', (err) => console.error('Cluster error:', err));
await cluster.connect();
```

## General Database Best Practices

### Query Optimization Checklist
- [ ] Use EXPLAIN/EXPLAIN ANALYZE
- [ ] Check index usage
- [ ] Avoid N+1 queries
- [ ] Use appropriate JOIN types
- [ ] Limit result sets early
- [ ] Avoid SELECT *
- [ ] Use prepared statements
- [ ] Batch similar operations

### Monitoring Metrics
- Query execution time
- Connection pool utilization
- Cache hit rates
- Lock waits/deadlocks
- Replication lag
- Disk I/O patterns
- Memory usage
- Index bloat

### Scaling Strategies
1. **Vertical Scaling**: Increase resources
2. **Read Replicas**: Distribute read load
3. **Sharding**: Horizontal partitioning
4. **Caching**: Redis/Memcached layer
5. **Connection Pooling**: Reduce overhead
6. **Query Optimization**: Improve efficiency
7. **Archival**: Move old data
8. **Denormalization**: Strategic redundancy
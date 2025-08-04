# Performance Optimization Guide

Comprehensive strategies for identifying and resolving performance bottlenecks.

## Performance Analysis Process

### 1. Measurement & Profiling
```javascript
// Browser Performance API
const measurePerformance = () => {
  // Navigation timing
  const navTiming = performance.getEntriesByType('navigation')[0];
  console.log('DOM Content Loaded:', navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart);
  console.log('Load Complete:', navTiming.loadEventEnd - navTiming.loadEventStart);
  
  // Resource timing
  const resources = performance.getEntriesByType('resource');
  resources.forEach(resource => {
    if (resource.duration > 1000) {
      console.warn('Slow resource:', resource.name, resource.duration);
    }
  });
  
  // Custom marks
  performance.mark('myFunction-start');
  myFunction();
  performance.mark('myFunction-end');
  performance.measure('myFunction', 'myFunction-start', 'myFunction-end');
};

// Node.js Performance Hooks
import { performance, PerformanceObserver } from 'perf_hooks';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
obs.observe({ entryTypes: ['measure'] });

// CPU Profiling
import v8Profiler from 'v8-profiler-next';

const profiler = v8Profiler.startProfiling('CPU profile');
await someHeavyOperation();
const profile = profiler.stopProfiling();
profile.export((error, result) => {
  fs.writeFileSync('cpu-profile.cpuprofile', result);
  profile.delete();
});
```

### 2. Frontend Performance

#### Bundle Size Optimization
```javascript
// Webpack configuration
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    // Tree shaking
    usedExports: true,
    // Minification
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  // Code splitting
  entry: {
    main: './src/index.js',
    admin: './src/admin.js',
  },
};

// Dynamic imports for code splitting
const loadAdminPanel = async () => {
  const { AdminPanel } = await import(
    /* webpackChunkName: "admin" */
    './components/AdminPanel'
  );
  return AdminPanel;
};
```

#### React Performance
```jsx
import { memo, useMemo, useCallback, lazy, Suspense } from 'react';

// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexVisualization data={data} />;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});

// Optimize re-renders
const OptimizedList = ({ items, onItemClick }) => {
  // Memoize computed values
  const sortedItems = useMemo(
    () => items.sort((a, b) => b.priority - a.priority),
    [items]
  );
  
  // Memoize callbacks
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <VirtualList
      items={sortedItems}
      height={600}
      itemHeight={50}
      renderItem={({ item }) => (
        <ListItem
          key={item.id}
          item={item}
          onClick={handleClick}
        />
      )}
    />
  );
};

// Lazy loading
const HeavyComponent = lazy(() => 
  import(/* webpackChunkName: "heavy" */ './HeavyComponent')
);

// Use React.Profiler for performance monitoring
<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>
```

#### Image Optimization
```jsx
// Next.js Image component
import Image from 'next/image';

const OptimizedImage = () => (
  <Image
    src="/hero.jpg"
    alt="Hero"
    width={1200}
    height={600}
    priority // Load immediately for LCP
    placeholder="blur"
    blurDataURL={blurDataUrl}
    quality={85}
    formats={['image/avif', 'image/webp']}
  />
);

// Progressive image loading
const ProgressiveImage = ({ src, placeholder }) => {
  const [imgSrc, setImgSrc] = useState(placeholder);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
  }, [src]);
  
  return <img src={imgSrc} loading="lazy" />;
};
```

### 3. Backend Performance

#### API Optimization
```javascript
// Response compression
import compression from 'compression';
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Implement caching
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });

const cachedEndpoint = async (req, res) => {
  const key = `${req.path}:${JSON.stringify(req.query)}`;
  const cached = cache.get(key);
  
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(cached);
  }
  
  const data = await expensiveOperation();
  cache.set(key, data);
  res.set('X-Cache', 'MISS');
  res.json(data);
};

// Implement pagination
const paginatedQuery = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  
  const [results, totalCount] = await Promise.all([
    db.query(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    ),
    db.query('SELECT COUNT(*) FROM posts')
  ]);
  
  res.json({
    data: results,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
};
```

#### Database Query Optimization
```javascript
// Batch operations
const batchInsert = async (users) => {
  const values = users.map((u, i) => 
    `($${i*3+1}, $${i*3+2}, $${i*3+3})`
  ).join(',');
  
  const params = users.flatMap(u => [u.name, u.email, u.role]);
  
  await db.query(
    `INSERT INTO users (name, email, role) VALUES ${values}`,
    params
  );
};

// Use database views for complex queries
await db.query(`
  CREATE MATERIALIZED VIEW user_statistics AS
  SELECT 
    u.id,
    u.name,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    MAX(p.created_at) as last_post_date
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  LEFT JOIN comments c ON u.id = c.user_id
  GROUP BY u.id, u.name;
`);

// Refresh materialized view periodically
setInterval(async () => {
  await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY user_statistics');
}, 3600000); // Every hour
```

### 4. Caching Strategies

#### Multi-Level Caching
```javascript
// L1: Application memory cache
const memoryCache = new Map();

// L2: Redis cache
import Redis from 'ioredis';
const redis = new Redis();

// L3: CDN cache (via headers)
const getCachedData = async (key) => {
  // Check L1
  if (memoryCache.has(key)) {
    return { data: memoryCache.get(key), source: 'memory' };
  }
  
  // Check L2
  const redisData = await redis.get(key);
  if (redisData) {
    const data = JSON.parse(redisData);
    memoryCache.set(key, data);
    setTimeout(() => memoryCache.delete(key), 60000); // 1 minute
    return { data, source: 'redis' };
  }
  
  // Fetch from source
  const data = await fetchFromDatabase(key);
  
  // Store in caches
  await redis.setex(key, 3600, JSON.stringify(data));
  memoryCache.set(key, data);
  
  return { data, source: 'database' };
};

// Cache invalidation
const invalidateCache = async (pattern) => {
  // Clear memory cache
  for (const key of memoryCache.keys()) {
    if (key.match(pattern)) {
      memoryCache.delete(key);
    }
  }
  
  // Clear Redis cache
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(...keys);
  }
  
  // Purge CDN cache
  await purgeCloudflareCache(pattern);
};
```

### 5. Monitoring & Metrics

#### Application Performance Monitoring
```javascript
// Custom metrics collection
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: new Map(),
      database: new Map(),
      cache: { hits: 0, misses: 0 }
    };
  }
  
  startTimer(category, label) {
    const key = `${category}:${label}`;
    this.metrics[category].set(key, Date.now());
  }
  
  endTimer(category, label) {
    const key = `${category}:${label}`;
    const start = this.metrics[category].get(key);
    if (start) {
      const duration = Date.now() - start;
      this.logMetric(category, label, duration);
      this.metrics[category].delete(key);
    }
  }
  
  logMetric(category, label, value) {
    // Send to monitoring service
    statsd.timing(`app.${category}.${label}`, value);
    
    // Log slow operations
    if (value > 1000) {
      console.warn(`Slow operation: ${category}.${label} took ${value}ms`);
    }
  }
}

// Middleware for request timing
const performanceMiddleware = (monitor) => (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    monitor.logMetric('http', `${req.method}_${req.route?.path || req.path}`, duration);
    
    if (duration > 3000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};
```

## Performance Checklist

### Frontend
- [ ] Bundle size < 200KB (gzipped)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] JavaScript code split

### Backend
- [ ] API response time < 200ms (p95)
- [ ] Database queries < 100ms
- [ ] Connection pooling configured
- [ ] Response compression enabled
- [ ] Caching strategy implemented
- [ ] Rate limiting in place
- [ ] Background jobs for heavy tasks

### Infrastructure
- [ ] CDN configured
- [ ] Auto-scaling enabled
- [ ] Load balancing setup
- [ ] Database indexes optimized
- [ ] Monitoring alerts configured
- [ ] Regular performance audits
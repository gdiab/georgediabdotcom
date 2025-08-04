# Deployment & CI/CD Guide

Best practices for continuous integration, deployment, and delivery pipelines.

## Vercel Deployment

### Automatic Deployments
```yaml
# vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true
    }
  },
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

### GitHub Actions for Vercel
```yaml
# .github/workflows/vercel-production.yml
name: Vercel Production Deployment

on:
  push:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Preview Deployments
```yaml
# .github/workflows/vercel-preview.yml
name: Vercel Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deployment
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
      
      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview URL: ${{ steps.vercel-deployment.outputs.preview-url }}`
            })
```

## CI Pipeline

### Testing & Quality Checks
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
      
      - name: Build
        run: npm run build
```

### Security Scanning
```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --production
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
  
  code-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run CodeQL
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript
      
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/sql-injection
```

## Database Migrations

### Automated Migration Strategy
```yaml
# .github/workflows/migrations.yml
name: Database Migrations

on:
  push:
    branches: [main]
    paths:
      - 'src/lib/db/migrations/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: |
          npm run db:migrate
          npm run db:seed -- --production
```

### Migration Safety
```typescript
// scripts/safe-migrate.ts
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

async function safeMigrate() {
  const connection = await db;
  
  try {
    // Start transaction
    await connection.execute(sql`BEGIN`);
    
    // Check current schema version
    const version = await connection
      .select()
      .from(sql`schema_migrations`)
      .orderBy(sql`version DESC`)
      .limit(1);
    
    console.log(`Current version: ${version[0].version}`);
    
    // Run migrations
    await runMigrations();
    
    // Verify data integrity
    await verifyDataIntegrity();
    
    // Commit if successful
    await connection.execute(sql`COMMIT`);
    console.log('Migration completed successfully');
  } catch (error) {
    // Rollback on error
    await connection.execute(sql`ROLLBACK`);
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
```

## Environment Management

### Environment Variables
```yaml
# .github/workflows/sync-env.yml
name: Sync Environment Variables

on:
  push:
    branches: [main]
    paths:
      - '.env.example'

jobs:
  sync-vercel-env:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Sync to Vercel
        run: |
          # Read .env.example and sync to Vercel
          while IFS= read -r line; do
            if [[ ! -z "$line" && ! "$line" =~ ^# ]]; then
              KEY=$(echo $line | cut -d'=' -f1)
              vercel env rm $KEY production --yes --token=${{ secrets.VERCEL_TOKEN }} || true
              vercel env add $KEY production < /dev/null --token=${{ secrets.VERCEL_TOKEN }}
            fi
          done < .env.example
```

## Release Management

### Semantic Versioning
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

### Rollback Strategy
```typescript
// scripts/rollback.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function rollback(deploymentId?: string) {
  try {
    if (deploymentId) {
      // Rollback to specific deployment
      await execAsync(
        `vercel alias set ${deploymentId} production --token=${process.env.VERCEL_TOKEN}`
      );
    } else {
      // Rollback to previous deployment
      const { stdout } = await execAsync(
        `vercel list --prod --token=${process.env.VERCEL_TOKEN}`
      );
      
      const deployments = parseDeployments(stdout);
      const previousDeployment = deployments[1]; // Skip current, get previous
      
      await execAsync(
        `vercel alias set ${previousDeployment.url} production --token=${process.env.VERCEL_TOKEN}`
      );
    }
    
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}
```

## Monitoring & Alerts

### Health Checks
```typescript
// app/api/health/route.ts
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  const checks = {
    database: false,
    redis: false,
    api: true,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Check database
    await db.execute(sql`SELECT 1`);
    checks.database = true;
    
    // Check Redis
    await redis.ping();
    checks.redis = true;
    
    const healthy = Object.values(checks).every(v => v === true || typeof v === 'string');
    
    return Response.json(checks, {
      status: healthy ? 200 : 503,
    });
  } catch (error) {
    return Response.json({
      ...checks,
      error: error.message,
    }, { status: 503 });
  }
}
```

### Deployment Notifications
```yaml
# .github/workflows/notify.yml
name: Deployment Notifications

on:
  deployment_status:

jobs:
  notify:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success' || github.event.deployment_status.state == 'failure'
    
    steps:
      - name: Send Slack Notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ github.event.deployment_status.state }}
          text: |
            Deployment ${{ github.event.deployment_status.state }}
            Environment: ${{ github.event.deployment.environment }}
            URL: ${{ github.event.deployment_status.target_url }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Best Practices

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] No linting errors
- [ ] Type checking passes
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Environment variables updated
- [ ] Documentation updated

### 2. Deployment Strategy
- Use feature flags for gradual rollouts
- Implement blue-green deployments
- Monitor error rates post-deployment
- Have rollback plan ready
- Test in staging first

### 3. Post-deployment
- Monitor application metrics
- Check error tracking
- Verify all features working
- Monitor performance metrics
- Update status page if needed
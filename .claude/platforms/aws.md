# AWS Services Guide

Configuration and best practices for AWS services integration.

## Core AWS Services

### S3 (Simple Storage Service)
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file
const uploadCommand = new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.jpg',
  Body: fileBuffer,
  ContentType: 'image/jpeg',
});
await s3Client.send(uploadCommand);

// Generate presigned URL
const getCommand = new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'path/to/file.jpg',
});
const presignedUrl = await getSignedUrl(s3Client, getCommand, { 
  expiresIn: 3600 
});
```

### CloudFront CDN
```typescript
// CloudFront configuration
const distribution = {
  Origins: [{
    DomainName: 's3.amazonaws.com/my-bucket',
    S3OriginConfig: {
      OriginAccessIdentity: 'origin-access-identity/cloudfront/ABCD'
    }
  }],
  DefaultCacheBehavior: {
    ViewerProtocolPolicy: 'redirect-to-https',
    Compress: true,
    CachePolicyId: 'managed-cache-policy-id',
    TTL: {
      DefaultTTL: 86400,
      MaxTTL: 31536000
    }
  }
};

// Invalidate cache
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

const cfClient = new CloudFrontClient({ region: 'us-east-1' });
await cfClient.send(new CreateInvalidationCommand({
  DistributionId: 'EDFDVBD6EXAMPLE',
  InvalidationBatch: {
    CallerReference: Date.now().toString(),
    Paths: {
      Quantity: 1,
      Items: ['/images/*']
    }
  }
}));
```

### RDS (Relational Database Service)
```typescript
// Connection pooling with RDS Proxy
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.RDS_PROXY_ENDPOINT,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Read replica configuration
const readPool = new Pool({
  host: process.env.RDS_READ_ENDPOINT,
  // ... same config
});
```

### ElastiCache (Redis)
```typescript
import { createClient } from 'redis';

const redis = createClient({
  socket: {
    host: process.env.ELASTICACHE_ENDPOINT,
    port: 6379,
    tls: true
  },
  password: process.env.ELASTICACHE_AUTH_TOKEN
});

await redis.connect();

// Cluster mode
import { createCluster } from 'redis';

const cluster = createCluster({
  rootNodes: [
    { url: 'redis://node1.cache.amazonaws.com:6379' },
    { url: 'redis://node2.cache.amazonaws.com:6379' }
  ],
  defaults: { password: process.env.REDIS_PASSWORD }
});
```

### Lambda Functions
```typescript
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambdaClient = new LambdaClient({ region: 'us-east-1' });

// Invoke function
const response = await lambdaClient.send(new InvokeCommand({
  FunctionName: 'image-processor',
  InvocationType: 'Event', // Async invocation
  Payload: JSON.stringify({ 
    imageUrl: 's3://bucket/image.jpg' 
  })
}));

// Lambda function handler
export const handler = async (event) => {
  try {
    // Process event
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### SQS (Simple Queue Service)
```typescript
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: 'us-east-1' });

// Send message
await sqsClient.send(new SendMessageCommand({
  QueueUrl: process.env.SQS_QUEUE_URL,
  MessageBody: JSON.stringify({
    action: 'process-image',
    imageId: '12345'
  }),
  MessageAttributes: {
    priority: { DataType: 'String', StringValue: 'high' }
  }
}));

// Receive and process messages
const { Messages } = await sqsClient.send(new ReceiveMessageCommand({
  QueueUrl: process.env.SQS_QUEUE_URL,
  MaxNumberOfMessages: 10,
  WaitTimeSeconds: 20 // Long polling
}));

for (const message of Messages || []) {
  // Process message
  await processMessage(JSON.parse(message.Body));
  
  // Delete message
  await sqsClient.send(new DeleteMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    ReceiptHandle: message.ReceiptHandle
  }));
}
```

### SNS (Simple Notification Service)
```typescript
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: 'us-east-1' });

// Publish to topic
await snsClient.send(new PublishCommand({
  TopicArn: process.env.SNS_TOPIC_ARN,
  Message: JSON.stringify({
    event: 'user-signup',
    userId: '12345',
    email: 'user@example.com'
  }),
  MessageAttributes: {
    eventType: { DataType: 'String', StringValue: 'user-signup' }
  }
}));
```

## Security Best Practices

### IAM Roles and Policies
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### Secrets Manager
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });

const getSecret = async (secretName: string) => {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const { SecretString } = await secretsClient.send(command);
  return JSON.parse(SecretString);
};

// Use in application
const dbConfig = await getSecret('prod/db/credentials');
```

### VPC Configuration
- Place RDS in private subnets
- Use security groups for access control
- Configure NAT Gateway for Lambda internet access
- Use VPC endpoints for AWS services

## Cost Optimization

### S3 Storage Classes
- Standard: Frequently accessed
- Standard-IA: Infrequent access
- Glacier: Long-term archive
- Intelligent-Tiering: Automatic optimization

### Auto Scaling
- Configure based on metrics
- Use target tracking policies
- Set appropriate cooldown periods
- Monitor costs with CloudWatch

### Reserved Instances
- Analyze usage patterns
- Purchase RIs for stable workloads
- Use Savings Plans for flexibility

## Monitoring and Logging

### CloudWatch
```typescript
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const cwClient = new CloudWatchClient({ region: 'us-east-1' });

// Custom metrics
await cwClient.send(new PutMetricDataCommand({
  Namespace: 'MyApp',
  MetricData: [{
    MetricName: 'ProcessingTime',
    Value: processingTime,
    Unit: 'Milliseconds',
    Dimensions: [{ Name: 'Environment', Value: 'production' }]
  }]
}));
```

### X-Ray Tracing
```typescript
import AWSXRay from 'aws-xray-sdk-core';
import AWS from 'aws-sdk';

// Wrap AWS SDK
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Custom segments
const segment = AWSXRay.getSegment();
const subsegment = segment.addNewSubsegment('database-query');
try {
  const result = await query();
  subsegment.close();
  return result;
} catch (error) {
  subsegment.addError(error);
  subsegment.close();
  throw error;
}
```
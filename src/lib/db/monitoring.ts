import { sql } from 'drizzle-orm';
import { db } from './index';

/**
 * Database performance monitoring utilities
 */

export interface QueryPerformanceMetrics {
  query: string;
  calls: number;
  totalTime: number;
  meanTime: number;
  minTime: number;
  maxTime: number;
  stddevTime: number;
  rows: number;
}

export interface DatabaseMetrics {
  connectionCount: number;
  activeConnections: number;
  idleConnections: number;
  databaseSize: string;
  tableStats: TableStats[];
  slowQueries: QueryPerformanceMetrics[];
  indexUsage: IndexUsageStats[];
}

export interface TableStats {
  tableName: string;
  rowCount: number;
  tableSize: string;
  indexSize: string;
  totalSize: string;
}

export interface IndexUsageStats {
  schemaName: string;
  tableName: string;
  indexName: string;
  indexUsage: number;
  indexScans: number;
  tupleReads: number;
  tupleReadsRatio: number;
}

export interface ConnectionStats {
  state: string;
  count: number;
}

/**
 * Database monitoring utilities
 */
export const monitoringQueries = {
  /**
   * Get current connection statistics
   */
  async getConnectionStats(): Promise<ConnectionStats[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state
        ORDER BY count DESC;
      `);
      
      return result as unknown as ConnectionStats[];
    } catch (error) {
      console.error('Failed to get connection stats:', error);
      return [];
    }
  },

  /**
   * Get database size information
   */
  async getDatabaseSize(): Promise<string> {
    try {
      const result = await db.execute(sql`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size;
      `);
      
      return ((result as any)[0] as any)?.size || '0 bytes';
    } catch (error) {
      console.error('Failed to get database size:', error);
      return '0 bytes';
    }
  },

  /**
   * Get table statistics (size, row counts)
   */
  async getTableStats(): Promise<TableStats[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename as table_name,
          n_tup_ins + n_tup_upd + n_tup_del as row_count,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
          pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) + pg_indexes_size(schemaname||'.'||tablename)) as total_size
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
      `);
      
      return (result as any).map((row: any) => ({
        tableName: row.table_name,
        rowCount: parseInt(row.row_count) || 0,
        tableSize: row.table_size,
        indexSize: row.index_size,
        totalSize: row.total_size,
      }));
    } catch (error) {
      console.error('Failed to get table stats:', error);
      return [];
    }
  },

  /**
   * Get slow query statistics (requires pg_stat_statements extension)
   */
  async getSlowQueries(limit = 10): Promise<QueryPerformanceMetrics[]> {
    try {
      // Check if pg_stat_statements extension is available
      const extensionCheck = await db.execute(sql`
        SELECT EXISTS(
          SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
        ) as has_extension;
      `);
      
      const hasExtension = ((extensionCheck as any)[0] as any)?.has_extension;
      
      if (!hasExtension) {
        console.warn('pg_stat_statements extension not available for query monitoring');
        return [];
      }

      const result = await db.execute(sql`
        SELECT 
          query,
          calls,
          total_exec_time as total_time,
          mean_exec_time as mean_time,
          min_exec_time as min_time,
          max_exec_time as max_time,
          stddev_exec_time as stddev_time,
          rows
        FROM pg_stat_statements
        WHERE calls > 1
        ORDER BY total_exec_time DESC
        LIMIT ${limit};
      `);
      
      return result as unknown as QueryPerformanceMetrics[];
    } catch (error) {
      console.error('Failed to get slow queries:', error);
      return [];
    }
  },

  /**
   * Get index usage statistics
   */
  async getIndexUsage(): Promise<IndexUsageStats[]> {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname as schema_name,
          tablename as table_name,
          indexname as index_name,
          ROUND(
            CASE 
              WHEN idx_scan + seq_scan = 0 THEN 0
              ELSE (100.0 * idx_scan) / (idx_scan + seq_scan)
            END, 2
          ) as index_usage,
          idx_scan as index_scans,
          idx_tup_read as tuple_reads,
          ROUND(
            CASE 
              WHEN idx_scan = 0 THEN 0
              ELSE idx_tup_read::float / idx_scan
            END, 2
          ) as tuple_reads_ratio
        FROM pg_stat_user_indexes ui
        JOIN pg_stat_user_tables ut USING (schemaname, tablename)
        WHERE schemaname = 'public'
        ORDER BY index_usage DESC, index_scans DESC;
      `);
      
      return result as unknown as IndexUsageStats[];
    } catch (error) {
      console.error('Failed to get index usage:', error);
      return [];
    }
  },

  /**
   * Get comprehensive database metrics
   */
  async getDatabaseMetrics(): Promise<DatabaseMetrics> {
    try {
      const [
        connectionStats,
        databaseSize,
        tableStats,
        slowQueries,
        indexUsage,
      ] = await Promise.all([
        this.getConnectionStats(),
        this.getDatabaseSize(),
        this.getTableStats(),
        this.getSlowQueries(5),
        this.getIndexUsage(),
      ]);

      const totalConnections = connectionStats.reduce((sum, stat) => sum + stat.count, 0);
      const activeConnections = connectionStats.find(stat => stat.state === 'active')?.count || 0;
      const idleConnections = connectionStats.find(stat => stat.state === 'idle')?.count || 0;

      return {
        connectionCount: totalConnections,
        activeConnections,
        idleConnections,
        databaseSize,
        tableStats,
        slowQueries,
        indexUsage,
      };
    } catch (error) {
      console.error('Failed to get database metrics:', error);
      throw error;
    }
  },

  /**
   * Check database health
   */
  async getDatabaseHealth(): Promise<{
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const metrics = await this.getDatabaseMetrics();
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for high connection count
      if (metrics.connectionCount > 100) {
        issues.push(`High connection count: ${metrics.connectionCount}`);
        recommendations.push('Consider implementing connection pooling');
      }

      // Check for unused indexes
      const unusedIndexes = metrics.indexUsage.filter(index => 
        index.indexScans === 0 && !index.indexName.includes('pkey')
      );
      
      if (unusedIndexes.length > 0) {
        issues.push(`Found ${unusedIndexes.length} unused indexes`);
        recommendations.push('Review and consider dropping unused indexes to improve write performance');
      }

      // Check for tables without proper indexing
      const tablesWithoutIndexes = metrics.indexUsage.filter(index => 
        index.indexUsage < 10 && index.indexScans > 0
      );
      
      if (tablesWithoutIndexes.length > 0) {
        issues.push(`Found ${tablesWithoutIndexes.length} potentially under-indexed tables`);
        recommendations.push('Review query patterns and consider adding appropriate indexes');
      }

      // Check for slow queries
      if (metrics.slowQueries.length > 0) {
        const slowestQuery = metrics.slowQueries[0];
        if (slowestQuery.meanTime > 1000) { // > 1 second average
          issues.push(`Slow queries detected (slowest avg: ${slowestQuery.meanTime.toFixed(2)}ms)`);
          recommendations.push('Optimize slow queries using EXPLAIN ANALYZE and proper indexing');
        }
      }

      return {
        isHealthy: issues.length === 0,
        issues,
        recommendations,
      };
    } catch (error) {
      console.error('Failed to check database health:', error);
      return {
        isHealthy: false,
        issues: ['Failed to retrieve database health metrics'],
        recommendations: ['Check database connection and permissions'],
      };
    }
  },

  /**
   * Reset query statistics (requires pg_stat_statements)
   */
  async resetQueryStats(): Promise<boolean> {
    try {
      await db.execute(sql`SELECT pg_stat_statements_reset();`);
      console.log('Query statistics reset successfully');
      return true;
    } catch (error) {
      console.error('Failed to reset query statistics:', error);
      return false;
    }
  },
};

/**
 * Performance monitoring middleware for queries
 */
export function createQueryMonitor() {
  const queryTimes = new Map<string, number[]>();

  return {
    /**
     * Start timing a query
     */
    startQuery(queryName: string): () => void {
      const startTime = Date.now();
      
      return () => {
        const duration = Date.now() - startTime;
        
        if (!queryTimes.has(queryName)) {
          queryTimes.set(queryName, []);
        }
        
        queryTimes.get(queryName)!.push(duration);
        
        // Log slow queries (> 1 second)
        if (duration > 1000) {
          console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
        }
      };
    },

    /**
     * Get query performance summary
     */
    getQueryStats() {
      const stats = new Map();
      
      for (const [queryName, times] of Array.from(queryTimes.entries())) {
        const total = times.reduce((sum, time) => sum + time, 0);
        const avg = total / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);
        
        stats.set(queryName, {
          calls: times.length,
          totalTime: total,
          avgTime: avg,
          minTime: min,
          maxTime: max,
        });
      }
      
      return Object.fromEntries(stats);
    },

    /**
     * Clear query statistics
     */
    clearStats() {
      queryTimes.clear();
    },
  };
}

// Global query monitor instance
export const queryMonitor = createQueryMonitor();
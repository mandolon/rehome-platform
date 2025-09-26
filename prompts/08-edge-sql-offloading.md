# P8 Edge/SQL Offloading Scenario

🔹 **Goal**: Document strategy for high-volume queries and heavy filtering/sorting while keeping app layer thin and Vapor-ready.  
🔹 **Context**: Push expensive operations into SQL and Edge Functions, ensuring scalable performance for Requests and similar features.  
🔹 **Date**: September 24, 2025

## Overview

This document outlines a comprehensive strategy for offloading expensive operations from the application layer to SQL databases and Edge Functions, ensuring optimal performance for high-volume scenarios while maintaining clean, thin controllers that are ready for Laravel Vapor deployment.

## 1. SQL Strategy

### Window Functions & Aggregations

**Objective**: Use advanced SQL features to handle complex calculations at the database level.

```sql
-- Example: Request SLA tracking with window functions
CREATE VIEW request_sla_metrics AS
SELECT 
    r.id,
    r.title,
    r.status,
    r.created_at,
    r.updated_at,
    -- Calculate business hours elapsed
    EXTRACT(EPOCH FROM (
        CASE 
            WHEN r.status = 'closed' THEN r.updated_at 
            ELSE NOW() 
        END - r.created_at
    )) / 3600 AS hours_elapsed,
    
    -- Ranking within priority group
    ROW_NUMBER() OVER (
        PARTITION BY r.priority 
        ORDER BY r.created_at ASC
    ) AS priority_queue_position,
    
    -- Rolling averages for team performance
    AVG(EXTRACT(EPOCH FROM (r.updated_at - r.created_at)) / 3600) 
        OVER (
            PARTITION BY r.assigned_to 
            ORDER BY r.created_at 
            ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
        ) AS assignee_avg_resolution_hours
FROM requests r
WHERE r.deleted_at IS NULL;
```

### Materialized Views for Heavy Aggregations

**Objective**: Pre-compute expensive aggregations and refresh them strategically.

```sql
-- Dashboard metrics materialized view
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT 
    DATE_TRUNC('day', created_at) AS metric_date,
    status,
    priority,
    assigned_to,
    COUNT(*) AS request_count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) AS avg_resolution_hours,
    PERCENTILE_CONT(0.5) WITHIN GROUP (
        ORDER BY EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600
    ) AS median_resolution_hours
FROM requests 
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
    AND deleted_at IS NULL
GROUP BY DATE_TRUNC('day', created_at), status, priority, assigned_to;

-- Refresh strategy (can be triggered by cron or application events)
CREATE INDEX CONCURRENTLY idx_dashboard_metrics_date_status 
ON dashboard_metrics (metric_date, status);
```

### Row-Level Security & Policies

**Objective**: Enforce permissions at the database level, not in application code.

```sql
-- Enable RLS on requests table
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see requests they created or are assigned to
CREATE POLICY request_access_policy ON requests
    FOR ALL TO application_role
    USING (
        created_by = current_setting('app.current_user_id')::integer
        OR assigned_to = current_setting('app.current_user_id')::integer
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::integer 
            AND role = 'admin'
        )
    );

-- Policy for dashboard metrics (respects same access rules)
CREATE POLICY dashboard_metrics_access_policy ON dashboard_metrics
    FOR SELECT TO application_role
    USING (
        assigned_to = current_setting('app.current_user_id')::integer
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::integer 
            AND role IN ('admin', 'manager')
        )
    );
```

### Thin Controller Implementation

**Backend**: Laravel controllers that leverage SQL views and policies.

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RequestsController extends Controller
{
    /**
     * Get filtered requests using SQL view - no PHP filtering needed
     */
    public function index(Request $request)
    {
        // Set user context for RLS policies
        DB::statement("SELECT set_config('app.current_user_id', ?, false)", [
            auth()->id()
        ]);
        
        $query = DB::table('request_sla_metrics');
        
        // All filtering/sorting happens in SQL - no PHP array operations
        if ($request->has('status')) {
            $query->whereIn('status', $request->input('status'));
        }
        
        if ($request->has('priority_queue_only')) {
            $query->where('priority_queue_position', '<=', 10);
        }
        
        if ($request->has('sla_breached')) {
            $query->where('hours_elapsed', '>', 24); // 24-hour SLA
        }
        
        return $query
            ->orderBy($request->input('sort', 'created_at'), 
                     $request->input('direction', 'desc'))
            ->paginate($request->input('per_page', 25));
    }
    
    /**
     * Get dashboard metrics - pre-computed, no real-time aggregation
     */
    public function dashboardMetrics(Request $request)
    {
        DB::statement("SELECT set_config('app.current_user_id', ?, false)", [
            auth()->id()
        ]);
        
        $dateRange = $request->input('days', 30);
        
        return DB::table('dashboard_metrics')
            ->where('metric_date', '>=', now()->subDays($dateRange))
            ->get()
            ->groupBy(['metric_date', 'status']);
    }
}
```

## 2. Edge Functions Strategy

### Authentication & Authorization Pre-checks

**Objective**: Validate permissions at the edge before hitting the main API.

```javascript
// Edge Function: /api/edge/requests-auth-check
export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get('X-User-ID');
    const authToken = request.headers.get('Authorization');
    
    // Fast auth validation using Edge KV or Redis
    const userPermissions = await EDGE_KV.get(`user:${userId}:permissions`);
    
    if (!userPermissions) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    const permissions = JSON.parse(userPermissions);
    const requestedResource = searchParams.get('resource');
    
    // Check if user can access the requested resource
    if (!permissions.resources.includes(requestedResource)) {
        return new Response('Forbidden', { status: 403 });
    }
    
    // Add permission context to headers and proxy to main API
    const apiUrl = `${process.env.API_BASE_URL}/api/requests`;
    const response = await fetch(apiUrl, {
        method: request.method,
        headers: {
            ...request.headers,
            'X-User-Permissions': JSON.stringify(permissions),
            'X-Edge-Validated': 'true'
        },
        body: request.body
    });
    
    return response;
}
```

### Hot Query Caching

**Objective**: Cache frequently accessed data at the edge for millisecond responses.

```javascript
// Edge Function: /api/edge/requests-cached
export default async function handler(request) {
    const { pathname, searchParams } = new URL(request.url);
    const userId = request.headers.get('X-User-ID');
    
    // Create cache key based on user and query parameters
    const cacheKey = `requests:${userId}:${searchParams.toString()}`;
    
    // Try to get from edge cache first
    let cachedResponse = await EDGE_KV.get(cacheKey);
    
    if (cachedResponse) {
        return new Response(cachedResponse, {
            headers: {
                'Content-Type': 'application/json',
                'X-Cache': 'HIT',
                'Cache-Control': 'max-age=30' // 30-second edge cache
            }
        });
    }
    
    // Cache miss - fetch from API and cache the result
    const apiResponse = await fetch(`${process.env.API_BASE_URL}${pathname}`, {
        method: request.method,
        headers: request.headers,
        body: request.body
    });
    
    const responseData = await apiResponse.text();
    
    // Cache for hot queries (open requests, recent activity)
    if (searchParams.get('status') === 'open' || 
        searchParams.get('recent') === 'true') {
        await EDGE_KV.put(cacheKey, responseData, {
            expirationTtl: 30 // 30-second TTL
        });
    }
    
    return new Response(responseData, {
        headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'MISS'
        }
    });
}
```

### Per-Tenant Optimization

**Objective**: Isolate and optimize data access patterns per tenant/organization.

```javascript
// Edge Function: /api/edge/tenant-requests
export default async function handler(request) {
    const tenantId = request.headers.get('X-Tenant-ID');
    const userId = request.headers.get('X-User-ID');
    
    // Tenant-specific cache namespace
    const tenantCacheKey = `tenant:${tenantId}:requests:summary`;
    
    // Check if tenant data is cached
    let tenantSummary = await EDGE_KV.get(tenantCacheKey);
    
    if (!tenantSummary) {
        // Fetch tenant-specific pre-aggregated data
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/internal/tenant/${tenantId}/summary`,
            {
                headers: {
                    'X-Internal-Auth': process.env.INTERNAL_API_KEY
                }
            }
        );
        
        tenantSummary = await response.text();
        
        // Cache tenant summary for 5 minutes
        await EDGE_KV.put(tenantCacheKey, tenantSummary, {
            expirationTtl: 300
        });
    }
    
    return new Response(tenantSummary, {
        headers: {
            'Content-Type': 'application/json',
            'X-Tenant-Cache': 'true'
        }
    });
}
```

## 3. App Integration

### Frontend: Optimized Data Fetching

**Objective**: Hit cached/filtered endpoints; avoid manual array filtering in React.

```typescript
// src/lib/api/requests.ts
export class RequestsAPI {
    /**
     * Get requests using edge-cached endpoint with SQL-level filtering
     */
    static async getRequests(filters: RequestFilters): Promise<RequestsResponse> {
        const searchParams = new URLSearchParams();
        
        // All filtering parameters sent to SQL - no client-side filtering
        if (filters.status) {
            filters.status.forEach(status => 
                searchParams.append('status[]', status)
            );
        }
        
        if (filters.priorityQueueOnly) {
            searchParams.set('priority_queue_only', 'true');
        }
        
        if (filters.slaBreached) {
            searchParams.set('sla_breached', 'true');
        }
        
        // Hit edge function for caching + auth pre-check
        const response = await fetch(
            `/api/edge/requests-cached?${searchParams.toString()}`,
            {
                headers: {
                    'X-User-ID': getCurrentUserId(),
                    'Authorization': getAuthToken()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return response.json();
    }
    
    /**
     * Get dashboard metrics from materialized view via edge cache
     */
    static async getDashboardMetrics(days: number = 30): Promise<DashboardMetrics> {
        const response = await fetch(
            `/api/edge/dashboard-metrics?days=${days}`,
            {
                headers: {
                    'X-User-ID': getCurrentUserId(),
                    'Authorization': getAuthToken()
                }
            }
        );
        
        return response.json();
    }
}
```

### React Components: No Manual Filtering

```typescript
// src/components/requests/RequestsList.tsx
export function RequestsList() {
    const [filters, setFilters] = useState<RequestFilters>({});
    
    // Use React Query for caching + automatic retries
    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests', filters],
        queryFn: () => RequestsAPI.getRequests(filters),
        staleTime: 30000, // Consider fresh for 30 seconds
        gcTime: 300000,   // Keep in cache for 5 minutes
    });
    
    // No manual filtering - all done at SQL level
    return (
        <div>
            <RequestFilters onChange={setFilters} />
            
            {isLoading ? (
                <RequestsSkeleton />
            ) : (
                <div>
                    {requests?.data.map(request => (
                        <RequestCard 
                            key={request.id} 
                            request={request}
                            // SLA info pre-computed in SQL view
                            slaStatus={request.hours_elapsed > 24 ? 'breached' : 'ok'}
                            queuePosition={request.priority_queue_position}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
```

### Laravel Vapor Optimization

**Objective**: Ensure the application layer remains stateless and database-driven.

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class VaporOptimizationProvider extends ServiceProvider
{
    public function boot()
    {
        // Enable Aurora Serverless v2 optimizations
        DB::connection()->getPdo()->setAttribute(
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false
        );
        
        // Set row-level security context early in request lifecycle
        if (auth()->check()) {
            DB::statement("SELECT set_config('app.current_user_id', ?, false)", [
                auth()->id()
            ]);
            
            DB::statement("SELECT set_config('app.current_tenant_id', ?, false)", [
                auth()->user()->tenant_id ?? 'default'
            ]);
        }
    }
}
```

## 4. Verification & Benchmarking

### Performance Testing Script

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Request;

class BenchmarkSQLVsApp extends Command
{
    protected $signature = 'benchmark:sql-vs-app {--records=10000}';
    
    public function handle()
    {
        $recordCount = $this->option('records');
        
        $this->info("Benchmarking with {$recordCount} records...");
        
        // Test 1: SQL View vs Laravel Collection filtering
        $this->benchmarkFiltering($recordCount);
        
        // Test 2: SQL Aggregation vs PHP calculation
        $this->benchmarkAggregation($recordCount);
        
        // Test 3: RLS vs Manual Authorization
        $this->benchmarkAuthorization($recordCount);
    }
    
    private function benchmarkFiltering(int $recordCount)
    {
        $this->info("\n=== Filtering Benchmark ===");
        
        // SQL Approach (using view)
        $sqlStart = microtime(true);
        $sqlResults = DB::table('request_sla_metrics')
            ->where('status', 'open')
            ->where('hours_elapsed', '>', 24)
            ->orderBy('priority_queue_position')
            ->limit(100)
            ->get();
        $sqlTime = microtime(true) - $sqlStart;
        
        // App Approach (load all then filter)
        $appStart = microtime(true);
        $appResults = Request::all()
            ->filter(fn($r) => $r->status === 'open')
            ->filter(fn($r) => $r->created_at->diffInHours() > 24)
            ->sortBy('priority')
            ->take(100);
        $appTime = microtime(true) - $appStart;
        
        $this->table(['Method', 'Time (seconds)', 'Results Count'], [
            ['SQL View', number_format($sqlTime, 4), $sqlResults->count()],
            ['App Filtering', number_format($appTime, 4), $appResults->count()],
            ['Performance Gain', number_format($appTime / $sqlTime, 2) . 'x faster', '']
        ]);
    }
}
```

### Permission Verification Tests

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Request;
use Illuminate\Support\Facades\DB;

class EdgeSQLPermissionsTest extends TestCase
{
    public function test_row_level_security_enforced()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $request1 = Request::factory()->create(['created_by' => $user1->id]);
        $request2 = Request::factory()->create(['created_by' => $user2->id]);
        
        // Set user context for RLS
        DB::statement("SELECT set_config('app.current_user_id', ?, false)", [$user1->id]);
        
        $visibleRequests = DB::table('request_sla_metrics')->get();
        
        // User should only see their own requests
        $this->assertCount(1, $visibleRequests);
        $this->assertEquals($request1->id, $visibleRequests->first()->id);
    }
    
    public function test_materialized_view_respects_permissions()
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();
        
        // Create requests for both users
        Request::factory()->count(5)->create(['created_by' => $user->id]);
        Request::factory()->count(3)->create(['created_by' => $admin->id]);
        
        // Test admin can see aggregated metrics for all users
        DB::statement("SELECT set_config('app.current_user_id', ?, false)", [$admin->id]);
        $adminMetrics = DB::table('dashboard_metrics')->get();
        $this->assertGreaterThan(0, $adminMetrics->count());
        
        // Test regular user sees only their metrics
        DB::statement("SELECT set_config('app.current_user_id', ?, false)", [$user->id]);
        $userMetrics = DB::table('dashboard_metrics')->get();
        
        // Verify user can only see metrics for their assigned requests
        foreach ($userMetrics as $metric) {
            $this->assertEquals($user->id, $metric->assigned_to);
        }
    }
}
```

### Full Test Suite Execution

```bash
# Verify no regressions in existing functionality
php artisan test --coverage --min=80

# Run frontend tests to ensure API contract maintained  
cd frontend && npm run test -- --run

# Performance regression tests
php artisan benchmark:sql-vs-app --records=50000

# Edge function testing (if deployed)
curl -H "X-User-ID: 123" \
     -H "Authorization: Bearer token" \
     https://edge.rehome-platform.com/api/edge/requests-cached
```

## 5. Implementation Phases

### Phase 1: SQL Foundation (Week 1)
- [ ] Create SQL views for request metrics and SLA tracking
- [ ] Implement row-level security policies
- [ ] Create materialized views for dashboard metrics
- [ ] Update Laravel controllers to use views instead of Eloquent filtering

### Phase 2: Edge Functions (Week 2)
- [ ] Set up Edge Function infrastructure (Vercel/Cloudflare)
- [ ] Implement auth pre-check functions
- [ ] Add hot query caching with 30-second TTL
- [ ] Deploy tenant-specific optimization functions

### Phase 3: Frontend Integration (Week 3)
- [ ] Update API client to use edge endpoints
- [ ] Remove client-side filtering logic from React components
- [ ] Add React Query for intelligent caching
- [ ] Implement loading states optimized for edge responses

### Phase 4: Vapor Preparation (Week 4)
- [ ] Configure Aurora Serverless v2 connection pooling
- [ ] Add RLS context setting to middleware
- [ ] Performance test under simulated Vapor load
- [ ] Documentation and deployment guides

## Success Metrics

- **Query Performance**: 10x+ improvement for filtered request lists
- **Edge Cache Hit Rate**: >80% for hot queries (open requests, dashboard)
- **Database CPU**: <30% utilization under peak load
- **API Response Times**: <200ms for cached endpoints, <500ms for uncached
- **Test Coverage**: Maintain >80% coverage with no regressions
- **Security**: All permissions enforced at DB/Edge level, not app layer

## Risk Mitigation

1. **Database Performance**: Index all filtered columns, monitor slow query log
2. **Cache Invalidation**: Use time-based TTL + event-driven invalidation
3. **Edge Function Reliability**: Graceful fallback to main API if edge fails
4. **RLS Overhead**: Benchmark policy complexity vs performance gain
5. **Development Complexity**: Maintain dev/staging environments with same SQL views

---

**Next Steps**: Begin Phase 1 implementation with SQL view creation and benchmarking against current Eloquent-based filtering.
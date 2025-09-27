# Test Commands for Feature Test Audit

## Commands to Surface Gaps Fast

### 1. Random Order + Repeats (Flakiness Detection)
```bash
# Run tests in random order with repeats to detect flaky tests
vendor/bin/phpunit --order-by=random --random-order-seed=$(date +%s) --repeat 25

# Windows PowerShell equivalent
vendor/bin/phpunit --order-by=random --random-order-seed=$((Get-Date).Ticks) --repeat 25
```

### 2. Per-Test Timing (Slow Spots)
```bash
# Run tests with verbose output and timing information
vendor/bin/phpunit --verbose --testdox

# Run specific test class with timing
vendor/bin/phpunit --verbose --testdox tests/Feature/Requests/PerformanceTest.php
```

### 3. Coverage Analysis (HTML Report)
```bash
# Generate HTML coverage report in coverage/ directory
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage

# Windows PowerShell equivalent
$env:XDEBUG_MODE="coverage"; vendor/bin/phpunit --coverage-html coverage

# Generate coverage for specific test suite
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage tests/Feature/Requests/
```

### 4. Strict Testing (Fail on Risky/Deprecations)
```bash
# Run tests with strict mode (already configured in phpunit.xml)
vendor/bin/phpunit

# Run with additional strict options
vendor/bin/phpunit --strict-coverage --disallow-test-output
```

### 5. Performance Testing
```bash
# Run performance tests only
vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php

# Run with memory usage tracking
vendor/bin/phpunit --verbose tests/Feature/Requests/PerformanceTest.php
```

### 6. Authorization Testing
```bash
# Run authorization tests only
vendor/bin/phpunit tests/Feature/Requests/AuthorizationTest.php

# Run with data provider details
vendor/bin/phpunit --verbose tests/Feature/Requests/AuthorizationTest.php
```

### 7. Validation Testing
```bash
# Run validation tests only
vendor/bin/phpunit tests/Feature/Requests/ValidationTest.php

# Run with stop on failure
vendor/bin/phpunit --stop-on-failure tests/Feature/Requests/ValidationTest.php
```

### 8. Filtering Testing
```bash
# Run filtering tests only
vendor/bin/phpunit tests/Feature/Requests/FilteringTest.php

# Run with coverage for filtering logic
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage tests/Feature/Requests/FilteringTest.php
```

## Test Execution Strategies

### 1. Continuous Integration Testing
```bash
# Full test suite with coverage
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage --coverage-clover coverage/clover.xml

# Fast test suite (no coverage)
vendor/bin/phpunit --exclude-group slow

# Critical path testing
vendor/bin/phpunit tests/Feature/Requests/AuthorizationTest.php tests/Feature/Requests/PerformanceTest.php
```

### 2. Development Testing
```bash
# Quick test run during development
vendor/bin/phpunit --stop-on-failure

# Test specific functionality
vendor/bin/phpunit --filter test_can_create_request

# Test with database transactions
vendor/bin/phpunit --group database
```

### 3. Debugging Tests
```bash
# Run with debug output
vendor/bin/phpunit --verbose --debug

# Run single test with debug
vendor/bin/phpunit --verbose --debug tests/Feature/Requests/AuthorizationTest.php::test_role_authorization_matrix

# Run with error details
vendor/bin/phpunit --verbose --stop-on-error
```

## Test Data Management

### 1. Database Testing
```bash
# Run tests with fresh database
vendor/bin/phpunit --env=testing

# Run tests with specific database
DB_DATABASE=testing vendor/bin/phpunit

# Run tests with database transactions
vendor/bin/phpunit --group transaction
```

### 2. Factory Testing
```bash
# Run tests that use factories
vendor/bin/phpunit --group factory

# Run tests with specific factory
vendor/bin/phpunit --filter RequestFactory
```

## Performance Benchmarks

### 1. Baseline Performance
```bash
# Establish baseline performance
time vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php

# Run performance tests multiple times
for i in {1..5}; do time vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php; done
```

### 2. Memory Usage
```bash
# Run with memory usage tracking
vendor/bin/phpunit --verbose --debug tests/Feature/Requests/PerformanceTest.php

# Run with memory limit
php -d memory_limit=256M vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php
```

## Test Reporting

### 1. JUnit XML (CI Integration)
```bash
# Generate JUnit XML for CI
vendor/bin/phpunit --log-junit coverage/junit.xml

# Generate multiple report formats
vendor/bin/phpunit --coverage-html coverage --coverage-clover coverage/clover.xml --log-junit coverage/junit.xml
```

### 2. Test Results Analysis
```bash
# Run tests and save output
vendor/bin/phpunit --verbose > test-results.txt 2>&1

# Run tests with timing
time vendor/bin/phpunit --verbose > test-results-with-timing.txt 2>&1
```

## Troubleshooting

### 1. Common Issues
```bash
# Clear test cache
php artisan test:clear

# Reset database
php artisan migrate:fresh --seed

# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 2. Debug Mode
```bash
# Run with debug mode
APP_DEBUG=true vendor/bin/phpunit --verbose

# Run with specific environment
APP_ENV=testing vendor/bin/phpunit --verbose
```

## Recommended Workflow

### 1. Development Phase
```bash
# Quick test run
vendor/bin/phpunit --stop-on-failure

# Run specific test
vendor/bin/phpunit --filter test_can_create_request
```

### 2. Pre-commit Phase
```bash
# Full test suite
vendor/bin/phpunit

# Run with coverage
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage
```

### 3. CI/CD Phase
```bash
# Full test suite with all reports
XDEBUG_MODE=coverage vendor/bin/phpunit --coverage-html coverage --coverage-clover coverage/clover.xml --log-junit coverage/junit.xml
```

### 4. Performance Testing Phase
```bash
# Run performance tests
vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php

# Run with timing
time vendor/bin/phpunit tests/Feature/Requests/PerformanceTest.php
```

## Test Groups (Recommended)

Add these groups to your test classes:

```php
/**
 * @group authorization
 * @group critical
 */
class AuthorizationTest extends TestCase { ... }

/**
 * @group performance
 * @group slow
 */
class PerformanceTest extends TestCase { ... }

/**
 * @group validation
 * @group critical
 */
class ValidationTest extends TestCase { ... }

/**
 * @group filtering
 * @group medium
 */
class FilteringTest extends TestCase { ... }
```

Then run specific groups:
```bash
# Run only critical tests
vendor/bin/phpunit --group critical

# Run only performance tests
vendor/bin/phpunit --group performance

# Exclude slow tests
vendor/bin/phpunit --exclude-group slow
```

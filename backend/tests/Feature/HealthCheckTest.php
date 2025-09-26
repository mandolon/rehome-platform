<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * A basic health check test.
     */
    public function test_application_responds(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test that the application environment is set correctly.
     */
    public function test_application_environment(): void
    {
        $this->assertEquals('testing', app()->environment());
    }

    /**
     * Test that database connection works.
     */
    public function test_database_connection(): void
    {
        $this->assertDatabaseCount('users', 0);
    }

    /**
     * Test that basic configuration is loaded.
     */
    public function test_application_configuration(): void
    {
        $this->assertNotEmpty(config('app.name'));
        $this->assertNotEmpty(config('app.env'));
    }
}

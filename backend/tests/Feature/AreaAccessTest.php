<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AreaAccessTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_can_access_admin_routes()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        // Admin should be able to access admin routes
        $response = $this->get('/admin/tasks');
        $response->assertStatus(200); // Admin can access admin routes
    }

    public function test_non_admin_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        // Non-admin should get 403 Forbidden
        $response = $this->get('/admin/tasks');
        $response->assertStatus(403);
    }

    public function test_contributor_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'CONSULTANT']);
        Sanctum::actingAs($user);
        
        // Consultant should get 403 Forbidden
        $response = $this->get('/admin/tasks');
        $response->assertStatus(403);
    }

    public function test_viewer_cannot_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'CLIENT']);
        Sanctum::actingAs($user);
        
        // Client should get 403 Forbidden
        $response = $this->get('/admin/tasks');
        $response->assertStatus(403);
    }
}

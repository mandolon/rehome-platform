<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EnsureRoleWiringTest extends TestCase
{
    use RefreshDatabase;


    public function test_ensure_role_allows_admin_to_admin_area()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        $response = $this->get('/admin/health');
        $response->assertStatus(200);
    }

    public function test_ensure_role_blocks_non_admin_from_admin_area()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        $response = $this->get('/admin/health');
        $response->assertStatus(403);
    }

    public function test_ensure_role_allows_spa_roles_to_spa_area()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        // This will fail workspace check but pass role check
        $response = $this->get('/api/app/health');
        $response->assertStatus(400); // Missing workspace, not 403 (role denied)
    }

    public function test_ensure_role_blocks_admin_from_spa_area()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        $response = $this->get('/api/app/health');
        $response->assertStatus(403); // Role denied
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AreaEnforcementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_cannot_access_spa_routes()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        // ADMIN should be blocked from SPA routes
        $response = $this->get('/api/app/health');
        $response->assertStatus(403);
        
        // Also test other SPA routes
        $response = $this->get('/api/app/requests');
        $response->assertStatus(403);
    }

    public function test_team_cannot_access_admin_routes()
    {
        $team = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($team);
        
        // TEAM should be blocked from admin routes
        $response = $this->get('/admin/health');
        $response->assertStatus(403);
        
        // Also test other admin routes
        $response = $this->get('/admin/tasks');
        $response->assertStatus(403);
    }

    public function test_consultant_cannot_access_admin_routes()
    {
        $consultant = User::factory()->create(['role' => 'CONSULTANT']);
        Sanctum::actingAs($consultant);
        
        // CONSULTANT should be blocked from admin routes
        $response = $this->get('/admin/health');
        $response->assertStatus(403);
    }

    public function test_client_cannot_access_admin_routes()
    {
        $client = User::factory()->create(['role' => 'CLIENT']);
        Sanctum::actingAs($client);
        
        // CLIENT should be blocked from admin routes
        $response = $this->get('/admin/health');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_routes()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        // ADMIN should be able to access admin routes
        $response = $this->get('/admin/health');
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok', 'area' => 'admin']);
    }

    public function test_spa_roles_can_access_spa_routes_with_workspace()
    {
        $workspace = \App\Models\Workspace::factory()->create();
        
        // Test TEAM role
        $team = User::factory()->create(['role' => 'TEAM']);
        $team->workspaces()->attach($workspace->id);
        Sanctum::actingAs($team);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertStatus(200);
        
        // Test CONSULTANT role
        $consultant = User::factory()->create(['role' => 'CONSULTANT']);
        $consultant->workspaces()->attach($workspace->id);
        Sanctum::actingAs($consultant);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertStatus(200);
        
        // Test CLIENT role
        $client = User::factory()->create(['role' => 'CLIENT']);
        $client->workspaces()->attach($workspace->id);
        Sanctum::actingAs($client);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertStatus(200);
    }
}

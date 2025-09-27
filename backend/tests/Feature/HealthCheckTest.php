<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;


    public function test_admin_health_check_returns_200()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        $response = $this->get('/admin/health');
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok', 'area' => 'admin']);
    }

    public function test_spa_health_check_returns_200_for_member()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/health", [
            'X-Workspace-Id' => $workspace->id
        ]);
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok', 'area' => 'spa']);
    }

    public function test_spa_health_check_returns_403_for_non_member()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        // User is NOT a member of the workspace
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/health", [
            'X-Workspace-Id' => $workspace->id
        ]);
        $response->assertStatus(403);
    }

    public function test_workspace_creation_api_works()
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($admin);
        
        $response = $this->postJson('/admin/workspaces', [
            'name' => 'Test Workspace'
        ]);
        
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'name',
            'owner_id',
            'created_at',
            'updated_at'
        ]);
        
        $this->assertDatabaseHas('workspaces', [
            'name' => 'Test Workspace',
            'owner_id' => $admin->id
        ]);
    }
}
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RbacWiringTest extends TestCase
{
    use RefreshDatabase;


    public function test_blocks_non_admin_from_admin_routes()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        $response = $this->get('/admin/tasks');
        $response->assertForbidden();
    }

    public function test_allows_admin_to_access_admin_routes()
    {
        $user = User::factory()->create(['role' => 'ADMIN']);
        Sanctum::actingAs($user);
        
        $response = $this->get('/admin/tasks');
        $response->assertOk();
    }

    public function test_allows_team_in_spa_when_member()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertOk();
    }

    public function test_blocks_non_member_from_spa_routes()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        // User is NOT a member of the workspace
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertForbidden();
    }

    public function test_blocks_wrong_role_from_spa_routes()
    {
        $user = User::factory()->create(['role' => 'ADMIN']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertForbidden();
    }

    public function test_allows_consultant_in_spa_when_member()
    {
        $user = User::factory()->create(['role' => 'CONSULTANT']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertOk();
    }

    public function test_allows_client_in_spa_when_member()
    {
        $user = User::factory()->create(['role' => 'CLIENT']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertOk();
    }

    public function test_requires_workspace_header_for_spa_routes()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        // Try to access without workspace in URL or header
        $response = $this->get('/api/app/workspaces/999/projects');
        $response->assertForbidden(); // Should fail because user is not member of workspace 999
    }
}

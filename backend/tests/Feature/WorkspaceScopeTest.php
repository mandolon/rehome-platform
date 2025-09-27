<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WorkspaceScopeTest extends TestCase
{
    use RefreshDatabase;


    public function test_workspace_member_can_perform_crud_operations()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        
        // Add user as member of workspace using many-to-many relationship
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        // Test CRUD operations with workspace header
        $headers = ['X-Workspace-Id' => $workspace->id];
        
        // CREATE
        $response = $this->postJson('/api/app/requests', [
            'title' => 'Test Request',
            'body' => 'Test body'
        ], $headers);
        $response->assertStatus(201);
        
        $requestId = $response->json('id');
        
        // READ
        $response = $this->getJson("/api/app/requests/{$requestId}", $headers);
        $response->assertStatus(200);
        
        // READ LIST
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(200);
        
        // UPDATE
        $response = $this->patchJson("/api/app/requests/{$requestId}", [
            'title' => 'Updated Request'
        ], $headers);
        $response->assertStatus(200);
        
        // COMMENT (additional CRUD operation)
        $response = $this->postJson("/api/app/requests/{$requestId}/comment", [
            'body' => 'Test comment'
        ], $headers);
        $response->assertStatus(201);
    }

    public function test_non_member_cannot_access_workspace_resources()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        
        // User is NOT a member of the workspace
        Sanctum::actingAs($user);
        
        $headers = ['X-Workspace-Id' => $workspace->id];
        
        // Should get 403 Forbidden for all operations
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(403);
        
        $response = $this->postJson('/api/app/requests', [
            'title' => 'Test Request',
            'body' => 'Test body'
        ], $headers);
        $response->assertStatus(403);
    }

    public function test_wrong_workspace_returns_403()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace1 = Workspace::factory()->create();
        $workspace2 = Workspace::factory()->create();
        
        // User is member of workspace1 but not workspace2
        $user->workspaces()->attach($workspace1->id);
        
        Sanctum::actingAs($user);
        
        // Try to access workspace2 resources
        $headers = ['X-Workspace-Id' => $workspace2->id];
        
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(403);
    }

    public function test_workspace_owner_can_access_resources()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create(['owner_id' => $user->id]);
        
        // Add user as member of workspace
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $headers = ['X-Workspace-Id' => $workspace->id];
        
        // Workspace owner should be able to access resources
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(200);
    }

    public function test_missing_workspace_id_returns_400()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        // No workspace header provided
        $response = $this->getJson('/api/app/requests');
        $response->assertStatus(400);
    }

    public function test_nonexistent_workspace_returns_403()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        $headers = ['X-Workspace-Id' => 99999]; // Non-existent workspace
        
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(403); // Returns 403 because user is not member of non-existent workspace
    }

    public function test_admin_can_access_app_routes()
    {
        $user = User::factory()->create(['role' => 'ADMIN']);
        $workspace = Workspace::factory()->create();
        
        // Add admin as member of workspace
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $headers = ['X-Workspace-Id' => $workspace->id];
        
        // Admin should NOT be able to access SPA routes (only admin routes)
        $response = $this->getJson('/api/app/requests', $headers);
        $response->assertStatus(403);
    }

    public function test_team_not_in_workspace_cannot_access_projects()
    {
        $team = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        
        // User is NOT a member of the workspace
        Sanctum::actingAs($team);
        
        // Should get 403 Forbidden when trying to access projects
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertStatus(403);
    }

    public function test_team_in_workspace_can_access_projects()
    {
        $team = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        
        // Add user as member of workspace
        $team->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($team);
        
        // Should be able to access projects when member of workspace
        $response = $this->get("/api/app/workspaces/{$workspace->id}/projects");
        $response->assertStatus(200);
        $response->assertJson(['workspace' => $workspace->id, 'projects' => []]);
    }
}

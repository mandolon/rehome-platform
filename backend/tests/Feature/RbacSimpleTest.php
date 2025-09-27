<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacSimpleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_area(): void
    {
        $admin = User::factory()->create(['role' => 'ADMIN']);
        
        $response = $this->actingAs($admin)
            ->get('/admin/health');
            
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok', 'area' => 'admin']);
    }

    public function test_team_can_access_app_area_but_not_admin(): void
    {
        $team = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        
        // Add user to workspace
        $team->workspaces()->attach($workspace);
        
        // Should be able to access app area with workspace
        $response = $this->actingAs($team)
            ->get("/api/app/workspaces/{$workspace->id}/projects");
            
        $response->assertStatus(200);
        $response->assertJson(['workspace' => $workspace->id, 'projects' => []]);
        
        // Should NOT be able to access admin area
        $response = $this->actingAs($team)
            ->get('/admin/health');
            
        $response->assertStatus(403);
    }

    public function test_consultant_can_access_app_area(): void
    {
        $consultant = User::factory()->create(['role' => 'CONSULTANT']);
        $workspace = Workspace::factory()->create();
        
        // Add user to workspace
        $consultant->workspaces()->attach($workspace);
        
        $response = $this->actingAs($consultant)
            ->get("/api/app/workspaces/{$workspace->id}/projects");
            
        $response->assertStatus(200);
        $response->assertJson(['workspace' => $workspace->id, 'projects' => []]);
    }

    public function test_client_can_access_app_area(): void
    {
        $client = User::factory()->create(['role' => 'CLIENT']);
        $workspace = Workspace::factory()->create();
        
        // Add user to workspace
        $client->workspaces()->attach($workspace);
        
        $response = $this->actingAs($client)
            ->get("/api/app/workspaces/{$workspace->id}/projects");
            
        $response->assertStatus(200);
        $response->assertJson(['workspace' => $workspace->id, 'projects' => []]);
    }

    public function test_viewer_cannot_access_any_area(): void
    {
        $viewer = User::factory()->create(['role' => 'CLIENT']); // Use CLIENT as the lowest role
        
        // Should NOT be able to access admin area
        $response = $this->actingAs($viewer)
            ->get('/admin/health');
            
        $response->assertStatus(403);
        
        // Should NOT be able to access app area without workspace membership
        $workspace = Workspace::factory()->create();
        $response = $this->actingAs($viewer)
            ->get("/api/app/workspaces/{$workspace->id}/projects");
            
        $response->assertStatus(403);
    }
}

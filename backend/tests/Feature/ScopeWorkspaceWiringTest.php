<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ScopeWorkspaceWiringTest extends TestCase
{
    use RefreshDatabase;


    public function test_scope_workspace_allows_member_access()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        $user->workspaces()->attach($workspace->id);
        
        Sanctum::actingAs($user);
        
        $response = $this->get('/api/app/health', [
            'X-Workspace-Id' => $workspace->id
        ]);
        $response->assertStatus(200);
    }

    public function test_scope_workspace_blocks_non_member_access()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        $workspace = Workspace::factory()->create();
        // User is NOT a member of the workspace
        
        Sanctum::actingAs($user);
        
        $response = $this->get('/api/app/health', [
            'X-Workspace-Id' => $workspace->id
        ]);
        $response->assertStatus(403);
    }

    public function test_scope_workspace_requires_workspace_header()
    {
        $user = User::factory()->create(['role' => 'TEAM']);
        Sanctum::actingAs($user);
        
        $response = $this->get('/api/app/health');
        $response->assertStatus(400); // Missing workspace header
    }
}

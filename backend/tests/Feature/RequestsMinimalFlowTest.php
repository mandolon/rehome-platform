<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Request as RequestModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RequestsMinimalFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Ensure Sanctum middleware is enabled for tests
        config(['app.key' => Str::random(32)]);
    }

    public function test_minimal_create_comment_assign_status_flow(): void
    {
        // Arrange: create admin and team user
        $admin = User::factory()->create(['role' => 'admin']);
        $team  = User::factory()->create(['role' => 'team_member']);

        Sanctum::actingAs($admin);

        // 1) Create request
        $createResp = $this->postJson('/api/requests', [
            'title' => 'Test R',
        ]);
        $createResp->assertCreated();
        $requestId = $createResp->json('id');
        $this->assertNotEmpty($requestId);
        $this->assertSame('open', $createResp->json('status'));
        $this->assertSame($admin->id, $createResp->json('creator_id'));

        // 2) Comment on the request
        $commentResp = $this->postJson("/api/requests/{$requestId}/comment", [
            'body' => 'hi',
        ]);
        $commentResp->assertCreated();
        $this->assertSame($requestId, $commentResp->json('request_id'));
        $this->assertSame('hi', $commentResp->json('body'));

        // 3) Assign the request to team member
        $assignResp = $this->postJson("/api/requests/{$requestId}/assign", [
            'assignee_id' => $team->id,
        ]);
        $assignResp->assertOk();
        $this->assertSame($team->id, $assignResp->json('assignee_id'));

        // 4) Set status to in_progress
        $statusResp = $this->postJson("/api/requests/{$requestId}/status", [
            'status' => 'in_progress',
        ]);
        $statusResp->assertOk();
        $this->assertSame('in_progress', $statusResp->json('status'));

        // 5) Get request and verify structure
        $showResp = $this->getJson("/api/requests/{$requestId}");
        $showResp->assertOk()
            ->assertJsonStructure([
                'id',
                'title',
                'status',
                'creator' => ['id', 'name', 'email'],
                'assignee' => [
                    // assignee may be null structure; guard accordingly in assertions below
                ],
                'comments',
            ]);

        // Ensure at least one comment returned
        $this->assertGreaterThanOrEqual(1, count($showResp->json('comments') ?? []));

        // Ensure assignee is correct
        $this->assertSame($team->id, $showResp->json('assignee.id'));
    }
}

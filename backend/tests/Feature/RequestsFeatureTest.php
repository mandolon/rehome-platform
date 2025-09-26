<?php

namespace Tests\Feature;

use App\Models\Request as RequestModel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RequestsFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Use sqlite memory if configured; otherwise, the testbench will handle
    }

    public function test_can_create_comment_assign_and_update_status_on_request(): void
    {
        $creator = User::factory()->projectManager()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->create();

        // Creator creates a request
        $this->actingAs($creator)
            ->postJson('/api/requests', [
                'title' => 'Need access to repo',
                'assignee_id' => $assignee->id,
            ])
            ->assertCreated()
            ->assertJsonFragment(['title' => 'Need access to repo']);

        $model = RequestModel::firstOrFail();

        // Creator comments
        $this->actingAs($creator)
            ->postJson("/api/requests/{$model->id}/comment", [
                'body' => 'Please handle ASAP',
            ])
            ->assertCreated()
            ->assertJsonFragment(['body' => 'Please handle ASAP']);

        // Creator assigns to a different user
        $this->actingAs($creator)
            ->postJson("/api/requests/{$model->id}/assign", [
                'assignee_id' => $other->id,
            ])
            ->assertOk()
            ->assertJsonFragment(['assignee_id' => $other->id]);

        // Assignee updates status
        $this->actingAs($other)
            ->postJson("/api/requests/{$model->id}/status", [
                'status' => 'in_progress',
            ])
            ->assertOk()
            ->assertJsonFragment(['status' => 'in_progress']);

        // List visible to creator should include it
        $this->actingAs($creator)
            ->getJson('/api/requests')
            ->assertOk()
            ->assertJsonFragment(['title' => 'Need access to repo']);
    }
}
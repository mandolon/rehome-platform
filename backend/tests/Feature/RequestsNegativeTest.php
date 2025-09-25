<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Request as WorkRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class RequestsNegativeTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function guest_cannot_create_request(): void
    {
        $this->postJson('/api/requests', ['title' => 'Nope'])
            ->assertStatus(401);
    }

    #[Test]
    public function creating_request_requires_title(): void
    {
        $user = User::factory()->teamMember()->create();
        $this->actingAs($user);

        $this->postJson('/api/requests', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    #[Test]
    public function invalid_status_is_rejected_with_422(): void
    {
        $creator  = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create([
            'creator_id'  => $creator->id,
            'assignee_id' => $assignee->id,
            'status'      => 'open',
        ]);

        $this->postJson("/api/requests/{$req->id}/status", ['status' => 'bogus'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function assign_requires_existing_user_id(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id, 'status' => 'open']);

        $this->postJson("/api/requests/{$req->id}/assign", ['assignee_id' => 999999])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }

    #[Test]
    public function comment_requires_body(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id, 'status' => 'open']);

        $this->postJson("/api/requests/{$req->id}/comment", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    #[Test]
    public function guest_cannot_access_requests_list(): void
    {
        $this->getJson('/api/requests')
            ->assertStatus(401);
    }

    #[Test]
    public function guest_cannot_view_request_details(): void
    {
        $req = WorkRequest::factory()->create();
        
        $this->getJson("/api/requests/{$req->id}")
            ->assertStatus(401);
    }

    #[Test]
    public function non_creator_non_assignee_cannot_update_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        
        $req = WorkRequest::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id  // Make sure assignee is set
        ]);

        // Test the policy directly first
        $this->assertFalse($other->can('update', $req));
        
        $this->actingAs($other)
            ->putJson("/api/requests/{$req->id}", ['title' => 'Hacked'])
            ->assertStatus(403);
    }

    #[Test]
    public function assignee_can_update_but_cannot_delete_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        
        $req = WorkRequest::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);

        // Test the policy directly first
        $this->assertTrue($assignee->can('update', $req));  // Assignee can update
        $this->assertFalse($assignee->can('delete', $req)); // But cannot delete
        $this->assertTrue($creator->can('delete', $req));   // Creator can delete
        
        // Assignee can update
        $this->actingAs($assignee)
            ->putJson("/api/requests/{$req->id}", ['title' => 'Updated by assignee'])
            ->assertStatus(200);
            
        // But assignee cannot delete
        $this->actingAs($assignee)
            ->deleteJson("/api/requests/{$req->id}")
            ->assertStatus(403);
    }

    #[Test]
    public function assignee_id_must_be_valid_integer(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id]);

        $this->postJson("/api/requests/{$req->id}/assign", ['assignee_id' => 'not-a-number'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }

    #[Test]
    public function title_cannot_exceed_max_length(): void
    {
        $user = User::factory()->teamMember()->create();
        $this->actingAs($user);

        $longTitle = str_repeat('a', 256); // 256 characters, exceeds 255 limit

        $this->postJson('/api/requests', ['title' => $longTitle])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    #[Test]
    public function non_creator_non_assignee_cannot_delete_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        
        $req = WorkRequest::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);

        // Test the policy directly first
        $this->assertFalse($other->can('delete', $req));
        
        $this->actingAs($other)
            ->deleteJson("/api/requests/{$req->id}")
            ->assertStatus(403);
    }

    #[Test]
    public function non_creator_non_assignee_cannot_view_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        
        $req = WorkRequest::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);

        // Test the policy directly first
        $this->assertFalse($other->can('view', $req));
        
        $this->actingAs($other)
            ->getJson("/api/requests/{$req->id}")
            ->assertStatus(403);
    }

    #[Test]
    public function invalid_assignee_id_format_is_rejected(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id]);

        $this->postJson("/api/requests/{$req->id}/assign", ['assignee_id' => 'invalid'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }

    #[Test] 
    public function status_update_requires_valid_status(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id]);

        $this->postJson("/api/requests/{$req->id}/status", ['status' => 'invalid_status'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function status_update_requires_status_field(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id]);

        $this->postJson("/api/requests/{$req->id}/status", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function assign_requires_assignee_id_field(): void
    {
        $creator = User::factory()->teamMember()->create();
        $this->actingAs($creator);

        $req = WorkRequest::factory()->create(['creator_id' => $creator->id]);

        $this->postJson("/api/requests/{$req->id}/assign", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }
}

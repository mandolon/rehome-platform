<?php

namespace Tests\Feature;

use App\Models\Request;
use App\Models\RequestComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class RequestsApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test users
        $this->user = User::factory()->create(['role' => 'team_member']);
        $this->otherUser = User::factory()->create(['role' => 'team_member']);
    }

    #[Test]
    public function index_returns_200_with_expected_json_structure()
    {
        // Create some test requests
        $request1 = Request::factory()->create([
            'creator_id' => $this->user->id,
            'assignee_id' => $this->otherUser->id,
        ]);
        
        $request2 = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/requests');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'status',
                        'creator_id',
                        'assignee_id',
                        'created_at',
                        'updated_at',
                        'creator' => [
                            'id',
                            'name',
                            'email',
                        ],
                        'assignee' => [
                            'id',
                            'name',
                            'email',
                        ],
                    ],
                ],
                'current_page',
                'last_page',
                'per_page',
                'total',
                'from',
                'to',
            ]);

        // Should include requests where user is requester, assignee, or participant
        $this->assertCount(2, $response->json('data'));
    }

    #[Test]
    public function index_only_shows_requests_user_can_view()
    {
        // Create requests the user can view
        $userRequest = Request::factory()->create(['creator_id' => $this->user->id]);
        $assignedRequest = Request::factory()->create(['assignee_id' => $this->user->id]);
        
        // Create request the user cannot view
        $otherRequest = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/requests');

        $response->assertStatus(200);
        
        $requestIds = collect($response->json('data'))->pluck('id')->toArray();
        
        $this->assertContains($userRequest->id, $requestIds);
        $this->assertContains($assignedRequest->id, $requestIds);
        $this->assertNotContains($otherRequest->id, $requestIds);
    }

    #[Test]
    public function store_creates_request_with_valid_data()
    {
        $requestData = [
            'title' => 'Test Request',
            'assignee_id' => $this->otherUser->id,
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/requests', $requestData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'title',
                'status',
                'creator_id',
                'assignee_id',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('requests', [
            'title' => 'Test Request',
            'creator_id' => $this->user->id,
            'assignee_id' => $this->otherUser->id,
            'status' => 'open',
        ]);
    }

    #[Test]
    public function store_validates_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/requests', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    #[Test]
    public function store_validates_assignee_exists()
    {
        $requestData = [
            'title' => 'Test Request',
            'assignee_id' => 99999, // Non-existent user
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/requests', $requestData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }

    #[Test]
    public function show_returns_request_with_comments()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);
        
        // Add some comments
        RequestComment::factory()->count(2)->create([
            'request_id' => $request->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/requests/{$request->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'title',
                'status',
                'creator_id',
                'assignee_id',
                'creator' => [
                    'id',
                    'name',
                    'email',
                ],
                'assignee',
                'comments' => [
                    '*' => [
                        'id',
                        'request_id',
                        'user_id',
                        'body',
                        'created_at',
                        'updated_at',
                        'user' => [
                            'id',
                            'name',
                            'email',
                        ],
                    ],
                ],
            ]);

        $this->assertCount(2, $response->json('comments'));
    }

    #[Test]
    public function show_denies_access_to_unauthorized_users()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/requests/{$request->id}");

        $response->assertStatus(403);
    }

    #[Test]
    public function comment_adds_comment_to_request()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);
        
        $commentData = [
            'body' => 'This is a test comment',
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/comment", $commentData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'request_id',
                'user_id',
                'body',
                'created_at',
                'updated_at',
            ]);

        $this->assertDatabaseHas('request_comments', [
            'request_id' => $request->id,
            'user_id' => $this->user->id,
            'body' => 'This is a test comment',
        ]);
    }

    #[Test]
    public function comment_validates_required_body()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/comment", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    #[Test]
    public function status_changes_to_valid_status()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->user->id,
            'status' => 'open',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/status", [
                'status' => 'in_progress',
            ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'in_progress',
        ]);
    }

    #[Test]
    public function status_validates_against_allowed_statuses()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/status", [
                'status' => 'invalid_status',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    #[Test]
    public function status_only_allows_valid_status_values()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        foreach (Request::STATUSES as $status) {
            $response = $this->actingAs($this->user)
                ->postJson("/api/requests/{$request->id}/status", [
                    'status' => $status,
                ]);

            $response->assertStatus(200);
        }
    }

    #[Test]
    public function assign_sets_assignee_id()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/assign", [
                'assignee_id' => $this->otherUser->id,
            ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'assignee_id' => $this->otherUser->id,
        ]);
    }

    #[Test]
    public function assign_validates_user_exists()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/assign", [
                'assignee_id' => 99999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['assignee_id']);
    }

    #[Test]
    public function assign_checks_policy_permissions()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->otherUser->id,
        ]);

        // User who is not requester, assignee, or admin should not be able to assign
        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/assign", [
                'assignee_id' => $this->otherUser->id,
            ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function assign_allows_requester_to_assign()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/requests/{$request->id}/assign", [
                'assignee_id' => $this->otherUser->id,
            ]);

        $response->assertStatus(200);
    }

    #[Test]
    public function assign_allows_admin_to_assign()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $request = Request::factory()->create(['creator_id' => $this->otherUser->id]);

        $response = $this->actingAs($admin)
            ->postJson("/api/requests/{$request->id}/assign", [
                'assignee_id' => $this->user->id,
            ]);

        $response->assertStatus(200);
    }

    #[Test]
    public function update_modifies_request_fields()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->user->id,
            'title' => 'Original Title',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/requests/{$request->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'title' => 'Updated Title',
        ]);
    }

    #[Test]
    public function update_checks_policy_permissions()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/requests/{$request->id}", [
                'title' => 'Unauthorized Update',
            ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function delete_removes_request()
    {
        $request = Request::factory()->create(['creator_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/requests/{$request->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseMissing('requests', [
            'id' => $request->id,
        ]);
    }

    #[Test]
    public function delete_checks_policy_permissions()
    {
        $request = Request::factory()->create([
            'creator_id' => $this->otherUser->id,
            'assignee_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/requests/{$request->id}");

        $response->assertStatus(403);
    }

    #[Test]
    public function api_requires_authentication()
    {
        $response = $this->getJson('/api/requests');
        $response->assertStatus(401);

        $response = $this->postJson('/api/requests', ['title' => 'Test']);
        $response->assertStatus(401);

        $request = Request::factory()->create();
        $response = $this->getJson("/api/requests/{$request->id}");
        $response->assertStatus(401);
    }
}
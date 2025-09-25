<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Request;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class RequestPolicyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function creator_can_delete_own_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($creator->can('delete', $req));
    }

    #[Test]
    public function admin_can_delete_any_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $admin = User::factory()->admin()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($admin->can('delete', $req));
    }

    #[Test]
    public function assignee_cannot_delete_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertFalse($assignee->can('delete', $req));
    }

    #[Test]
    public function non_creator_non_assignee_cannot_delete_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertFalse($other->can('delete', $req));
    }

    #[Test]
    public function creator_can_update_own_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($creator->can('update', $req));
    }

    #[Test]
    public function assignee_can_update_assigned_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertTrue($assignee->can('update', $req));
    }

    #[Test]
    public function admin_can_update_any_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $admin = User::factory()->admin()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($admin->can('update', $req));
    }

    #[Test]
    public function non_creator_non_assignee_cannot_update_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertFalse($other->can('update', $req));
    }

    #[Test]
    public function creator_can_assign_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($creator->can('assign', $req));
    }

    #[Test]
    public function admin_can_assign_any_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $admin = User::factory()->admin()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($admin->can('assign', $req));
    }

    #[Test]
    public function assignee_cannot_assign_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertFalse($assignee->can('assign', $req));
    }

    #[Test]
    public function creator_can_view_own_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($creator->can('view', $req));
    }

    #[Test]
    public function assignee_can_view_assigned_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertTrue($assignee->can('view', $req));
    }

    #[Test]
    public function admin_can_view_any_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $admin = User::factory()->admin()->create();
        $req = Request::factory()->create(['creator_id' => $creator->id]);
        $this->assertTrue($admin->can('view', $req));
    }

    #[Test]
    public function non_creator_non_assignee_cannot_view_request(): void
    {
        $creator = User::factory()->teamMember()->create();
        $assignee = User::factory()->teamMember()->create();
        $other = User::factory()->teamMember()->create();
        $req = Request::factory()->create([
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id
        ]);
        $this->assertFalse($other->can('view', $req));
    }
}

<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Request",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Fix login issue"),
 *     @OA\Property(property="body", type="string", example="Users cannot log in with valid credentials"),
 *     @OA\Property(property="status", type="string", enum={"open", "in_progress", "blocked", "resolved", "closed"}, example="open"),
 *     @OA\Property(property="creator_id", type="integer", example=1),
 *     @OA\Property(property="assignee_id", type="integer", nullable=true, example=2),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="creator", type="object", ref="#/components/schemas/User"),
 *     @OA\Property(property="assignee", type="object", nullable=true, ref="#/components/schemas/User"),
 *     @OA\Property(property="participants", type="array", @OA\Items(ref="#/components/schemas/RequestParticipant"))
 * )
 * 
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", example="john@example.com"),
 *     @OA\Property(property="role", type="string", enum={"admin", "manager", "contributor", "viewer"}, example="contributor")
 * )
 * 
 * @OA\Schema(
 *     schema="RequestParticipant",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="request_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="user", type="object", ref="#/components/schemas/User")
 * )
 */
class RequestSchemas
{
    // This class exists only to hold OpenAPI schema definitions
}

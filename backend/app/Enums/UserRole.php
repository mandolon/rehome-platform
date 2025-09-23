<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case PROJECT_MANAGER = 'project_manager';
    case TEAM_MEMBER = 'team_member';
    case CLIENT = 'client';

    /**
     * Get all role values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role label
     */
    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::PROJECT_MANAGER => 'Project Manager',
            self::TEAM_MEMBER => 'Team Member',
            self::CLIENT => 'Client',
        };
    }

    /**
     * Check if role has admin privileges
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role can manage projects
     */
    public function canManageProjects(): bool
    {
        return in_array($this, [self::ADMIN, self::PROJECT_MANAGER]);
    }

    /**
     * Check if role has team access
     */
    public function hasTeamAccess(): bool
    {
        return in_array($this, [self::ADMIN, self::PROJECT_MANAGER, self::TEAM_MEMBER]);
    }
}
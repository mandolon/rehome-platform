<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Residential Project - Active
        \App\Models\Project::create([
            'name' => 'Sunset Ridge Residential Complex',
            'code' => 'RH-2024-001',
            'description' => 'A modern 50-unit residential complex with sustainable design features including solar panels, energy-efficient HVAC systems, and green building materials.',
            'type' => 'residential',
            'status' => 'construction',
            'location' => '123 Sunset Ridge Drive, Austin, TX',
            'budget' => 8500000.00,
            'start_date' => '2024-01-15',
            'end_date' => '2025-06-30',
            'created_by' => 1, // Admin
            'project_manager_id' => 2, // Michael Chen
            'team_members' => [2, 3, 4, 5, 7], // PM, Architect, Engineer, Contractor, Supervisor
            'client_name' => 'Thompson Real Estate Group',
            'client_contact' => 'lisa@thompsonrealestate.com',
            'notes' => 'High-priority project with sustainability certifications required.',
            'is_active' => true,
        ]);

        // Commercial Project - Planning
        \App\Models\Project::create([
            'name' => 'Downtown Office Tower',
            'code' => 'RH-2024-002',
            'description' => '25-story mixed-use office tower with retail space on ground floor and parking garage.',
            'type' => 'commercial',
            'status' => 'design',
            'location' => '456 Main Street, Austin, TX',
            'budget' => 45000000.00,
            'start_date' => '2024-06-01',
            'end_date' => '2026-12-31',
            'created_by' => 2, // PM
            'project_manager_id' => 2, // Michael Chen
            'team_members' => [2, 3, 4, 8], // PM, Architect, Engineer, Designer
            'client_name' => 'Downtown Development Corp',
            'client_contact' => 'info@downtowndev.com',
            'notes' => 'LEED Platinum certification required. Complex foundation due to urban location.',
            'is_active' => true,
        ]);

        // Renovation Project - Review Phase
        \App\Models\Project::create([
            'name' => 'Historic Library Renovation',
            'code' => 'RH-2024-003',
            'description' => 'Complete renovation of 1920s historic library building while preserving architectural heritage.',
            'type' => 'renovation',
            'status' => 'review',
            'location' => '789 Heritage Avenue, Austin, TX',
            'budget' => 3200000.00,
            'start_date' => '2023-09-01',
            'end_date' => '2024-08-31',
            'completion_date' => '2024-08-15',
            'created_by' => 1, // Admin
            'project_manager_id' => 2, // Michael Chen
            'team_members' => [2, 3, 8], // PM, Architect, Designer
            'client_name' => 'City of Austin',
            'client_contact' => 'projects@austintexas.gov',
            'notes' => 'Historic preservation requirements. Special permits required for structural modifications.',
            'is_active' => true,
        ]);

        // Industrial Project - On Hold
        \App\Models\Project::create([
            'name' => 'Manufacturing Facility Expansion',
            'code' => 'RH-2024-004',
            'description' => 'Expansion of existing manufacturing facility to add 50,000 sq ft of production space.',
            'type' => 'industrial',
            'status' => 'on_hold',
            'location' => '1000 Industrial Blvd, Round Rock, TX',
            'budget' => 12000000.00,
            'start_date' => '2024-03-01',
            'end_date' => '2025-01-31',
            'created_by' => 2, // PM
            'project_manager_id' => 2, // Michael Chen
            'team_members' => [2, 4, 5], // PM, Engineer, Contractor
            'client_name' => 'TechManufacturing Inc.',
            'client_contact' => 'facilities@techmanuf.com',
            'notes' => 'Project paused due to permit delays. Environmental impact study in progress.',
            'is_active' => true,
        ]);

        // Completed Project
        \App\Models\Project::create([
            'name' => 'Greenwood Elementary School',
            'code' => 'RH-2023-005',
            'description' => 'New elementary school building with 20 classrooms, gymnasium, and cafeteria.',
            'type' => 'infrastructure',
            'status' => 'completed',
            'location' => '500 Greenwood Lane, Cedar Park, TX',
            'budget' => 15000000.00,
            'start_date' => '2022-08-01',
            'end_date' => '2023-12-15',
            'completion_date' => '2023-12-01',
            'created_by' => 1, // Admin
            'project_manager_id' => 2, // Michael Chen
            'team_members' => [2, 3, 4, 5], // PM, Architect, Engineer, Contractor
            'client_name' => 'Cedar Park ISD',
            'client_contact' => 'construction@cpschools.org',
            'notes' => 'Successfully completed ahead of schedule. Received safety award.',
            'is_active' => false,
        ]);
    }
}

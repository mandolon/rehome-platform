<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tasks for Sunset Ridge Residential Complex (Project 1)
        $project1Tasks = [
            [
                'title' => 'Foundation Excavation',
                'description' => 'Excavate foundation areas for all building units according to architectural plans.',
                'status' => 'completed',
                'priority' => 'high',
                'category' => 'construction',
                'project_id' => 1,
                'assigned_to' => 5, // Contractor
                'created_by' => 2, // PM
                'start_date' => '2024-01-15',
                'due_date' => '2024-02-15',
                'completed_at' => '2024-02-10',
                'estimated_hours' => 200.0,
                'actual_hours' => 185.0,
                'completion_percentage' => 100,
                'notes' => 'Completed ahead of schedule. No unexpected soil conditions encountered.',
            ],
            [
                'title' => 'Electrical System Design Review',
                'description' => 'Review and approve electrical system designs for energy efficiency compliance.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'category' => 'design',
                'project_id' => 1,
                'assigned_to' => 4, // Engineer
                'created_by' => 3, // Architect
                'start_date' => '2024-03-01',
                'due_date' => '2024-03-30',
                'estimated_hours' => 80.0,
                'actual_hours' => 40.0,
                'completion_percentage' => 60,
                'notes' => 'Waiting for utility company approval on main service connection.',
            ],
            [
                'title' => 'Solar Panel Installation Planning',
                'description' => 'Plan solar panel installation layout and schedule subcontractor coordination.',
                'status' => 'pending',
                'priority' => 'medium',
                'category' => 'engineering',
                'project_id' => 1,
                'assigned_to' => 4, // Engineer
                'created_by' => 2, // PM
                'start_date' => '2024-04-15',
                'due_date' => '2024-05-15',
                'estimated_hours' => 60.0,
                'completion_percentage' => 0,
                'dependencies' => [2], // Depends on electrical design review
                'notes' => 'Coordinate with solar contractor and utility company.',
            ],
            [
                'title' => 'Unit 1-10 Framing Inspection',
                'description' => 'Coordinate framing inspection for units 1-10 with city building department.',
                'status' => 'pending',
                'priority' => 'urgent',
                'category' => 'inspection',
                'project_id' => 1,
                'assigned_to' => 7, // Site Supervisor
                'created_by' => 5, // Contractor
                'start_date' => '2024-04-01',
                'due_date' => '2024-04-05',
                'estimated_hours' => 16.0,
                'completion_percentage' => 0,
                'notes' => 'Schedule with inspector Johnson. Ensure all corrections from last review are complete.',
            ],
        ];

        // Tasks for Downtown Office Tower (Project 2)
        $project2Tasks = [
            [
                'title' => 'Structural Engineering Design',
                'description' => 'Complete structural engineering design for 25-story tower including wind load analysis.',
                'status' => 'in_progress',
                'priority' => 'high',
                'category' => 'engineering',
                'project_id' => 2,
                'assigned_to' => 4, // Engineer
                'created_by' => 2, // PM
                'start_date' => '2024-02-01',
                'due_date' => '2024-05-31',
                'estimated_hours' => 400.0,
                'actual_hours' => 200.0,
                'completion_percentage' => 50,
                'notes' => 'Complex high-rise design. Wind tunnel testing scheduled for April.',
            ],
            [
                'title' => 'Architectural Floor Plans',
                'description' => 'Develop detailed architectural floor plans for all 25 floors including retail space.',
                'status' => 'in_progress',
                'priority' => 'high',
                'category' => 'design',
                'project_id' => 2,
                'assigned_to' => 3, // Architect
                'created_by' => 2, // PM
                'start_date' => '2024-01-15',
                'due_date' => '2024-04-30',
                'estimated_hours' => 300.0,
                'actual_hours' => 180.0,
                'completion_percentage' => 65,
                'notes' => 'Client requested changes to retail layout. Revisions in progress.',
            ],
            [
                'title' => 'LEED Certification Documentation',
                'description' => 'Prepare all documentation required for LEED Platinum certification.',
                'status' => 'pending',
                'priority' => 'medium',
                'category' => 'documentation',
                'project_id' => 2,
                'assigned_to' => 8, // Designer
                'created_by' => 3, // Architect
                'start_date' => '2024-03-01',
                'due_date' => '2024-08-31',
                'estimated_hours' => 120.0,
                'completion_percentage' => 0,
                'notes' => 'Coordinate with sustainability consultant. Start after design phase 50% complete.',
            ],
        ];

        // Tasks for Historic Library Renovation (Project 3)
        $project3Tasks = [
            [
                'title' => 'Final Quality Control Inspection',
                'description' => 'Comprehensive quality control inspection of all renovation work.',
                'status' => 'completed',
                'priority' => 'high',
                'category' => 'quality_control',
                'project_id' => 3,
                'assigned_to' => 3, // Architect
                'created_by' => 2, // PM
                'start_date' => '2024-08-01',
                'due_date' => '2024-08-15',
                'completed_at' => '2024-08-12',
                'estimated_hours' => 40.0,
                'actual_hours' => 35.0,
                'completion_percentage' => 100,
                'notes' => 'All work meets historic preservation standards. Minor touch-ups completed.',
            ],
            [
                'title' => 'Client Final Walkthrough',
                'description' => 'Conduct final walkthrough with client and obtain project acceptance.',
                'status' => 'review',
                'priority' => 'high',
                'category' => 'other',
                'project_id' => 3,
                'assigned_to' => 2, // PM
                'created_by' => 2, // PM
                'start_date' => '2024-08-16',
                'due_date' => '2024-08-20',
                'estimated_hours' => 8.0,
                'completion_percentage' => 90,
                'dependencies' => [7], // Depends on QC inspection
                'notes' => 'Schedule final walkthrough with city representatives.',
            ],
        ];

        // Create all tasks
        foreach ([$project1Tasks, $project2Tasks, $project3Tasks] as $projectTasks) {
            foreach ($projectTasks as $task) {
                \App\Models\Task::create($task);
            }
        }

        // Additional sample tasks for other projects
        \App\Models\Task::create([
            'title' => 'Environmental Impact Assessment',
            'description' => 'Complete environmental impact study for manufacturing facility expansion.',
            'status' => 'blocked',
            'priority' => 'high',
            'category' => 'permits',
            'project_id' => 4, // Manufacturing Facility
            'assigned_to' => 4, // Engineer
            'created_by' => 2, // PM
            'start_date' => '2024-03-15',
            'due_date' => '2024-05-15',
            'estimated_hours' => 200.0,
            'completion_percentage' => 30,
            'notes' => 'Waiting for additional environmental data from consultant.',
        ]);
    }
}

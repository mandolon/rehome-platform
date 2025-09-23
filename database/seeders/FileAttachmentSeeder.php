<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FileAttachmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // File attachments for Sunset Ridge Residential Complex (Project 1)
        $projectFiles = [
            [
                'filename' => 'sunset_ridge_site_plan.dwg',
                'stored_name' => 'proj_1_site_plan_' . uniqid() . '.dwg',
                'path' => 'attachments/projects/sunset_ridge_site_plan.dwg',
                'mime_type' => 'application/acad',
                'file_size' => 2450000,
                'type' => 'drawing',
                'description' => 'Master site plan showing all building locations, utilities, and landscaping.',
                'version' => '1.3',
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 1,
                'uploaded_by' => 3, // Architect
                'is_public' => false,
                'metadata' => [
                    'drawing_scale' => '1:500',
                    'sheet_size' => 'A1',
                    'revision_date' => '2024-02-15',
                    'cad_version' => 'AutoCAD 2024'
                ],
            ],
            [
                'filename' => 'foundation_specifications.pdf',
                'stored_name' => 'proj_1_foundation_specs_' . uniqid() . '.pdf',
                'path' => 'attachments/projects/foundation_specifications.pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 1200000,
                'type' => 'specification',
                'description' => 'Detailed foundation specifications including concrete mix design and rebar requirements.',
                'version' => '2.0',
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 1,
                'uploaded_by' => 4, // Engineer
                'is_public' => false,
                'metadata' => [
                    'pages' => 45,
                    'created_by_software' => 'Adobe Acrobat',
                    'approval_status' => 'approved'
                ],
            ],
            [
                'filename' => 'unit_floor_plans.pdf',
                'stored_name' => 'proj_1_floor_plans_' . uniqid() . '.pdf',
                'path' => 'attachments/projects/unit_floor_plans.pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 3500000,
                'type' => 'drawing',
                'description' => 'Floor plans for all unit types (1BR, 2BR, 3BR) with dimensions and fixture locations.',
                'version' => '1.5',
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 1,
                'uploaded_by' => 3, // Architect
                'is_public' => true,
                'metadata' => [
                    'unit_types' => ['1BR', '2BR', '3BR'],
                    'total_sheets' => 12,
                    'scale' => '1/4" = 1\'-0"'
                ],
            ],
        ];

        // File attachments for Downtown Office Tower (Project 2)
        $project2Files = [
            [
                'filename' => 'structural_analysis_report.pdf',
                'stored_name' => 'proj_2_structural_' . uniqid() . '.pdf',
                'path' => 'attachments/projects/structural_analysis_report.pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 8900000,
                'type' => 'report',
                'description' => 'Comprehensive structural analysis report including wind and seismic load calculations.',
                'version' => '1.0',
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 2,
                'uploaded_by' => 4, // Engineer
                'is_public' => false,
                'metadata' => [
                    'pages' => 156,
                    'analysis_software' => 'ETABS 2023',
                    'peer_reviewed' => true
                ],
            ],
            [
                'filename' => 'office_tower_renderings.zip',
                'stored_name' => 'proj_2_renderings_' . uniqid() . '.zip',
                'path' => 'attachments/projects/office_tower_renderings.zip',
                'mime_type' => 'application/zip',
                'file_size' => 25600000,
                'type' => 'drawing',
                'description' => 'High-resolution architectural renderings showing exterior and interior spaces.',
                'version' => '2.1',
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 2,
                'uploaded_by' => 8, // Designer
                'is_public' => true,
                'metadata' => [
                    'rendering_software' => '3ds Max + V-Ray',
                    'image_count' => 24,
                    'resolution' => '4K'
                ],
            ],
        ];

        // File attachments for Tasks
        $taskFiles = [
            [
                'filename' => 'excavation_photos.zip',
                'stored_name' => 'task_1_photos_' . uniqid() . '.zip',
                'path' => 'attachments/tasks/excavation_photos.zip',
                'mime_type' => 'application/zip',
                'file_size' => 15400000,
                'type' => 'photo',
                'description' => 'Progress photos of foundation excavation work.',
                'version' => null,
                'attachable_type' => 'App\\Models\\Task',
                'attachable_id' => 1, // Foundation Excavation task
                'uploaded_by' => 7, // Site Supervisor
                'is_public' => false,
                'metadata' => [
                    'photo_count' => 36,
                    'date_taken' => '2024-02-08',
                    'camera' => 'iPhone 15 Pro'
                ],
            ],
            [
                'filename' => 'electrical_layout_v2.dwg',
                'stored_name' => 'task_2_electrical_' . uniqid() . '.dwg',
                'path' => 'attachments/tasks/electrical_layout_v2.dwg',
                'mime_type' => 'application/acad',
                'file_size' => 1800000,
                'type' => 'cad_file',
                'description' => 'Updated electrical layout with energy efficiency improvements.',
                'version' => '2.0',
                'attachable_type' => 'App\\Models\\Task',
                'attachable_id' => 2, // Electrical System Design Review task
                'uploaded_by' => 4, // Engineer
                'is_public' => false,
                'metadata' => [
                    'drawing_scale' => '1:100',
                    'revision_notes' => 'Added LED lighting circuits and smart home integration'
                ],
            ],
            [
                'filename' => 'inspection_checklist.pdf',
                'stored_name' => 'task_4_checklist_' . uniqid() . '.pdf',
                'path' => 'attachments/tasks/inspection_checklist.pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 450000,
                'type' => 'document',
                'description' => 'Framing inspection checklist with city building code requirements.',
                'version' => '1.0',
                'attachable_type' => 'App\\Models\\Task',
                'attachable_id' => 4, // Framing Inspection task
                'uploaded_by' => 7, // Site Supervisor
                'is_public' => false,
                'metadata' => [
                    'pages' => 8,
                    'inspection_type' => 'framing',
                    'code_reference' => 'IBC 2021'
                ],
            ],
        ];

        // Historic Library files
        $project3Files = [
            [
                'filename' => 'historic_preservation_certificate.pdf',
                'stored_name' => 'proj_3_certificate_' . uniqid() . '.pdf',
                'path' => 'attachments/projects/historic_preservation_certificate.pdf',
                'mime_type' => 'application/pdf',
                'file_size' => 890000,
                'type' => 'certificate',
                'description' => 'Official historic preservation compliance certificate from state historic commission.',
                'version' => null,
                'attachable_type' => 'App\\Models\\Project',
                'attachable_id' => 3,
                'uploaded_by' => 1, // Admin
                'is_public' => true,
                'metadata' => [
                    'issuing_authority' => 'Texas Historical Commission',
                    'certificate_number' => 'THC-2024-0087',
                    'valid_until' => '2029-08-15'
                ],
            ],
        ];

        // Create all file attachments
        foreach ([$projectFiles, $project2Files, $taskFiles, $project3Files] as $files) {
            foreach ($files as $file) {
                \App\Models\FileAttachment::create($file);
            }
        }
    }
}
